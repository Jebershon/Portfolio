import { Fragment } from "react";
import { stack } from "../content";
import SectionHead from "./SectionHead";

// Grouped skills — category label beside the tools in that group.
export default function Stack() {
  return (
    <section id="stack">
      <div className="wrap">
        <SectionHead index={stack.index} title={stack.title} blurb={stack.blurb} />
        <dl className="stack" data-reveal>
          {stack.groups.map((g) => (
            <Fragment key={g.name}>
              <dt>{g.name}</dt>
              <dd>{g.items}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </section>
  );
}
