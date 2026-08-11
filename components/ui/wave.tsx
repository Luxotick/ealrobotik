const back = "M0,20 C259,20 461,48 720,48 C979,48 1181,20 1440,20 C1699,20 1901,48 2160,48 C2419,48 2581,20 2880,20 L2880,60 L0,60 Z"
const front = "M0,52 C259,52 461,32 720,32 C979,32 1181,52 1440,52 C1699,52 1901,32 2160,32 C2419,32 2581,52 2880,52 L2880,60 L0,60 Z"

export function Wave() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-12 md:h-16 overflow-hidden">
      <div className="wave-track-back absolute left-0 bottom-0 h-full w-[200%]">
        <svg className="h-full w-full" viewBox="0 0 2880 60" preserveAspectRatio="none">
          <path d={back} fill="#347c8c" opacity="0.35" />
        </svg>
      </div>
      <div className="wave-track-front absolute left-0 bottom-0 h-full w-[200%]">
        <svg className="h-full w-full" viewBox="0 0 2880 60" preserveAspectRatio="none">
          <path d={front} fill="#89e0f4" opacity="0.7" />
        </svg>
      </div>
    </div>
  )
}
