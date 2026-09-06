import { path } from "../content";
import SectionHead from "./SectionHead";

export default function Path() {
  return (
    <section id="path">
      <div className="wrap">
        <SectionHead index={path.index} title={path.title} blurb={path.blurb} />
        <ol className="log" data-reveal>
          {path.log.map((entry, i) => (
            <li key={i}>
              <span className="t">{entry.when}</span>
              <span className="k">{entry.kind}</span>
              <span className="m">
                {entry.title}
                <small>{entry.detail}</small>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
