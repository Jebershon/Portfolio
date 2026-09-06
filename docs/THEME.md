# Theme spec — "Forge"

**Decided 2026-09-03.** One composite scene combining Aurora, Lattice and Prism,
in both light and dark. This file is the spec; [PLAN.md](PLAN.md) has the phases
that build it.

## Direction lock — 2026-09-06

**LOCKED 2026-09-06.** No longer conditional. The **"Instrument"** direction is
confirmed and is the baseline the phase-04/05 build implements: editorial serif
display (Fraunces) with italic forge accent, JetBrains Mono metadata, Instrument
Sans body; projects as a hairline ledger; career as a build log; a translucent
zero-gravity **liquid** as the hero focus object, pointer-reactive and anchored
in place; light mode as pigment, dark as light. Prototype:
`prototype/forge-prototype.html`.

**Focus object — settled 2026-09-06.** The glass prism (and the five procedural
candidates, and the loaded-model route) are retired. The focus layer is a
**liquid**: water floating in zero gravity — a few masses on slow orbits,
smooth-unioned in a raymarched SDF, translucent in the middle and dense at the
rim, its skin always rippling. It stays where it is; a **click** kicks the
masses apart and sends a ring across the surface, which damps out. Colours come from
the same tokens as the aurora — luminous steel with a forge rim in dark, deep
teal pigment on paper in light. The refracted-monogram idea goes with the glass;
the monogram stays as a mark peeking out beside the liquid. The prototype is
back on the confirmed v4 layout — the candidate shapes had crowded the headline.

Originality check: [ORIGINALITY.md](ORIGINALITY.md).

---

## The core idea

Not three effects on a page. **One scene, three layers, front to back.**

```
   camera
     │
     ▼
  ┌─────────────────────────────────────────┐
  │  LIQUID     zero-g water blob, z ≈ 2    │  ← focus
  │  ─────────────────────────────────────  │
  │  LATTICE    instanced grid, z ≈ -6      │  ← structure
  │  ─────────────────────────────────────  │
  │  AURORA     fBm shader plane, z ≈ -20   │  ← ground / palette
  └─────────────────────────────────────────┘
```

The three layers share one canvas, one `WebGLRenderer`, one requestAnimationFrame
loop, and one set of theme tokens, and they cross-fade together on a theme
change. The liquid is a raymarched metaball SDF — **not** glass; the
transmission/refraction idea was retired with the prism — and it reads its
steel/forge tint from the same CSS variables as the aurora and lattice. Scroll
staging still governs which layers are active in which section (below).

One `<canvas>`, one `WebGLRenderer`, one `requestAnimationFrame` loop.

## Scroll staging

The other half of affording it. Each layer has an `intensity` in `0..1` driven
by scroll position; at `0` the layer is skipped entirely, not just faded.

| Section | Aurora | Lattice | Prism | Est. frame cost |
|---|---|---|---|---|
| Hero | full | full | **yes** | ~7–9 ms |
| About / Experience | static | — | — | ~0 ms |
| Projects | dim | full | — | ~2–3 ms |
| Writing / Certs | static | — | — | ~0 ms |
| Contact | full | — | — | ~1 ms |

Only the hero pays for all three, and the hero is where attention actually is.
Everywhere else the page is effectively static, which is what keeps scrolling
smooth on a mid-range phone.

*Estimates until measured on real hardware. Phase 05 measures each layer
independently before the next one is added.*

## Performance tiers

Chosen at runtime, then adjusted if the frame rate says otherwise.

| Tier | Condition | Renders |
|---|---|---|
| **A** | Desktop, WebGL2, sustained ≥ 45 fps | all three layers |
| **B** | Mobile, or tier A dropped < 45 fps for 2 s | Aurora + Lattice, no Prism |
| **C** | `prefers-reduced-motion`, no WebGL, or < 30 fps for 2 s | static pre-rendered gradient, CSS only |

Demotion is one-way within a session. Nothing is more irritating than a page
that oscillates between quality levels while you scroll.

Tier C is a real design, not a failure state: a pre-rendered AVIF of the Aurora
at hero size, roughly 25 KB, with the layout unchanged. Most viewers will never
know a canvas was involved.

---

## Light and dark

Three states, not two: `data-theme="dark"`, `data-theme="light"`, and the
default with no attribute where only `prefers-color-scheme` decides.

### The palette rule

Light mode is **not** an inversion. Inverting the dark aurora puts a bright
orange smear on white and it reads as a rendering bug.

Same hue relationships, different physical metaphor:

> **Dark mode is emitted light. Light mode is pigment.**

