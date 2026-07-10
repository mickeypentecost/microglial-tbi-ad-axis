# A shared microglial resolution-failure axis links brain injury to Alzheimer's disease — the causal argument

## Thesis

Traumatic brain injury raises the lifetime risk of Alzheimer's disease, but the mechanism is unresolved. We propose a specific, testable bridge: **TBI installs *environmentally* the same microglial inflammatory program that Alzheimer's risk alleles predispose to *genetically* — a microglial OPN(SPP1)/CD44 "disease-associated microglia" (DAM) program whose pro-resolving TSG-6/hyaluronan brake fails to sustain.** If true, the genes that TBI drives after injury should be the same genes that carry inherited AD regulatory risk, and the causal currency linking them is chromatin state in microglia.

We test this with a three-layer argument on one shared gene spine (the pre-specified accelerator/DAM and resolution modules):

1. **Environmental arm.** Single-nucleus and bulk data — reanalyzed here from public sources — show TBI and AD converge on the microglial OPN/CD44 accelerator program, cross-species and cross-modality, with a resolution deficit that is not sustained over time.
2. **Genetic arm.** Do AD GWAS credible-set variants fall preferentially in **microglial enhancers of the accelerator genes**? And does a **ChromBPNet** chromatin model predict that the risk alleles disrupt those enhancers allele-specifically?
3. **Quantitative synthesis.** By stratified LD-score regression, **what fraction of AD SNP-heritability is captured by the microglial-accelerator-enhancer annotation?**

All three arms are computed during this work from public data; no prior analysis is reused.

**Payoff statement:** *TBI installs environmentally what AD risk alleles predispose to genetically — and both converge on the same microglial resolution-failure axis.*

## Anchor gene set (frozen)

The target set is the pre-specified CSGIA modules, mapped to authoritative GRCh38 coordinates (Ensembl REST, GRCh38) with ±100 kb cis-regulatory windows around each TSS:

- **Accelerator / RISK (21):** SPP1, CD44, ITGAX, TREM2, TYROBP, C3, C1QA, C1QB, C1QC, CST7, GPNMB, LPL, CLEC7A, LGALS3, TLR2, CD68, B2M, APOE, IL1B, TNF, CXCL10
- **Resolution / brake (9):** TNFAIP6, HAS1, HAS2, HAS3, HMMR, ANXA1, TGFB1, SOCS3, IL10
- **DAM-exclusive (8):** CD9, AXL, CTSB, CTSD, CTSL, FTH1, LGALS3BP, CD63 *(CCL6 is mouse-only, no human ortholog — excluded)*

The **accelerator + DAM-exclusive** genes form the primary "accelerator" annotation for the genetic tests; the **resolution** arm is the pre-specified negative/contrast set — under the hypothesis, AD genetic regulatory risk should concentrate in the accelerator arm, **not** the resolution arm. That contrast is the built-in specificity control.

## Data sources (all public; confirmed reachable)

| Layer | Source | Identifier | Status |
|---|---|---|---|
| AD GWAS | EBI GWAS Catalog (Bellenguez 2022) | GCST90027158 (PMID 35379992) | verified |
| Microglial chromatin | Corces lab Resources — brain scATAC + pre-trained ChromBPNet | corceslab.com | reachable |
| Chromatin fallback | ENCODE brain ATAC-seq (37 expts, 14 human) | encodeproject.org | reachable |
| Heritability panels | 1000G / HapMap3 / baseline-LD (S-LDSC) | Broad data portal | pending fetch |
| Coordinates/conservation | UCSC / Ensembl REST | GRCh38 | reachable |

## Files produced by Step 1
- `axis_targets.csv` — 38 genes × (arm, Ensembl ID, GRCh38 coords, strand, TSS, ±100 kb cis-window, biotype)
- `axis_cis_windows.bed` — BED3+name of cis-windows for downstream peak/variant intersects
