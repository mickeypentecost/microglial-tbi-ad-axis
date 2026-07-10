# Design system & plain-language style spec

This is the contract every figure panel and every line of narrative in this project follows, so
that five figures read as **one paper** and an undergraduate can follow every claim. Two parts:
(1) the visual grammar, (2) the plain-language rules + glossary.

---

## PART 1 — VISUAL GRAMMAR

### 1.1 The threaded palette (meaning is fixed to color, everywhere)
Color always means the same biological thing. A reader who learns it in Figure 1 reads Figure 5
without a legend.

| Role | Hex | Used for |
|---|---|---|
| **Accelerator** (drives damaging inflammation) | `#c0392b` (deep red) | accelerator module, SPP1, NFκB "gas pedal", DAM genes, injury-up bars |
| **Brake / resolution** (calms, repairs) | `#2980b9` (blue) | resolution module, TSG-6, MEF2C "brake pedal", protective arm |
| **Astrocyte** (the second cell) | `#8e44ad` (purple) | astrocyte tracks, TSG-6 source, HAS2/HMW-HA |
| **Genetics / inherited risk** | `#34495e` (slate) | GWAS, S-LDSC, caQTL/eQTL, APOE/TREM2 positive controls |
| **Neutral / control / null** | `#7f8c8d` grey (`#bdc3c7` light) | control groups, matched-random nulls, non-significant |
| **Highlight / "here's the point"** | `#e67e22` (amber) | one call-out per panel maximum |

Sequential gradients (spatial distance, pseudotime): single-hue ramps of the role color
(reds `Reds` for accelerator, blues `Blues` for brake). Never rainbow/jet.

### 1.2 Type ladder (via `apply_figure_style()` from the figure-style skill)
- Figure super-title (the paper-level claim): 13–14 pt bold
- Panel claim-title: 10.5–11 pt (a full sentence — see 1.4)
- Axis labels: 9–10 pt · tick labels: 8–9 pt · annotations: 7.5–8 pt · micro-caption: 7 pt
- One font throughout (DejaVu Sans / Helvetica-class). Gene symbols in italic.

### 1.3 Layout
- 300 dpi PNG, `bbox_inches="tight"`. 12-column mental grid per figure.
- Outward ticks, spines only left+bottom (`set_frame`), frameless legends.
- Generous whitespace; no panel touches another. Panel letters (A/B/C…) top-left, 12 pt bold.
- Every multi-panel figure carries a one-line **super-title = the figure's single claim**.

### 1.4 CLEAN PANELS — no in-figure titles or narration (Nature convention)
Figures carry **data only**. Each panel contains exactly: the plotted data, axes with axis labels
and tick labels, a legend where color/marker encodes a category, and a **bold panel letter**
(A/B/C…) in the top-left corner. Nothing else.

**Never place inside a figure:** a figure super-title, a panel title/claim sentence, floating
annotation text, callout arrows-with-text, statistic call-outs (put the ρ/p in the caption, or as
a bare legend entry only if essential), triangulation badges, or the "how it works / what it shows"
micro-caption. **All of that moves to the caption** (see 1.5).

Permitted in-panel text: axis labels, tick labels, legend entries, numeric data labels directly on
a bar/point (e.g. "31.4%") when they ARE the datum, a bare p-value / ρ next to the relevant data,
and data-point identifiers (a gene symbol next to its point). If a color encodes meaning, express it
as a **legend**, never as free-floating text.

**Legends must never overlap data.** After rendering, convert the legend's bbox to data
coordinates and count actual points/bars underneath (a matplotlib collection/BarContainer reports
one panel-spanning bbox, so `Artist.get_window_extent` overlap gives false positives — test the real
data extents instead). If any datum sits under the legend, relocate to an empty corner or outside the
axes (`bbox_to_anchor`). Bar panels can be **narrower** than scatter/schematic panels — use
`width_ratios` (e.g. 1.0 : 1.5) since bars need less horizontal room once labels are gone.

**Directional glyphs in schematics carry sign:** activation = pointed arrowhead (`-|>`); repression =
blunt T-bar (`|-|,widthA=0,widthB=6`). Never draw a repressor with a pointed arrow.

Schematic/diagram panels are the one exception: their node labels (cell names, molecule names,
arrows) are the content, not decoration — keep those minimal and move all explanatory sentences to
the caption. Use at most one schematic panel per figure.

### 1.5 The caption carries everything (FIGURE_CAPTIONS.md)
Every figure has a full caption in `FIGURE_CAPTIONS.md`, structured so the reader gets the whole
paper from the captions alone. Each caption has:
1. A **bold one-sentence figure claim** (what was the super-title).
2. Per panel (**A**, **B**, …): the panel-claim sentence, then a plain-language **"How it works /
   What it shows"** — the method in one plain sentence, the result in one plain sentence, with the
   statistic (ρ, p, effect size, n).
