# Corces lab brain ChromBPNet models — provenance & cluster map

## Source
- **Repo:** github.com/corceslab/variantapp (the Variant Effect Prediction / VEP platform)
- **Models:** pre-trained ChromBPNet models, one per brain cell-type cluster, trained on **postmortem human brain single-nucleus ATAC-seq** from cognitively healthy donors (Corces et al., *Nat Genet* 2020, "Single-cell epigenomic analyses implicate candidate causal variants at inherited risk loci for Alzheimer's and Parkinson's diseases," **PMID 33106633**; data on GEO). The cluster identities (C1–C24) trace to that study's brain cell-type clustering.
- **Weights in-repo:** `models/C{n}_cbp/model.h5` (~73 MB each) + `models/C{n}_cbp/biasmodel.h5` (ChromBPNet bias model, ~5 MB). Loaded via Keras `load_model` with custom object `multinomial_nll` (see `utils/load_model.py`).

## Cluster → cell-type map (from utils/form.py, authoritative)
| Cluster | Cell type |
|---|---|
| C1  | Isocortical Excitatory neurons |
| C2  | Striatal Inhibitory neurons (major) |
| C5  | Nigral Neurons (unclassified) |
| C8  | OPCs |
| C13 | **Astrocytes** |
| C19 | Oligodendrocytes |
| **C24** | **Microglia**  ← primary model for the accelerator-axis test |

## Pre-computed resources available in-repo (validation anchors)
- `data/output/ADVariants_Ryan.csv` (557 KB) — curated AD-associated variants (rsID, hg38 chrom/pos, effect/noneffect allele, ML_confidence).
- `data/output/scored_ADVariants_Ryan.csv` (3.4 MB) — **3,069 AD variants × 7 cluster models = 21,483 rows**, each with ChromBPNet metrics: `lfc` (log-fold-change ref→alt predicted accessibility), `abs_lfc`, `jsd` (Jensen–Shannon divergence of predicted profiles), `alt_scores`, `ref_scores`, `max_alleles`, `cluster`.

## How we use it (Step 5 plan)
1. **Primary:** run/score AD variants that fall in our axis-gene microglial enhancers through the **C24 (microglia)** model → allele-specific lfc + jsd.
2. **Specificity control:** compare C24 disruption vs the neuronal models (C1/C2/C5) and glial contrasts (C13 astro, C19 oligo, C8 OPC) — under the hypothesis, axis-gene AD variants disrupt microglial (C24) chromatin preferentially.
3. **Validation anchor:** cross-check our scores against the repo's pre-computed `scored_ADVariants_Ryan.csv` for overlapping variants (sanity that our inference reproduces theirs).

## Scoring metric definitions (from scoring/scoringV2.py, utils/utils.py)
- `lfc` = log2( predicted total accessibility[alt] / predicted total accessibility[ref] ) at the variant-centered window.
- `jsd` = Jensen–Shannon divergence between ref and alt predicted base-resolution profiles (captures profile-shape change even when total counts are similar).
- Rank by `jsd` (profile disruption) and `abs_lfc` (magnitude) for top allelic-effect variants.
