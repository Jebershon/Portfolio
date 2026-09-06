import { brand, footer } from "../content";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-top">
        <div className="foot-brand">
          <a className="brand" href="#top">
            {brand.left}
            <b>/</b>
            {brand.right}
          </a>
          <p>{footer.tagline}</p>
        </div>

        <div className="foot-cols">
          {footer.columns.map((col) => (
            <nav key={col.head} className="foot-col">
              <span className="foot-h">{col.head}</span>
              {col.links.map((l) => {
                const external = l.href.startsWith("http") || l.href.endsWith(".pdf");
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {l.label}
                  </a>
                );
              })}
            </nav>
          ))}
        </div>
      </div>

      <div className="wrap foot-base">
        {footer.meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </footer>
  );
}
