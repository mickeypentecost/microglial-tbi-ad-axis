#!/usr/bin/env python3
"""Module scoring — the shared primitive behind the accelerator/brake analyses.

Most result CSVs (imbalance, reproducibility forest, HA machinery, CTE validation,
spatial gradients) are downstream of one operation: scoring each cell/spot for the
accelerator and brake gene modules, then comparing conditions. This script defines
that scoring so it can be reproduced from any single-nucleus/spatial matrix.

Method: a mean-of-z-scores module score (equivalent in spirit to Seurat
AddModuleScore / AUCell rank-based scoring, but implementation-independent):
  1. log-normalize counts to log1p(CP10K),
  2. z-score each module gene across cells (within the object being scored),
  3. module score = mean z across the module's genes present in the object,
  4. compare module scores between conditions (per-sample means -> Mann-Whitney /
     Cohen's d), which avoids pseudoreplication from cells nested in donors.

Gene modules are the pre-specified sets (human symbols; mouse = title-case):
  ACCELERATOR (21):  SPP1 CD44 ITGAX TREM2 TYROBP C3 C1QA C1QB C1QC CST7 GPNMB
                     LPL CLEC7A LGALS3 TLR2 CD68 B2M APOE IL1B TNF CXCL10
  BRAKE (11):        TNFAIP6 HAS1 HAS2 HAS3 HMMR ANXA1 TGFB1 SOCS3 IL10 HYAL1 HYAL2

Usage:
    python code/score_modules.py --h5ad path/to/object.h5ad \\
        --celltype-col cell_type --celltype Microglia \\
        --condition-col condition --out results/my_scores.csv

Env: `scanpy` env (anndata + numpy + pandas + scipy). anndata is read backed to
     avoid loading multi-GB matrices into memory; genes are pulled column-wise.
"""
import argparse
import numpy as np
import pandas as pd

ACCELERATOR = ["SPP1", "CD44", "ITGAX", "TREM2", "TYROBP", "C3", "C1QA", "C1QB",
               "C1QC", "CST7", "GPNMB", "LPL", "CLEC7A", "LGALS3", "TLR2", "CD68",
               "B2M", "APOE", "IL1B", "TNF", "CXCL10"]
BRAKE = ["TNFAIP6", "HAS1", "HAS2", "HAS3", "HMMR", "ANXA1", "TGFB1", "SOCS3",
         "IL10", "HYAL1", "HYAL2"]


def _match_symbols(module, var_names, species):
    """Match module symbols to an object's var_names (human upper / mouse title)."""
    if species == "mouse":
        want = {g.capitalize(): g for g in module}
    else:
        want = {g.upper(): g for g in module}
    present = [v for v in var_names if (v.capitalize() if species == "mouse" else v.upper()) in want]
    return present


def score_object(adata, genes, species="human"):
    """Return a per-cell module score (mean z across present module genes)."""
    import scipy.sparse as sp
    present = _match_symbols(genes, list(adata.var_names), species)
    if not present:
        raise ValueError("no module genes found in object var_names")
    gi = [adata.var_names.get_loc(g) for g in present]
    sub = adata[:, gi].to_memory() if adata.isbacked else adata[:, gi]
    X = sub.X
    X = X.toarray() if sp.issparse(X) else np.asarray(X)
    # log-normalize to log1p(CP10K) if the matrix looks like raw counts
    if np.nanmax(X) > 50:
        lib = np.asarray(adata.X.sum(1)).ravel() if not adata.isbacked else None
        # fall back to per-cell sum over the full matrix when available
        totals = lib if lib is not None else X.sum(1)
        totals[totals == 0] = 1
        X = np.log1p(X / totals[:, None] * 1e4)
    z = (X - X.mean(0)) / (X.std(0) + 1e-9)
    return z.mean(1), present


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--h5ad", required=True)
    ap.add_argument("--celltype-col")
    ap.add_argument("--celltype")
    ap.add_argument("--condition-col", required=True)
    ap.add_argument("--sample-col", help="donor/sample column for per-sample aggregation")
    ap.add_argument("--species", default="human", choices=["human", "mouse"])
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    import anndata as ad
    adata = ad.read_h5ad(a.h5ad, backed="r")
    if a.celltype_col and a.celltype:
        mask = adata.obs[a.celltype_col].astype(str) == a.celltype
        adata = adata[mask.values].to_memory()

    acc, acc_genes = score_object(adata, ACCELERATOR, a.species)
    brk, brk_genes = score_object(adata, BRAKE, a.species)
    df = pd.DataFrame({
        "condition": adata.obs[a.condition_col].astype(str).values,
        "accelerator": acc,
        "brake": brk,
        "imbalance": acc - brk,
    })
    if a.sample_col:
        df["sample"] = adata.obs[a.sample_col].astype(str).values
    df.to_csv(a.out, index=False)
    print(f"scored {len(df)} cells; accelerator genes matched {len(acc_genes)}/{len(ACCELERATOR)}, "
          f"brake {len(brk_genes)}/{len(BRAKE)}")
    print(f"wrote {a.out}")


if __name__ == "__main__":
    main()
