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

## Figure 2 — Where the accelerator turns on, and when

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
microglial accelerator peaks around 7 days after injury (score ~1.24, up from
~0.77 at 24 h, settling to ~0.70 by 6 months), while the brake stays essentially
flat near zero at every time point — the brake is a phase that never fully engages.*

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

## Figure 4 — The master-control proteins that switch the accelerator on and off

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

## Figure 5 — CD44: the receptor where the accelerator and the brake meet

The shared hub. Microglia and astrocytes both signal through one receptor, CD44,
and under injury the brake fails.

- **A — Who expresses what.** Detection of hub genes in microglia vs astrocytes
  (dot size = fraction of cells expressing; color = average level).
- **B — The astrocyte brake fails under injury.** In sorted astrocytes after
  injury, almost everything rises — SPP1, CD44 (+1.04), HAS2 (+0.76), HMMR — while
  the one pro-resolving brake gene, TSG-6/*Tnfaip6*, is the lone gene that falls
  (−0.34, p = 0.03).
- **C — CD44 rises across four modalities and both species.** The receptor itself
  goes up in sorted-astrocyte bulk RNA under injury (+1.0 log₂), human AD brain
  protein (+0.26 log₂), the mouse plaque-microenvironment proteome (+0.72 log₂),
  and single-nucleus microglia under injury (+0.13) — the most consistent single
  observation in the study (** p < 0.01, * p < 0.05, † p < 0.1).
- **D — The conclusion.** Every accelerator input to CD44 goes up while the brake
  input goes down: the receptor is pushed and never released. CD44 is a concrete,
  lab-testable therapeutic node.

---

# Supplementary Figures

Three consolidated supplementary figures. All numbers are computed here from public
data during this work.

## Supplementary Figure 1 — The genetic anchor: how inherited risk enters the circuit

![Supplementary Figure 1](figures/supplementary_figure1_genetics.png)

- **A — Variant enrichment.** AD-associated common variants are enriched in
  microglial enhancers of the accelerator genes (OR 1.56; MAF-matched permutation
  P = 0.0022), surviving *APOE* removal. The DAM-only contrast is not significant
  and the resolution arm shows no enrichment — the signal is accelerator-specific.
- **B — Allele-level mechanism.** A ChromBPNet model predicts each variant's
  allele-specific effect on microglial chromatin accessibility; AD-associated
  accelerator variants disrupt accessibility more than non-associated variants in
  the same enhancers (MWU P = 0.005), the strongest being rs3800342 at *TREM2*
  (P = 9.3×10⁻¹²).
- **C — Heritability.** Stratified LD-score regression: microglial regulatory DNA
  (~1.5% of the genome) carries 31% of AD SNP-heritability (21×, P = 1.1×10⁻⁵,
  coefficient z = 3.62). Arm annotations are individually underpowered (CIs cross
  zero) but accelerator is positive and brake negative — direction, not
  significance.
- **D — Causal direction.** Colocalization across myeloid eQTL, microglia caQTL,
  and a joint three-way test never approaches the PP4 = 0.8 threshold. Effectors
  are regulated but AD-independent; risk enters only at *APOE*/*TREM2*
  (trigger ≠ threshold).

## Supplementary Figure 2 — The resolution brake: mechanism and measurement limits

![Supplementary Figure 2](figures/supplementary_figure2_brake.png)

- **A — Microglial HA machinery.** In injured microglia (CEREBRI, per-sample), the
  LMW-hyaluronan sensor *Tlr2* and receptor *Cd44* rise while the brake ligand
  *Tgfb1* falls (−0.32, P = 0.003). Asterisks: P < 0.05.
- **B — Astrocyte bulk.** In sorted-astrocyte bulk RNA-seq, *HAS2* rises but the
  brake ligand TSG-6 (*TNFAIP6*) falls (−0.34, P = 0.03) — synthesis without
  stabilization.
- **C — Four fragmentation routes.** Three enzymatic degraders (*Hyal1/2*,
  *Cemip*, *Tmem2*) sit at the single-nucleus detection floor; only the NADPH-
  oxidase route (*Cybb*, *Rac2*) is detectable and induced.
- **D — Imbalance.** The accelerator-minus-brake imbalance shifts toward the
  accelerator under injury (MWU P = 1×10⁻⁴).
- **E — Reproducibility.** The brake module does not clear the ≥3-dataset bar:
  positive in chronic human AD (d = +0.40), negative in acute mouse injury
  (d = −0.89) — reported rather than averaged away.

## Supplementary Figure 3 — Regulatory grammar and cross-condition validation

![Supplementary Figure 3](figures/supplementary_figure3_regulatory.png)

- **A — Arm-specific switch.** *In silico* motif ablation: deleting NF-κB closes
  accelerator enhancers specifically (P = 1.9×10⁻⁵); deleting MEF2 does not close
  brake enhancers — NF-κB activates, MEF2C represses.
- **B — Identity factor.** Ablating SPI1/PU.1 closes enhancers in proportion to
  motif strength (ρ = −0.28, P = 9×10⁻¹⁵) across both arms — a lineage-identity
  factor, not an arm-specific switch.
- **C — Trajectory.** Along the resting-to-inflamed microglial pseudotime,
  accelerator genes rise and homeostatic/brake genes fall (overall ρ = −0.49).
- **D — Chronic human injury.** Repetitive-head-impact and CTE cortex (GSE261807;
  Cohen's d, 95% CI vs control): astrocyte arms clear zero (accelerator d = 0.81,
  brake d = 0.77) whereas microglial arms do not — directional and underpowered
  (n = 8/9/11), supporting not confirmatory.
