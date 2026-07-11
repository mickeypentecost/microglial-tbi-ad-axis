#!/usr/bin/env python3
"""Score the accelerator module across McKee CTE stage in the Emory/BU CTE proteomics.

Reproduces results/cte_proteomics_mckee.csv and results/cte_proteomics_protein_trends.csv
(which drive the Fig 1d forest row and Supplementary Fig. 3e), from the published,
open-access Emory/Boston University CTE brain proteomics deposited on Synapse
(syn51217209; Gutierrez-Quiceno et al., Mol. Neurodegener. 2021, PMID 34172091).

Inputs (download from Synapse into data/raw/emory_cte_proteomics/):
  EmoryCTE_matrix.csv   = syn51217282, 'EmoryCTE_2xTAMPOR_9152x87_log2(...).csv'
                          (protein x sample, log2 abundance / central tendency; index 'SYMBOL|UNIPROT')
  EmoryCTE_traits.csv   = syn51217281, sample metadata (Dx, FullDx = McKee stage CTE1-4)

Method: the matrix is already log2-ratio and centred, so the accelerator module score is
the mean of per-protein z-scores (across samples) over the measured accelerator genes.
Only the accelerator arm is testable — the brake ligands (TNFAIP6/TGFB1/SOCS3/HAS/HYAL)
are below the TMT mass-spectrometry detection floor (only ANXA1 is on the panel).

Usage:  python code/score_cte_proteomics.py --raw data/raw/emory_cte_proteomics --out results
"""
import os
import argparse
import numpy as np
import pandas as pd
from scipy import stats

ACCEL = ["SPP1", "CD44", "ITGAX", "TREM2", "TYROBP", "C3", "C1QA", "C1QB", "C1QC",
         "CST7", "GPNMB", "LPL", "CLEC7A", "LGALS3", "TLR2", "CD68", "B2M", "APOE",
         "IL1B", "TNF", "CXCL10"]
STAGE_MAP = {"Control": 0, "CTE1": 1, "CTE2": 2, "CTE3": 3, "CTE4": 4}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default="data/raw/emory_cte_proteomics")
    ap.add_argument("--out", default="results")
    a = ap.parse_args()

    mat = pd.read_csv(os.path.join(a.raw, "EmoryCTE_matrix.csv"), index_col=0)
    tr = pd.read_csv(os.path.join(a.raw, "EmoryCTE_traits.csv"), index_col=0)

    # symbol from 'SYMBOL|UNIPROT'; collapse duplicate symbols by mean
    mat.index = pd.Series(mat.index).astype(str).str.split("|").str[0].str.upper().values
    mat = mat.groupby(level=0).mean()

    present = [g for g in ACCEL if g in mat.index]
    acc = mat.loc[present]
    z = acc.sub(acc.mean(1), axis=0).div(acc.std(1) + 1e-9, axis=0)
    acc_score = z.mean(0)

    d = tr.copy()
    d["acc_score"] = acc_score.reindex(d.index).values
    cte = d[d["FullDx"].isin(STAGE_MAP)].copy()
    cte["stage"] = cte["FullDx"].map(STAGE_MAP)

    rho, p = stats.spearmanr(cte["stage"], cte["acc_score"])
    print(f"accelerator ~ McKee stage: rho={rho:.3f} P={p:.4f} n={len(cte)}")

    cte[["FullDx", "stage", "acc_score", "Dx", "Region", "Age", "Sex"]].to_csv(
        os.path.join(a.out, "cte_proteomics_mckee.csv"))

    rows = []
    for g in present:
        rho_g, p_g = stats.spearmanr(cte["stage"], mat.loc[g].reindex(cte.index).values)
        rows.append({"gene": g, "rho": rho_g, "P": p_g})
    pd.DataFrame(rows).to_csv(os.path.join(a.out, "cte_proteomics_protein_trends.csv"), index=False)
    print(f"wrote {a.out}/cte_proteomics_mckee.csv + cte_proteomics_protein_trends.csv")


if __name__ == "__main__":
    main()
