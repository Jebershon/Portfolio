import { Fragment } from "react";
import { work } from "../content";
import SectionHead from "./SectionHead";

export default function Work() {
  const { featured, ledger } = work;
  return (
    <section id="work">
      <div className="wrap">
        <SectionHead index={work.index} title={work.title} blurb={work.blurb} />

        <article className="feature" data-reveal>
          <div>
            <span className="mono">{featured.kicker}</span>
            <h3>{featured.name}</h3>
            <p>{featured.blurb}</p>
            {featured.ctaHref && (
              <a className="cta" href={featured.ctaHref}>
                {featured.ctaLabel} <span>→</span>
              </a>
            )}
          </div>
          <dl className="spec">
            {featured.spec.map((s) => (
              <Fragment key={s.label}>
                <b>{s.label}</b>
                <span>{s.value}</span>
              </Fragment>
            ))}
          </dl>
        </article>

        <ol className="ledger">
          {ledger.map((row) => (
            <li key={row.n} data-reveal>
              <span className="n">{row.n}</span>
              <span className="name">{row.name}</span>
              <span className="desc">{row.desc}</span>
              <span className="spec">
                {row.spec.map((part, i) => (
                  <span key={i}>
                    {i > 0 && <i>/</i>}
                    {part}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
