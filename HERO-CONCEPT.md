# Hero Concept — Stone Becomes Alive

**The idea:** a classical stone sculpture with a stone smile. As you scroll, it warms into a living, bright smile. Cold to warm. Dull to bright. Stone to alive.

It is the practice's promise as a single gesture, it is unmistakably classical, and no dental practice anywhere is doing it.

Treatment is **restrained** — this object carries the grandeur. Frames, marble panels, and gold rules appear sparingly, two or three times on the whole page.

---

## 1. The technical problem, and the method that solves it

The two states must be **pixel-aligned**. Same pose, same crop, same light. If they aren't, the transition reads as a glitch instead of a transformation.

Text-to-image cannot do this. Two prompts produce two different sculptures.

**The method:**

1. **Generate State A only** — the full stone sculpture. Many variants. Pick one winner on quality alone.
2. **Take that winner and run image-to-image at LOW denoise strength** (0.25–0.35) with a modified prompt to produce State B. Low strength keeps geometry locked and changes only surface and light.
3. You now have two frames that share a silhouette.
4. Verify alignment by flipping between them. Any drift in the jawline or the frame edges means regenerate B, not A.

**This is the single most important instruction in this document.** Everything else is downstream of getting two aligned frames.

If Higgsfield won't do low-strength img2img, alternatives in order of preference: generate State A, then hand-edit State B in Photoshop (brighten and warm the mouth region only); or generate a single State A and do the entire transformation in CSS — warmth, brightness, and a subtle glow on a masked mouth region. The CSS route is the most reliable fallback and costs no extra generation.

## 2. The uncanny risk — read before generating

**A stone face with glowing white teeth looks like a horror film.** This is the real failure mode and it will happen if the brief says "bright white smile."

What we actually want is subtler: the whole sculpture **warms** — cold grey marble to warm cream marble — and the mouth gains **life and light**, not fluorescent whiteness. Think of stone catching morning sun, not teeth switching on.

State B is warm marble with a luminous smile. It is not a photograph of teeth composited into a statue.

Judge every result against this: does it feel like warmth arriving, or does it feel like a jump scare?

## 3. Generation prompts

### State A — the stone sculpture

```
Photorealistic classical marble sculpture of a serene human face, three-quarter
view, lips together in a faint closed smile. Carved white Carrara marble, cool
grey tone, visible chisel texture and fine veining. Single soft studio light
from the upper left, deep shadow falloff to the right. Isolated on a plain flat
black background. Museum photography, shallow depth of field, high detail.
Calm and dignified, not dramatic.
```

Generate 8–12. Judge on: is the face serene rather than severe, is the light single-source with real falloff, is the mouth region clean enough to transform, is there generous quiet space on one side of the frame for text.

### State B — via image-to-image from the winner

Denoise strength 0.25–0.35. Do not exceed 0.4 or geometry drifts.

```
The same marble sculpture, now warmed. Cream and honey marble tones instead of
cool grey. The face catches warm morning light. The closed smile is softly
luminous and alive, lips slightly parted, teeth suggested with warm light rather
than stark white. Skin-like translucency in the marble. Same pose, same framing,
same camera. Warm, gentle, hopeful.
```

### Constraint block — append to both

```
Isolated on plain flat black background. No text, no logos, no watermarks. No
dental equipment. Single light source. Photorealistic sculpture, not
illustration, not 3D render, not painting. Cool grey to warm cream marble range
only.
```

## 4. Post-processing — I do this part

Drop raw output in `_raw-photos/higgsfield/`. I will:

- Remove the black background so the sculpture floats on our own navy, which is how every reference you sent composites its object
- Palette-match both states to the tokens
- Verify the two frames are aligned and fix minor drift
- Export AVIF + WebP under 200KB each
- Add manifest entries to `content/images.ts`

Generating on flat black and cutting out is deliberate: it keeps the ground under our control so contrast is guaranteed rather than hoped for.

## 5. How it gets built

**Scroll-driven crossfade between two stills.** Not video.

- State B sits underneath, State A on top
- `useScroll` drives State A's opacity — or better, a `clip-path` wipe so the stone dissolves and the warm version is revealed
- Completes within the first viewport of scroll so nobody misses it
- **Reduced motion:** State B renders directly, no transition
- **No JS:** State B renders directly
- **LCP:** State B is the priority image; State A layers on top. Two AVIFs under 200KB each is well inside budget — far cheaper than the 1.5MB video we were considering

The `<LineDraw>` primitive is already built and can draw a single gold hairline under the headline as the transformation completes. One mark, not a flourish festival.

## 6. Secondary assets — sparse, per the restrained treatment

Only after the hero lands, and only three:

1. **Marble panel texture** — subtle warm marble, very low contrast, for two or three panel backgrounds
2. **Gold corner frame** — thin bracket rules, vector not generated, drawn from the logo's line weight
3. **Section divider** — a single gold hairline with a small volute terminal, derived from the logo

That is the entire secondary set. Restrained means restrained.

## 7. Judging every generation against `bar.md`

- **M1** — one object, 35–55% of frame, single-source lighting with real falloff
- **M2** — dark ground (we composite this, so it's guaranteed)
- **M3** — gold appears on the CTA and the hairline. Not on the sculpture as decoration.
- **M4** — quiet space on one side for letterspaced display type
- **M5** — at least two hairline elements per viewport
- **M6** — no filled light cards on dark
- **M7** — the hero is a sculpture, not a group snapshot. Passes by construction.

Reject anything that: has visible teeth rendered photographically, glows, looks 3D-rendered rather than carved, is severe or mournful rather than serene, or fills the frame edge to edge with no quiet region.
