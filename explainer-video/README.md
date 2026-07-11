# Injury Meets Inheritance — explainer video

A ~2:50 motion-graphics explainer of this study, built as code with
[Remotion](https://remotion.dev) (React → video). 1920×1080, 30 fps, one
`Explainer` composition of 8 scenes. Every data figure is redrawn in the film's
own visual grammar from the real values in the analysis (`../results`), so the
numbers on screen match the paper.

## Watch / render

```bash
npm install
npm run dev      # Remotion Studio — live preview + timeline
npm run render   # → out/explainer.mp4 (h264)
```

Render a single scene by frame range, e.g. the genetics scene:
```bash
npx remotion render Explainer out/genetics.mp4 --frames=2723-3801
```

## Scenes

| # | Scene | Real data shown |
|---|-------|-----------------|
| 1 | Hook — injury meets inheritance | — |
| 2 | The cell + accelerator/brake programs | a priori gene lists |
| 3 | The data — 4 modalities, human + mouse | 9 analyses |
| 4 | Convergence | forest (Cohen's d), "up in both" scatter, plaque + lesion localization gradients (Fig 2c/2f) |
| 5 | The genetics | S-LDSC 31% / 1.5% / 21× (P=1.1×10⁻⁵); accelerator-enhancer enrichment 1.56× (P=0.0022); colocalization APOE −log₁₀P=320 vs SPP1 PP4=0.009 |
| 6 | The CD44 hub | Fig 5C four-modality log₂FC + TSG-6 |
| 7 | Why it matters | three ranked interventions |
| 8 | Close — "Built with Claude" | — |

Scene ranges live in [`src/theme.ts`](src/theme.ts); each scene is wrapped in
`SceneFrame` for a crossfade through the shared background. Reusable chart and
motif components are in `src/components/` and `src/charts/`.

## Narration

The film renders **silent** by default. The narration draft is in
[`VIDEO_SCRIPT.md`](VIDEO_SCRIPT.md), and scene durations are already fit to a
~145 wpm read of it. To add a voice-over: drop per-scene audio in `public/vo/`
as `s1.wav … s8.wav`, then pass the filename in [`src/Root.tsx`](src/Root.tsx)
(e.g. `<Scene range={scenes.hook} vo="s1.wav">`).

## Data provenance

Chart values are pulled verbatim from the analysis repo's `results/` CSVs and the
manuscript figures — see [`src/charts/chartData.ts`](src/charts/chartData.ts) for
per-series sources. Do not edit the numbers.

*Built with Claude for the Built with Claude: Life Sciences hackathon.*
