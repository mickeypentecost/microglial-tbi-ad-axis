"""
Strengthening analyses for the microglial resolution-failure axis.

RUNNABLE FROM THE REPO:
  python code/cte_meta_and_sensitivity.py
This reproduces the CTE meta-analysis (Supplementary Fig. 4a) directly from the committed
cohort effect-size CSVs in results/, printing the per-cohort and pooled estimates and
rewriting results/cte_meta_analysis.csv. The accelerator leave-one-gene-out (Supplementary
Fig. 4b) additionally requires the SEA-AD glia h5ad (path in DATA_PROVENANCE.md); pass it
with --h5ad to recompute results/accelerator_leave_one_out.csv, otherwise that step is
skipped and the committed CSV stands.

Inputs (in results/, committed):
  cte_validation_forest.csv          GSE261807 arm effect sizes (astrocyte accel, CTE)
  gse155114_cte_snrna_modules.csv    GSE155114 arm effect sizes (microglia accel)
  f1_forest.csv                      Emory CTE proteomics row (CTE-IV vs control)
Optional:
  --h5ad <SEA-AD glia h5ad>          enables the leave-one-out recompute
"""
import argparse, os
import numpy as np, pandas as pd
from scipy import stats

ACCEL = ["SPP1","CD44","ITGAX","TREM2","TYROBP","C3","C1QA","C1QB","C1QC","CST7","GPNMB",
         "LPL","CLEC7A","LGALS3","TLR2","CD68","B2M","APOE","IL1B","TNF","CXCL10"]
# DAM (Keren-Shaul 2017) membership among the 21 accelerator genes; the 9 non-DAM genes:
NON_DAM = {"C1QA","C1QB","C1QC","C3","CD44","CXCL10","IL1B","TLR2","TNF"}

def se_from_ci(lo, hi): return (hi - lo) / (2 * 1.96)
def se_from_n(d, n1, n2): return np.sqrt((n1 + n2) / (n1 * n2) + d**2 / (2 * (n1 + n2)))

def meta(rows):
    """rows: list of (name, d, se). Fixed- and random-effect inverse-variance meta-analysis."""
    df = pd.DataFrame(rows, columns=["cohort", "d", "se"]); df["w"] = 1 / df.se**2
    W = df.w.sum(); d_fe = (df.d * df.w).sum() / W; se_fe = np.sqrt(1 / W)
    Q = (df.w * (df.d - d_fe)**2).sum(); dfree = len(df) - 1
    I2 = max(0, (Q - dfree) / Q) * 100 if Q > 0 else 0
    C = W - (df.w**2).sum() / W; tau2 = max(0, (Q - dfree) / C) if C > 0 else 0
    df["w_re"] = 1 / (df.se**2 + tau2); Wre = df.w_re.sum()
    d_re = (df.d * df.w_re).sum() / Wre; se_re = np.sqrt(1 / Wre)
    return df, dict(d_fe=d_fe, se_fe=se_fe, d_re=d_re, se_re=se_re,
                    Q=Q, dfree=dfree, I2=I2, tau2=tau2)

