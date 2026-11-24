import { ArrowUpRight, Globe, Instagram, Mail, MapPin } from 'lucide-react'
import { contact } from '@/data/girls'

export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div>
        <h2>Work with us</h2>
        <p>Get in touch about workshops, mentorship or collaborating with our team.</p>
      </div>
      <ul className="contact-list">
        <li>
          <a href={'mailto:' + contact.email}>
            <Mail aria-hidden="true" /> <span>{contact.email}</span> <ArrowUpRight aria-hidden="true" />
          </a>
        </li>
        <li>
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram aria-hidden="true" /> <span>@ealrobotik_8828</span> <ArrowUpRight aria-hidden="true" />
          </a>
        </li>
        <li>
          <a href={contact.mainSite} target="_blank" rel="noopener noreferrer">
            <Globe aria-hidden="true" /> <span>ealrobotik.com</span> <ArrowUpRight aria-hidden="true" />
          </a>
        </li>
        <li><p><MapPin aria-hidden="true" /> <span>{contact.school}</span></p></li>
      </ul>
    </section>
  )
}
