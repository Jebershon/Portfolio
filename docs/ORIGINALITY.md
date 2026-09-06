# Originality check — the "Instrument" direction

Asked 2026-09-06: *does anyone already use this type of template?* Short answer:
**there is no template — this is bespoke — and while every ingredient exists
somewhere, the specific combination was not found in use anywhere searched.**
Details, with the honest caveats, below.

## What was checked

Web search across portfolio showcases (Awwwards, Codrops, CreativeDevJobs,
Muzli), trend round-ups for 2025–26, template marketplaces, and the three.js /
R3F tutorial ecosystem. Searches cannot prove uniqueness — only that nothing
matching turned up in a reasonably wide sweep.

## Ingredient by ingredient

| Ingredient in our design | How common | Evidence |
|---|---|---|
| Glass / refraction hero object (transmission material) | **Established genre.** A well-documented technique with tutorials and award-winning examples | Codrops *Warping 3D Text Inside a Glass Torus* (2025); Olivier Larose's *3D Glass Effect* tutorial; Awwwards *WebGL Refraction hover effect — Dorian Lods Portfolio 2025*; Originkit's refractive glass-logo component |
| Text or a logo refracted *through* the glass | **Exists as a technique**, usually as a demo or a component, not as a person's mark | The Codrops torus article does exactly this with 3D text; Originkit ships a "glass icon" that refracts a logo |
| Editorial serif display + monospace metadata | **A current trend**, so credible now — and worth watching so it doesn't date | Font-pairing guides name Instrument Serif + Space Mono as a 2026 pairing; Lovable sells a "serif editorial designer portfolio"; a "Field Log" template pairs serif type with terminal details for developers |
| Projects as a hairline-ruled index rather than cards | **Common** in editorial portfolios | Standard pattern across Awwwards-style portfolio lists |
| Career as a terminal-style log | **Adjacent genre exists** (portfolios that *are* a terminal), the specific deploy/build/init/learn log line was not found | clifolio; the "DevOps portfolio as `$ whoami` / `cat experience.json`" pattern |
| Instanced lattice field + procedural aurora, scroll-staged, theme-reactive shaders | **Not found** as a combination | — |
| Light mode as pigment, dark mode as light (same hues, different physics) | **Not found** stated anywhere | — |

## What we deliberately avoided

The dominant 2025–26 developer-portfolio patterns, per the trend pieces: dark
mode as default, glassmorphism *cards*, bento/modular grids, gradient-blob
heroes, decorative particle fields, skill percentage bars. We use none of them.
(Our glass is one object, not a UI surface; our light mode is first-class.)

## Verdict

- **Template:** none. The prototype is hand-built; no marketplace product matches it.
- **Ingredients:** all exist. Refractive glass heroes are an award-site genre and
  the serif+mono editorial pairing is in fashion.
- **Combination:** not found anywhere searched. The parts that carry the
  distinctiveness are (1) the glass object refracting the owner's *own monogram*
  as the compositional centre, (2) the three-layer scroll-staged scene with
  theme-reactive shader palettes, and (3) the career-as-build-log. Lean on those;
  the typography alone would not be distinctive.
- **Risk to note:** the serif+mono look is trending, which means it will be
  common by 2027. The 3D composition and the build-log are what will still read
  as ours.

## Sources

- https://tympanus.net/codrops/2025/03/13/warping-3d-text-inside-a-glass-torus/
- https://blog.olivierlarose.com/tutorials/3d-glass-effect
- https://www.awwwards.com/inspiration/webgl-refraction-hover-effect-dorian-lods-portfolio-2025
- https://www.originkit.dev/components/glass-icon
- https://www.creativedevjobs.com/blog/best-threejs-portfolio-examples-2025
- https://thecrit.co/resources/best-font-pairings-portfolio
- https://lovable.dev/templates/websites/portfolio/serif-editorial-designer-portfolio
- https://dev.to/depapp/clifolio-portfolios-that-live-in-the-terminal-44n5
- https://elements.envato.com/learn/portfolio-trends
- https://colorlib.com/wp/portfolio-design-trends/
- https://remoteworks.pro/blog/portfolio-design-trends-2026
