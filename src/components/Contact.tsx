import { contact } from "../content";

export default function Contact() {
  return (
    <section id="contact" className="close">
      <div className="wrap">
        <div data-reveal>
          <h2>
            {contact.lead.before}
            <em>{contact.lead.em}</em>
            {contact.lead.after}
          </h2>
          <div className="close-row">
            <a className="cta" href={contact.emailHref}>
              {contact.email} <span>→</span>
            </a>
            <span className="avail mono">{contact.availability}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