Dark: colour glows *out* of a deep ground — additive, luminous, high contrast.
Light: colour sits *on* a pale ground — subtractive, like risograph overprint,
lower contrast and more saturated per unit of brightness.

| Role | Dark | Light |
|---|---|---|
| Ground | `#0a1017` deep slate | `#eef0f2` cool paper |
| Steel (primary) | `#3f9fb0` luminous teal | `#1d6b76` deep teal ink |
| Forge (accent) | `#e3873f` warm glow | `#a84a18` burnt terracotta |
| Aurora bands | additive, `screen`-like | multiply-like tints, never additive |
| Lattice cells | bright on dark, glow on hover | dark on light, saturate on hover |
| Liquid water | luminous, warm-rimmed on dark | translucent teal on paper — see below |

### Per-layer adjustments

**Aurora.** Dark uses additive band accumulation. Light must not — additive on a
pale ground clips to white and loses all hue. Light mode multiplies tints into
the paper instead, and drops band contrast by roughly half.

**Lattice.** Cell colour inverts in luminance but keeps hue. The cursor "heat"
becomes *saturation* rather than *brightness*, since there is no headroom to
brighten toward on a light ground.

**Liquid.** The hard one on paper: translucent water on a pale ground nearly
vanishes. Light mode leans on the *rim* rather than the body — the fresnel term
carries most of the alpha and colour so the silhouette and grazing edge stay
legible, while the clear centre lets the field show through. Specular highlights
stay bright in both themes; the warm forge rim is strong in dark and faint in
light. The body tints from the steel token, never a literal.

### Switching without a re-init

The palette lives in **CSS custom properties**, one source of truth for both DOM
and WebGL:

```
:root            { --aurora-ground: #eef0f2; --aurora-steel: #1d6b76; … }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --aurora-ground: #0a1017; … }
}
:root[data-theme="dark"]          { --aurora-ground: #0a1017; … }
```

On theme change, JS reads the resolved values with `getComputedStyle` and
**cross-fades the shader uniforms over ~400 ms**. No renderer teardown, no
context loss, no flash. Change a hex in CSS and the 3D follows — the shader
never hardcodes a colour.

### Toggle behaviour

Three-state control: **System · Light · Dark**. Defaults to System, persists the
choice in `localStorage`, and applies it before first paint via a tiny inline
script so there is no flash of the wrong theme.

**Found live 2026-09-06:** the artifact viewer stamps its own `data-theme` on
`<html>`, and the first prototype wrote the owner's choice to the same
attribute. When the host restamped, the CSS flipped while the WebGL palette
stayed put — pale text on a light canvas under a dark veil. Rule from now on:
the owner's choice lives on **`<body data-mode>`**, the palette is read from
`<body>`, and a `MutationObserver` on `<html>` re-syncs the canvas whenever the
host restamps. Auto follows the host; an explicit choice always wins.

---

## What each layer is for

Worth stating, because it governs every later judgement call.

**Aurora** carries the palette and the atmosphere. It is the layer that makes
the page feel like something rather than nothing, and it is nearly free. If only
one layer survives the performance budget, it is this one.

**Lattice** carries the meaning. Grids, cells, structure, response to input —
the visual vocabulary of build output and systems. It is the layer that says
*this person builds tooling*, which is the whole positioning
([IDEAS.md](IDEAS.md#positioning)).

**Prism** carries the craft. One expensive, physically-accurate object that
demonstrates the work was done properly. Exactly one, in exactly one place —
spend the boldness once and keep everything around it quiet.

## Non-negotiables

- 3D never blocks first paint. Content renders, canvas fades in after.
- The full site works with WebGL disabled. Complete, not degraded.
- Canvas is `aria-hidden` — decoration, invisible to screen readers.
- `prefers-reduced-motion` gets tier C, always, with no frame ever animated.
- Both themes get equal design attention. Light mode is not an afterthought.

## Open

- [x] **Focus object — LOCKED 2026-09-06: the zero-gravity liquid.** Set aside
      along the way: the glass prism, five procedural glass candidates
      (`lens` · `slabs` · `shards` · `wedge` · `crystal`), and a downloaded
      Sketchfab model. (If a model is ever revisited, the rules were: CC0 or
      plain CC BY only, credit in the colophon, no ND, one strong silhouette,
      under ~2 MB.)
- [x] **Liquid pointer interaction — settled 2026-09-06** via a design panel; the
      winning approach is implemented in the prototype.
- [ ] Whether the liquid also appears on the contact section, or hero only
- [ ] Whether the Lattice grid should spell something at rest
