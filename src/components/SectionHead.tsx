/** The shared section header: an outlined index number beside a title and blurb. */
export default function SectionHead({ index, title, blurb }: { index: string; title: string; blurb: string }) {
  return (
    <div className="sec-head" data-reveal>
      <div className="sec-idx">{index}</div>
      <div>
        <h2>{title}</h2>
        <p>{blurb}</p>
      </div>
    </div>
  );
}
