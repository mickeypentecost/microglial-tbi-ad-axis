# Reproducibility

Every figure in the submission regenerates from tracked code and result tables.
This document maps each figure to its build script and inputs, and describes the
path from primary data to result.

## Quick start

```bash
# 1. environments (see requirements.txt for the three envs)
#    ENV 1 "analysis"  — figures + enrichment + GWAS munging (python 3.11)
#    ENV 2 "tf_infer"  — ChromBPNet allelic scoring (tensorflow 2.19)
#    ENV 3 "ldsc"      — S-LDSC partitioned heritability (python-3 port of bulik/ldsc)

# 2. rebuild every figure from the tracked result tables (ENV 1)
for f in figures/build_figure1.py figures/build_figure2.py figures/build_figure3.py \
         figures/build_figure4.py figures/build_figure5.py \
         figures/build_supplementary_figure1.py \
         figures/build_supplementary_figure2.py \
         figures/build_supplementary_figure3.py ; do
    python "$f"
done
```

The build scripts read only from `results/*.csv` (+ `figures/design_tokens.py`)
and write the PNGs in `figures/`. They require no raw data and no network.

## Figure → script → inputs

| Figure | Build script | Result inputs |
|---|---|---|
| Fig 1 — convergence | `figures/build_figure1.py` | `crossarm_convergence.csv`, `f1_sldsc.csv`, `f1_forest.csv`, `f1_coherence.json` |
| Fig 2 — space & time | `figures/build_figure2.py` | `ad_tissue_spots.csv`, `f4_tbi_tissue.csv`, `f4_ad_grad.csv`, `f4_tbi_grad.csv` |
| Fig 3 — genetics | `figures/build_figure3.py` | `full_circuit.csv`, `coloc_positive_control.csv`, `f1_sldsc.csv`, `f1_forest.csv`, `f1_coherence.json` |
| Fig 4 — regulatory switch | `figures/build_figure4.py` | `f2_cebpb.csv`, `f2_stats.json`, `trajectory_drivers.csv` |
| Fig 5 — CD44 hub | `figures/build_figure5.py` | `f5_hub.csv`, `f5_astro.csv` |
| Supp 1 — genetic anchor | `figures/build_supplementary_figure1.py` | `enrichment_results.csv`, `chrombpnet_allelic_scores.csv`, `sldsc_results.csv`, `coloc_mr_results.csv`, `caqtl_formal_coloc.csv`, `moloc_threeway.csv` |
| Supp 2 — resolution brake | `figures/build_supplementary_figure2.py` | `ha_machinery_cerebri.csv`, `resolution_bulk_astrocyte_tbi.csv`, `ha_degraders_cerebri.csv`, `imbalance_ratio_cerebri.csv`, `brake_forest.csv` |
| Supp 3 — regulatory + validation | `figures/build_supplementary_figure3.py` | `insilico_perturbation.csv`, `cebpb_perturbation.csv`, `pseudotime_drivers.csv`, `cte_validation.csv` |

The spatial-tissue panels of Fig 2 are rendered from per-spot coordinate tables
(`ad_tissue_spots.csv`, `f4_tbi_tissue.csv`) produced by the spatial pipeline;
regenerating those tables from the raw Stereo-seq / Visium matrices requires the
large primary files (see below), but the figure itself rebuilds from the tables.

## Data → result: how the tables were produced

Raw data is not committed (size / third-party licensing); it is fetched from the
canonical archives. See `DATA_PROVENANCE.md` for every accession + URL and
`code/fetch_data.py` to pull the open sets.

| Stage | Code | Primary data |
|---|---|---|
| AD GWAS → LDSC sumstats | `code/_munge_stream.py` | Bellenguez GCST90027158 (streamed from EBI) |
| Module scores (accelerator/brake) → per-cell/per-sample tables | `code/score_modules.py` | CEREBRI (GSE269748) + SEA-AD snRNA h5ads |
| ChromBPNet allelic scoring | `code/chrombpnet_scoring.py` | Corces microglial model (`corceslab/variantapp`) |
| S-LDSC partitioned heritability | `code/run_arm_ldscores.sh` | 1000G + baseline-LD (Zenodo 10515792) |
| In-silico motif ablation | `code/insilico_perturbation.py`, `code/cebpb_perturbation.py` | Corces model + accelerator/brake enhancers |

### The two least-portable inputs

The primary single-nucleus objects are large author-processed files obtained
outside the fetch script:

* **CEREBRI mouse TBI snRNA** — GEO **GSE269748** (processed object).
* **SEA-AD human MTG snRNA** — Allen Institute SEA-AD portal (sea-ad.org /
  CELLxGENE "SEA-AD"), MTG glia subset.

Place both under `../csgia_h5ad/` (paths documented in `DATA_PROVENANCE.md`), then
run `code/score_modules.py` to regenerate the module-score tables that feed the
brake and imbalance analyses.

## Notes on values carried as literals

The build scripts read all plotted statistics from `results/*.csv` with one
deliberate exception: the ChromBPNet Mann–Whitney p-value annotated in
Supp 1b (`P = 0.005`). This is the validated summary statistic (Methods); the
scatter geometry is read from `chrombpnet_allelic_scores.csv`, and the test is
sensitive to the AD-association threshold (p < 10⁻³, n ≈ 91), so it is reported
as a validated value rather than recomputed inside the figure script.
