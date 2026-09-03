# Theme spec — "Forge"

**Decided 2026-09-03.** One composite scene combining Aurora, Lattice and Prism,
in both light and dark. This file is the spec; [PLAN.md](PLAN.md) has the phases
that build it.

---

## The core idea

Not three effects on a page. **One scene, three layers, where each layer feeds
the next.**

```
   camera
     │
     ▼
  ┌─────────────────────────────────────────┐
  │  PRISM      one glass object, z ≈ 0     │  ← focus
  │  ─────────────────────────────────────  │
  │  LATTICE    instanced grid, z ≈ -6      │  ← structure
  │  ─────────────────────────────────────  │
  │  AURORA     fBm shader plane, z ≈ -20   │  ← ground / palette
  └─────────────────────────────────────────┘
```

The reason this works rather than costing three times as much: **a
`transmission` material refracts whatever the renderer draws behind it.** Put
Aurora and Lattice in the same scene as Prism and the glass refracts them for
free — three.js already renders the backdrop into a transmission render target,
so we pay for that pass once and get real refraction of a live animated
gradient. Prism stops being a separate effect and becomes a lens onto the other
two.

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
| Prism glass | refraction reads on its own | needs edge definition — see below |

### Per-layer adjustments

**Aurora.** Dark uses additive band accumulation. Light must not — additive on a
pale ground clips to white and loses all hue. Light mode multiplies tints into
the paper instead, and drops band contrast by roughly half.

**Lattice.** Cell colour inverts in luminance but keeps hue. The cursor "heat"
becomes *saturation* rather than *brightness*, since there is no headroom to
brighten toward on a light ground.

**Prism.** The hard one. Glass on a pale backdrop nearly disappears, because
refraction of light-on-light produces almost no contrast. Light mode needs:
- higher `iridescence` so the edges catch colour
- a slight `attenuationColor` tint so the body reads as a volume
- a subtle contact shadow to anchor it

Without those it looks like a smudge on the screen.

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

- [ ] Prism geometry — torus knot is the placeholder. A form derived from
      something of yours (a widget package, an MPK, a lattice cell grown large)
      would beat a generic knot
- [ ] Whether Prism also appears on contact, or hero only
- [ ] Whether the Lattice grid should spell something at rest
