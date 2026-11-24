const vertexSource = `#version 300 es
void main() {
  // One oversized triangle covers the viewport without a diagonal seam.
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`

const fragmentSource = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uPrimary;
uniform vec3 uHighlight;
out vec4 fragColor;

float bell(float distance) {
  return exp(-distance * distance);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float t = mod(uTime / 30.0, 6.2831853);

  // Bend the flow in two directions so the folds open and close as they drift.
  float bend = 0.097 * sin(6.7 * uv.x + t - 0.5)
             + 0.046 * sin(9.0 * uv.x + 5.5 * uv.y - 2.0 * t);
  float flow = uv.y - 0.12 - 0.77 * uv.x - bend;
  float width = 0.15 + 0.042 * sin(5.0 * uv.x + t + 0.7);
  float fold = flow / width;

  float body = bell(fold * 0.76);
  float sheen = bell((fold - 0.46) * 3.7);
  float echo = bell((fold + 1.35 + 0.15 * sin(6.3 * uv.x - t)) * 2.0);

  // Fine contours follow the folds and fade into the wider wash.
  float contour = fold * 4.6 + 0.35 * sin(9.0 * uv.x - t + fold);
  float seam = abs(fract(contour + 0.5) - 0.5);
  float antialias = max(fwidth(contour), 0.01);
  float lines = (1.0 - smoothstep(0.026, 0.026 + antialias, seam))
    * (1.0 - smoothstep(0.16, 0.36, antialias));

  // Keep the central column quiet so the motion frames the page content.
  float edge = smoothstep(0.13, 0.5, abs(uv.x - 0.5));
  float emphasis = mix(0.12, 1.0, edge);
  float alpha = (0.22 * body + 0.15 * sheen + 0.105 * echo + 0.10 * lines * body)
    * emphasis;
  float tint = clamp(0.17 + 0.58 * sheen + 0.54 * uv.x, 0.0, 1.0);
  fragColor = vec4(mix(uPrimary, uHighlight, tint), alpha);
}`

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader

  gl.deleteShader(shader)
  return null
}

function themeColor(styles: CSSStyleDeclaration, name: string) {
  const [hue, saturation, lightness] = styles.getPropertyValue(name).trim().split(/\s+/).map(parseFloat)
  const light = lightness / 100
  const chroma = (saturation / 100) * Math.min(light, 1 - light)

  return [0, 8, 4].map(offset => {
    const channel = (offset + hue / 30) % 12
    return light - chroma * Math.max(-1, Math.min(channel - 3, 9 - channel, 1))
  })
}

export function createBackgroundRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
    premultipliedAlpha: false,
    failIfMajorPerformanceCaveat: true,
  })
  if (!gl) return null

  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  const program = gl.createProgram()

  if (program && vertex && fragment) {
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
  }
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)

  if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  gl.useProgram(program)
  const resolution = gl.getUniformLocation(program, 'uResolution')
  const time = gl.getUniformLocation(program, 'uTime')
  const primary = gl.getUniformLocation(program, 'uPrimary')
  const highlight = gl.getUniformLocation(program, 'uHighlight')

  return {
    resize() {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const scale = Math.min(0.9, 1280 / Math.max(width, height))
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolution, canvas.width, canvas.height)
    },
    setPalette(styles: CSSStyleDeclaration) {
      gl.uniform3fv(primary, themeColor(styles, '--primary'))
      gl.uniform3fv(highlight, themeColor(styles, '--highlight'))
    },
    draw(seconds: number) {
      gl.uniform1f(time, seconds)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    dispose() {
      gl.useProgram(null)
      gl.deleteProgram(program)
    },
  }
}