3. A closing **"Why it matters / how it integrates"** line naming whether the panel corroborates a
   prior finding by another route, is novel, or is where two data layers meet (the triangulation,
   now stated in words: e.g. "two independent methods — our DNA model and Kosoy's TF network — both
   rank SPI1 first").
This is where the undergrad-readable method explanations live.

---

## PART 2 — PLAIN-LANGUAGE RULES

### 2.1 The core rule
If a first-year biology student would not understand a word, either (a) replace it with a plain
word, or (b) define it literally the first time in parentheses. No exceptions in titles, captions,
or the narrative body. Technical terms may appear *after* the plain version, for the specialist.

### 2.2 The car metaphor (fixes the whole regulatory story)
The microglial cell is treated like a car. This single frame replaces all the jargon:

| Jargon we were using | Plain-language replacement | What it literally means |
|---|---|---|
| "accelerator module" | **the accelerator** (gas pedal genes) | the set of genes that push microglia into the damaging, inflammatory state |
| "resolution / brake module" | **the brake** (brake pedal genes) | the set of genes that calm microglia down and clean up after injury |
| "NFκB switch" | **the gas pedal** | the control that decides whether the accelerator turns ON |
| "MEF2C" | **the brake pedal** | the control that holds the accelerator OFF; when it lifts, the car speeds up |
| "SPI1/CEBPB permissive backbone" | **the engine / ignition** | without these the car does not run at all — but they don't steer; they permit, they don't decide |
| "CD44 hub" | **the shared receiver / docking point** | one receptor on both cell types that reads the "speed up" vs "slow down" signals |
| "resolution failure" | **the brake fails** (or "the brake is a lost window") | the calming system disengages under injury and doesn't come back |

**Rule:** never write "permissive backbone." Write "the engine — the genes a microglial cell needs
to run its inflammatory program at all, which permit the response without choosing its direction."

### 2.3 Method-in-plain-words (use these once, at first mention)
- **single-nucleus RNA sequencing (snRNA-seq):** we read which genes are switched on in each
  individual cell, one cell at a time, so we can look at microglia specifically instead of a blurred
  average of the whole tissue.
- **bulk RNA-seq:** we read the average gene activity of a whole tissue chunk — cheaper, but the
  rare cells (like microglia, ~1 in 20) get diluted into the average.
- **spatial transcriptomics (Stereo-seq / Visium):** we read gene activity *without grinding the
  tissue up*, keeping each measurement's location — so we can ask "what is happening right next to a
  plaque / right at the injury?"
- **ATAC-seq / chromatin accessibility:** we measure which stretches of DNA are "open" (usable) in a
  cell — open DNA marks the switches (enhancers) a cell is actually using.
- **eQTL:** a spelling difference in the DNA that changes how much a nearby gene is made — a natural
  genetic "dial" on a gene.
- **caQTL:** the same idea, but the dial is on whether a DNA switch is open, measured directly in the
  switch.
- **colocalization:** testing whether the *same* DNA spelling-change both dials a gene AND raises
  disease risk — if yes, that gene is likely a genetic *cause*; if no, it's a bystander that changes
  for other reasons.
- **S-LDSC (partitioned heritability):** we add up all the tiny inherited risk spread across the
  genome and ask what fraction lands in DNA that microglia use — measuring how "microglial" the
  inherited risk of AD is.
- **pseudotime / trajectory:** we order cells along the path from healthy → activated to reconstruct
  the *sequence* of changes, as if watching a time-lapse assembled from a single snapshot.
- **ChromBPNet (a DNA sequence model):** an AI trained to predict, from DNA letters alone, whether a
  stretch is open in microglia — we then "mutate" a switch in the computer to ask which control
  proteins (transcription factors) hold it open.
- **module score (AUCell / AddModuleScore):** a single number per cell summarizing how strongly a
  whole set of genes (e.g. the accelerator) is switched on — like a combined score instead of
  reading 21 genes one by one.
- **Cohen's d / effect size:** how big a difference is, measured in standard-deviation units, so
  results from different datasets can be compared on one ruler. 0 = no difference; ~0.8 = large.

### 2.4 Sentence rules
- Lead with the finding, then the evidence. ("Injury switches on the accelerator — up in 2 of 2
  single-cell datasets, both species.")
- One idea per sentence. Prefer verbs to nominalizations ("genetics sets the threshold," not
  "genetic threshold-setting").
- Numbers get a plain anchor: "21× enrichment (21 times more than you'd expect by chance)."
- Never imply a validated drug; say "a lab-testable hypothesis" / "rationale."

### 2.4b Figure grammar: orient → data → interpret
Every multi-panel figure reads left-to-right / top-to-bottom as a three-act story:
1. **Orient (first panel):** a diagram or data-type panel that tells the reader *what kind of
   evidence they are about to see* — a pipeline schematic, a UMAP/tSNE for single-cell, a
   spatial-binning diagram for spatial, an enhancer/motif track for TF work, a locus/circuit
   diagram for genetics. No quantitative burden; pure orientation.
2. **Data (middle panels):** the quantitative results themselves (clean-panel rule 1.4).
3. **Interpret (last panel):** a schematic that states the figure's conclusion — the wiring
   diagram, the trigger-vs-threshold logic, the "what it means" box. Arrows are allowed here
   (schematic carve-out, §1.4b): pointed = activation, blunt T-bar = repression.
This is mandatory for all five figures.

### 2.5 The three framings we thread everywhere
Every result is explicitly one of:
1. **Corroboration by a different route** — "we saw the same thing a second way / in a second
   dataset," (robustness), or
2. **A novel step** — "no one had shown this before: …" (advance), or
3. **Integration** — "layer X and layer Y agree, which neither could show alone" (systems biology).
Label results this way in the narrative so the reader sees the logic, not just the data.
