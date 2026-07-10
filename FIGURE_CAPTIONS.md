# Figure captions

All five figures share one visual grammar: the **first panel orients** you to the
kind of data or the pipeline, the **middle panels are the data**, and the **last
panel summarizes the interpretation**. Colors are consistent throughout —
**red = the inflammatory "accelerator" program**, **blue = the "brake"
(resolution) program**, **purple = astrocytes**, **slate = human genetics**,
**amber = the shared conclusion**. Every number in these captions is computed
from public data during the event; nothing is carried over from prior analyses.

---

## Figure 1 — One shared accelerator axis, seen three independent ways

The hook. A single microglial inflammation program ("the accelerator") shows up
in Alzheimer's disease and in brain injury, reproduces across species and
methods, and sits on DNA that carries a large share of inherited Alzheimer's risk.

- **A — The pipeline.** How the analysis runs: score the accelerator program in
  single-cell and bulk RNA, test it across independent datasets, then map it onto
  Alzheimer's genetics.
- **B — The accelerator is a real module.** Its genes switch on and off together
  far more than expected by chance (gene–gene co-activity 0.074 vs a random-gene
  null of 0.013; p < 0.01). The brake program does not cohere in single-nucleus
  data — an honest limitation addressed in the text.
- **C — The same genes go up in both diseases.** Each dot is one accelerator
  gene; red dots (e.g. *SPP1/OPN, APOE, TLR2, TNF, LPL*) rise in both Alzheimer's
  (x-axis) and brain injury (y-axis).
- **D — It reproduces.** Accelerator effect size (Cohen's d ± 95% CI) is positive
  in human single-nucleus (SEA-AD), mouse single-nucleus (CEREBRI), independent of
  the underpowered human bulk set (Marinaro) — two species, three methods.
- **E — The DNA carries the risk.** Microglial regulatory DNA is ~1.5% of the
  genome yet accounts for 31.4% of inherited Alzheimer's risk (p = 1×10⁻⁵).
- **F — The conclusion.** The accelerator program (SPP1, APOE, TREM2, TYROBP, C1q,
  C3, ITGAX, GPNMB, CST7, LPL, TLR2, CD68, B2M, IL1B, TNF), supported by three
  independent lines of evidence: recovered blindly, up in both diseases, and
  enriched for inherited risk.

---

## Figure 2 — The master-control proteins that switch the accelerator on and off

Which regulatory proteins turn the accelerator program up or down, read directly
off the DNA by an AI model that predicts how open each stretch of microglial DNA is.

- **A — What the model reads.** A microglial enhancer (a stretch of open DNA that
  controls nearby genes) carries binding sites for several master-control proteins
  (SPI1, NFκB, MEF2C, CEBPB). We delete one site at a time and watch the DNA close.
- **B — Who does what.** Removing **NFκB** specifically closes the accelerator DNA
  (p = 1.9×10⁻⁵) — it is the activator. Removing **SPI1** or **CEBPB** closes
  *both* programs equally — they are identity proteins the cell needs to be a
  microglia at all, not accelerator-specific switches.
- **C — SPI1 dose-response.** The stronger a DNA site's SPI1 signal, the more
  accessibility is lost when SPI1 is removed (ρ = −0.28, p = 9×10⁻¹⁵). The y-axis
  is a signed change that crosses zero, so it is shown on a linear scale.
- **D — Along the path from resting to inflamed.** Accelerator genes (*GPNMB,
  SPP1*) rise and resting/brake genes (*P2RY12, MEF2C, TMEM119*) fall as microglia
  progress toward the disease state.
- **E — The wiring.** NFκB (activator) switches the accelerator ON; MEF2C
  (repressor) holds it OFF; SPI1/CEBPB are required identity proteins upstream of
  both.

---

## Figure 3 — Inherited risk sets the threshold; injury pulls the trigger

The genetics. Inherited Alzheimer's risk and the environmentally-installed
accelerator effectors are largely *different* genes.

- **A — How a risk variant reaches a gene.** An inherited variant sits in a DNA
  switch; if that switch is more open, a loop connects it to a gene, changing the
  gene's expression. Each accelerator gene is scored on all four layers.
- **B — The four-layer map.** For every accelerator gene, its inherited-risk
  signal, how open its switch is, its enhancer→gene loop, and its expression.
- **C — The positive-control test.** Only *APOE* and *TREM2* clear genome-wide
  significance for inherited risk (dashed line). The accelerator *effectors*
  (*SPP1, CD68, TLR2* …) do not — even where their DNA switches are strong (e.g.
  *SPP1*). The control works, and it shows the effectors are not themselves
  inherited-risk genes.
- **D — The asymmetry.** Accelerator genes carry more inherited AD-risk signal
  (1.48×) than the brake genes (1.09×).
- **E — The conclusion.** Inherited risk sets the *threshold* (APOE, TREM2);
  injury and environment pull the *trigger* (SPP1 and the effectors, which carry
  no common risk variants). Trigger ≠ threshold.

---

## Figure 4 — Where the accelerator turns on, and when

The accelerator concentrates exactly where the tissue is damaged, in both
diseases, shown here on real tissue.

- **A — Alzheimer's tissue (Stereo-seq).** A mouse Alzheimer's brain section; each
  spot is colored by its accelerator score, with amyloid plaques overlaid in gray.
  The program is brightest on and around plaques.
- **B — Quantified for Alzheimer's.** Accelerator score by distance from the
  nearest plaque: highest on-plaque (0.428), falling with distance (0.247 beyond
  400 µm).
- **C — Injured tissue (Visium).** A mouse brain-injury section; spots colored by
  accelerator score. The program lights up at the injury lesion (the lesion tracks
  a tissue-damage signature, ρ = 0.65).
- **D — Quantified for injury.** Accelerator score by distance from the lesion:
  highest at the lesion (+0.102), falling to background farther away (−0.061).
  Plaque (B) and lesion (D) are plotted near-injury-first so the two diseases line
  up.
- **E — How we measured it.** Spots are binned into rings by distance from the
  plaque or lesion, and the score is averaged per ring (panels B and D).

*Timing (from the CEREBRI injury time-course, described in the text): the
microglial accelerator peaks around 7 days after injury (score 1.24, up from 0.77
at 24 h, settling to 0.70 by 6 months), while the brake stays essentially flat
near zero (0.059 → −0.023 → 0.008) — the brake is a phase that never fully engages.*

---

## Figure 5 — CD44: the receptor where the accelerator and the brake meet

The shared hub. Microglia and astrocytes both signal through one receptor, CD44,
and under injury the brake fails.

- **A — The wiring.** Microglia make the accelerator ligand SPP1/OPN; astrocytes
  make the brake ligand TSG-6 and the sugar hyaluronan. Both act on **CD44**, a
  receptor on both cell types. SPP1 activates; TSG-6 inhibits.
- **B — Who expresses what.** Detection of hub genes in microglia vs astrocytes
  (dot size = fraction of cells expressing; color = average level).
- **C — The astrocyte brake fails under injury.** In sorted astrocytes after
  injury, almost everything rises — SPP1 (+4.63), HMMR (+1.58), SOCS3 (+1.53), CD44
  (+1.04), HAS2 (+0.76) — while the one pro-resolving brake gene, TSG-6/*Tnfaip6*,
  is the lone gene that falls (−0.34, p = 0.03).
- **D — The conclusion.** Every accelerator input to CD44 goes up while the brake
  input goes down: the receptor is pushed and never released. CD44 is a concrete,
  lab-testable therapeutic node.
