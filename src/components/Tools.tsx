import { tools } from "../content";
import SectionHead from "./SectionHead";

// A lighter, secondary ledger: the side projects I've open-sourced.
// Each row is a link straight to its GitHub repo (or live demo).
export default function Tools() {
  return (
    <section id="tools">
      <div className="wrap">
        <SectionHead index={tools.index} title={tools.title} blurb={tools.blurb} />
        <ol className="ledger">
          {tools.items.map((t) => (
            <li key={t.n} data-reveal>
              <span className="n">{t.n}</span>
              <span className="name">{t.name}</span>
              <span className="desc">{t.desc}</span>
              <a className="go" href={t.link} target="_blank" rel="noreferrer">
                {t.linkLabel} <span className="arrow">↗</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
