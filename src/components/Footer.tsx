import { footer } from "../content";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-in mono">
        {footer.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </footer>
  );
}
