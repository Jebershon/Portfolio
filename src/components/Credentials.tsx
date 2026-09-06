import { credentials } from "../content";
import SectionHead from "./SectionHead";

// Achievements up top, then every certification as a scannable chip.
export default function Credentials() {
  const { awards, certs, certTotal } = credentials;
  return (
    <section id="creds">
      <div className="wrap">
        <SectionHead index={credentials.index} title={credentials.title} blurb={credentials.blurb} />

        <ul className="awards" data-reveal>
          {awards.map((a) => (
            <li key={a.label}>
              <span className="k">{a.label}</span>
              <span className="m">
                {a.href ? (
                  <a href={a.href} target="_blank" rel="noreferrer">
                    {a.text}
                  </a>
                ) : (
                  a.text
                )}
              </span>
            </li>
          ))}
        </ul>

        <p className="certs-head">Certifications — {certTotal} in total</p>
        <ul className="certs" data-reveal>
          {certs.map((c) => (
            <li key={c.name}>
              <b>{c.name}</b> <i>{c.issuer}</i>
            </li>
          ))}
          {certTotal > certs.length && <li className="more">+{certTotal - certs.length} more</li>}
        </ul>
      </div>
    </section>
  );
}
