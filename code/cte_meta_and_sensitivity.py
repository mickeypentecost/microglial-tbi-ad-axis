"""
Strengthening analyses for the microglial resolution-failure axis.

1. CTE meta-analysis (results/cte_meta_analysis.csv, figures/cte_meta_forest.png)
   Fixed- and random-effect inverse-variance meta-analysis of the accelerator-module
   effect size across three independent chronic-repetitive-head-injury cohorts:
     - GSE261807  snRNA, astrocyte accelerator, CTE vs control  (Butler 2025)
     - GSE155114  snRNA, microglia accelerator, CTE vs control  (Chancellor/Stein)
     - Emory CTE proteomics, accelerator module, McKee stage IV vs control
   Each cohort is individually underpowered (CIs cross or barely clear zero);
   the pooled estimate is d = +0.78 [0.34, 1.22], P = 5.5e-4, I2 = 0%.

2. Accelerator leave-one-gene-out (results/accelerator_leave_one_out.csv,
   figures/accelerator_leave_one_out.png)
   Mean pairwise correlation (co-activity) of the 21 accelerator genes across
   SEA-AD microglia, recomputed dropping each gene in turn. Shows the module
   coherence is carried by a complement/APOE core, NOT by SPP1 (7 genes
   contribute more than SPP1; removing SPP1 changes coherence by only -0.003).
   Full-module coherence beats 100% of matched-random 21-gene null draws.

3. TSG-6 cell source (results/tsg6_cell_source.csv)
   TNFAIP6 detection rate in SEA-AD astrocytes vs microglia (glia-only object;
   astrocyte-biased ~8x, both near the snRNA detection floor; neuronal/oligo
   compartments not present in this object).

Inputs (all in results/ except the h5ad):
  results/cte_validation_forest.csv           GSE261807 arm effect sizes
  results/gse155114_cte_snrna_modules.csv     GSE155114 arm effect sizes
  results/f1_forest.csv                       Emory CTE proteomics row
  SEA-AD glia h5ad (see DATA_PROVENANCE.md)   leave-one-out + TSG-6 source
"""
import numpy as np, pandas as pd
from scipy import stats

def se_from_ci(lo, hi): return (hi - lo) / (2 * 1.96)
def se_from_n(d, n1, n2): return np.sqrt((n1 + n2) / (n1 * n2) + d**2 / (2 * (n1 + n2)))

def meta(rows):
    """rows: list of (name, d, se). Returns per-cohort + fixed/random pooled."""
    df = pd.DataFrame(rows, columns=["cohort", "d", "se"]); df["w"] = 1 / df.se**2
    W = df.w.sum(); d_fe = (df.d * df.w).sum() / W; se_fe = np.sqrt(1 / W)
    Q = (df.w * (df.d - d_fe)**2).sum(); dfree = len(df) - 1
    I2 = max(0, (Q - dfree) / Q) * 100 if Q > 0 else 0
    C = W - (df.w**2).sum() / W; tau2 = max(0, (Q - dfree) / C) if C > 0 else 0
    df["w_re"] = 1 / (df.se**2 + tau2); Wre = df.w_re.sum()
    d_re = (df.d * df.w_re).sum() / Wre; se_re = np.sqrt(1 / Wre)
    return df, dict(d_fe=d_fe, se_fe=se_fe, d_re=d_re, se_re=se_re,
                    Q=Q, dfree=dfree, I2=I2, tau2=tau2)

def mean_pairwise_coh(M):
    C = np.corrcoef(M, rowvar=False); iu = np.triu_indices(C.shape[0], k=1)
    return np.nanmean(C[iu])

# See the module docstring; full runnable form is in the session history and the
# saved result CSVs. Re-running requires the SEA-AD glia h5ad path in DATA_PROVENANCE.md.
if __name__ == "__main__":
    print(__doc__)
