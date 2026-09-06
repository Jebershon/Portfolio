import { Fragment } from "react";
import { hero } from "../content";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="spec-top mono">
          {hero.specTop.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>

        <h1>
          {hero.headline.map((word, i) => (
            // The space sits between the words, not inside each inline-block span,
            // otherwise it collapses and the words run together.
            <Fragment key={i}>
              <span className="w">{word.em ? <em>{word.text}</em> : word.text}</span>{" "}
            </Fragment>
          ))}
        </h1>

        <p className="lede">{hero.lede}</p>

        <dl className="spec-strip">
          {hero.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="scroll-cue mono">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