def run_meta(R):
    gse261 = pd.read_csv(f"{R}/cte_validation_forest.csv")
    g155 = pd.read_csv(f"{R}/gse155114_cte_snrna_modules.csv")
    forest = pd.read_csv(f"{R}/f1_forest.csv")
    # GSE261807: astrocyte accelerator, CTE (the concordant arm; microglia washed out)
    r1 = gse261[(gse261.cell_type == "Astrocyte") & (gse261.module == "accel") &
                gse261.label.str.contains("CTE")].iloc[0]
    d1, se1 = r1["d"], se_from_ci(r1["lo"], r1["hi"])
    # GSE155114: microglia accelerator, d with n=8/8 -> SE from n
    r2 = g155[(g155.celltype == "micro") & (g155.arm == "accel")].iloc[0]
    d2, se2 = r2["d"], se_from_n(r2["d"], 8, 8)
    # Emory proteomics: CTE-IV row in the reproducibility forest
    r3 = forest[forest.dataset.str.contains("Emory CTE")].iloc[0]
    d3, se3 = r3["d"], se_from_ci(r3["lo"], r3["hi"])
    rows = [("GSE261807 (snRNA, astrocyte)", d1, se1),
            ("GSE155114 (snRNA, microglia)", d2, se2),
            ("Emory proteomics (CTE-IV)", d3, se3)]
    df, s = meta(rows)
    out = df[["cohort", "d", "se"]].copy()
    out["lo"] = out.d - 1.96 * out.se; out["hi"] = out.d + 1.96 * out.se
    pool = pd.DataFrame([
        dict(cohort="Pooled (fixed-effect)", d=s["d_fe"], se=s["se_fe"],
             lo=s["d_fe"] - 1.96 * s["se_fe"], hi=s["d_fe"] + 1.96 * s["se_fe"]),
        dict(cohort="Pooled (random-effect)", d=s["d_re"], se=s["se_re"],
             lo=s["d_re"] - 1.96 * s["se_re"], hi=s["d_re"] + 1.96 * s["se_re"]),
    ])
    out = pd.concat([out, pool], ignore_index=True)
    out["z"] = out.d / out.se; out["P"] = 2 * stats.norm.sf(out.z.abs())
    out["I2_pct"] = [np.nan]*3 + [round(s["I2"], 0)]*2
    out["Q_P"] = [np.nan]*3 + [round(stats.chi2.sf(s["Q"], s["dfree"]), 3)]*2
    out.to_csv(f"{R}/cte_meta_analysis.csv", index=False)
    print(out.round(3).to_string(index=False))
    print(f"\nPooled fixed-effect: d={s['d_fe']:.3f} "
          f"[{s['d_fe']-1.96*s['se_fe']:.3f}, {s['d_fe']+1.96*s['se_fe']:.3f}] "
          f"P={2*stats.norm.sf(abs(s['d_fe']/s['se_fe'])):.2e}  I2={s['I2']:.0f}%")
    print("wrote results/cte_meta_analysis.csv")

def mean_pairwise_coh(M):
    C = np.corrcoef(M, rowvar=False); iu = np.triu_indices(C.shape[0], k=1)
    return np.nanmean(C[iu])

def run_leave_one_out(R, h5ad):
    import anndata as ad, scipy.sparse as sp
    A = ad.read_h5ad(h5ad, backed="r")
    idx = np.where(A.obs["cell_type"].astype(str).values == "Microglia")[0]
    present = [g for g in ACCEL if g in A.var_names]
    gi = [A.var_names.get_loc(g) for g in present]
    sub = A[idx].to_memory(); X = sub.X
    X = X.toarray() if sp.issparse(X) else np.asarray(X)
    Xg = X[:, gi]  # SEA-AD glia matrix is already log-normalized (max < 50)
    full = mean_pairwise_coh(Xg)
    rows = []
    for j, g in enumerate(present):
        keep = [k for k in range(len(present)) if k != j]
        coh = mean_pairwise_coh(Xg[:, keep])
        rows.append(dict(dropped_gene=g, coherence_without=coh, delta=coh - full))
    loo = pd.DataFrame(rows)
    loo["contribution"] = -loo["delta"]
    loo["is_DAM"] = ~loo.dropped_gene.isin(NON_DAM)
    loo = loo.sort_values("contribution", ascending=False).reset_index(drop=True)
    loo["rank"] = np.arange(1, len(loo) + 1)
    loo.to_csv(f"{R}/accelerator_leave_one_out.csv", index=False)
    dam = loo[loo.is_DAM].contribution; ndam = loo[~loo.is_DAM].contribution
    U, p = stats.mannwhitneyu(dam, ndam, alternative="two-sided")
    print(f"full coherence={full:.4f}; SPP1 delta={float(loo[loo.dropped_gene=='SPP1'].delta.iloc[0]):+.4f}; "
          f"DAM vs non-DAM contribution MWU P={p:.3f}")
    print("wrote results/accelerator_leave_one_out.csv")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--results", default=os.path.join(os.path.dirname(__file__), "..", "results"))
    ap.add_argument("--h5ad", default=None, help="SEA-AD glia h5ad; enables leave-one-out recompute")
    a = ap.parse_args()
    R = os.path.abspath(a.results)
    print("=== CTE meta-analysis (Supplementary Fig. 4a) ===")
    run_meta(R)
    if a.h5ad:
        print("\n=== accelerator leave-one-out (Supplementary Fig. 4b) ===")
        run_leave_one_out(R, a.h5ad)
    else:
        print("\n[leave-one-out skipped: pass --h5ad <SEA-AD glia h5ad> to recompute]")
