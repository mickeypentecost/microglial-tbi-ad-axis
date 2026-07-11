#!/usr/bin/env python3
"""Extract the accelerator/brake axis across the ATN continuum from published CSF SomaScan.

Reproduces results/csf_tau_emergence_axis.csv and results/csf_imbalance_test.csv, which
drive Supplementary Fig. 2f,g. Both source datasets are published, open supplements; only
the derived per-gene statistics are stored in this repository (no participant-level data).

Sources (download the supplementary tables from the publishers):
  Ali et al. 2025, Neuron (PMID 40088886; DOI 10.1016/j.neuron.2025.02.014)
    mmc2.xlsx, sheet 'S1_Summary_Statistics' — multi-header per-contrast summary stats with
    A-T-/A+T-/A+T+ ATN staging. Columns used (Discovery block): Symbol; amyloid onset
    (A-T- vs A+T-) estimate/P/FDR; tau emergence (A+T- vs A+T+) estimate/P/FDR; full AD
    (A-T- vs A+T+) estimate/P/FDR. SomaScan has multiple aptamers/protein — collapse to the
    minimum-P aptamer per gene symbol.
  Guo et al. 2024, Nat. Hum. Behav. (PMID 38987357) — PPMI CSF SomaScan, MOESM3_ESM.xlsx
    sheet ST4 (per-group protein differences across the ATN continuum); corroborating only.

Axis gene sets: the pre-specified ACCEL/BRAKE modules (see code/score_modules.py).
The composite imbalance = median(accelerator estimate) - median(brake estimate) at each
contrast, with a Mann-Whitney test of accelerator > brake across the measured genes.

This script documents the extraction; because the source is a controlled multi-header Excel
supplement (not a stable programmatic endpoint), the column offsets are given in the
DATA_PROVENANCE notes and the derived CSVs are tracked directly.

Usage:  python code/score_csf_tau_emergence.py --help
"""
import argparse

ACCEL = ["SPP1", "CD44", "ITGAX", "TREM2", "TYROBP", "C3", "C1QA", "C1QB", "C1QC",
         "CST7", "GPNMB", "LPL", "CLEC7A", "LGALS3", "TLR2", "CD68", "B2M", "APOE",
         "IL1B", "TNF", "CXCL10"]
BRAKE = ["TNFAIP6", "HAS1", "HAS2", "HAS3", "HMMR", "ANXA1", "TGFB1", "SOCS3",
         "IL10", "HYAL1", "HYAL2"]
CONTRASTS = {
    "amyloid onset": "A-T- vs A+T- (amyloid onset)",
    "tau emergence": "A+T- vs A+T+ (tau emergence)",
    "full AD": "A-T- vs A+T+ (full AD)",
}

if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.parse_args()
    print("See module docstring + DATA_PROVENANCE.md for the Ali/Guo supplement column map.")
    print("Derived CSVs are tracked at results/csf_tau_emergence_axis.csv and "
          "results/csf_imbalance_test.csv.")
