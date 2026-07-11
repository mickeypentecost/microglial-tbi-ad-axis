#!/usr/bin/env python3
"""Supplementary Figure 2 — The resolution brake: mechanism and measurement limits.

Reproduces figures/supplementary_figure2_brake.png from tracked result CSVs:
  results/ha_machinery_cerebri.csv     (panel a — microglial HA sensor/receptor/brake)
  results/resolution_bulk_astrocyte_tbi.csv (panel b — sorted-astrocyte bulk)
  results/ha_degraders_cerebri.csv     (panel c — four fragmentation routes)
  results/imbalance_ratio_cerebri.csv  (panel d — accelerator-brake imbalance)
  results/brake_forest.csv             (panel e — reproducibility forest)
  results/csf_tau_emergence_axis.csv   (panels f,g — human CSF SomaScan across ATN)
  results/csf_imbalance_test.csv       (panel g annotation — composite imbalance)

Usage:  python figures/build_supplementary_figure2.py
Env:    ENV 1 (analysis) — numpy, pandas, matplotlib
"""
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
R = os.path.join(ROOT, "results")
OUT = os.path.join(HERE, "supplementary_figure2_brake.png")

ACC = "#c0392b"
BRK = "#2980b9"
AST = "#8e44ad"
HL = "#e67e22"
NEU = "#7f8c8d"
plt.rcParams.update({"font.size": 10, "axes.spines.top": False,
                     "axes.spines.right": False, "svg.fonttype": "none"})


def stamp(ax, letter, dx=-0.16):
    # match main-figure panel letters: capital, bold, size 13, top-left outside axes
    ax.text(dx, 1.05, letter, transform=ax.transAxes, fontsize=13,
            fontweight="bold", va="bottom", ha="right")


def main():
    ha = pd.read_csv(f"{R}/ha_machinery_cerebri.csv")
    astro = pd.read_csv(f"{R}/resolution_bulk_astrocyte_tbi.csv")
    deg = pd.read_csv(f"{R}/ha_degraders_cerebri.csv")
    imb = pd.read_csv(f"{R}/imbalance_ratio_cerebri.csv")
    forest = pd.read_csv(f"{R}/brake_forest.csv")
    csf = pd.read_csv(f"{R}/csf_tau_emergence_axis.csv")
    csf_imb = pd.read_csv(f"{R}/csf_imbalance_test.csv")
    csf_apt = pd.read_csv(f"{R}/csf_brake_aptamers.csv")

    fig = plt.figure(figsize=(14.0, 13.2))
    gs = fig.add_gridspec(3, 6, hspace=0.60, wspace=1.5,
                          height_ratios=[1.0, 1.0, 0.85],
                          left=0.07, right=0.975, top=0.955, bottom=0.07)

    # a: microglial HA machinery
    ax = fig.add_subplot(gs[0, 0:2])
    mha = ha[ha["cell_type"] == "Microglia"].copy()
    order = ["Tlr2", "Cd44", "Hmmr", "Tnfaip6", "Anxa1", "Tgfb1", "Hyal1", "Hyal2"]
    sel = mha.set_index("gene").loc[order].reset_index()
    cols = [HL if g == "Tlr2" else (ACC if g in ("Cd44", "Hmmr") else BRK) for g in sel["gene"]]
    y = np.arange(len(sel))[::-1]
    ax.barh(y, sel["delta"], color=cols, edgecolor="0.3", lw=0.6, height=0.66)
    ax.axvline(0, color="0.4", lw=0.8)
    for yi, (_, r) in zip(y, sel.iterrows()):
        if r["p"] < 0.05:
            ax.text(r["delta"] + (0.012 if r["delta"] >= 0 else -0.012), yi, "*",
                    va="center", ha="left" if r["delta"] >= 0 else "right",
                    fontsize=11, color="0.2", fontweight="bold")
    ax.set_yticks(y)
    ax.set_yticklabels(sel["gene"], fontsize=8.5, fontstyle="italic")
    ax.set_xlabel("\u0394 mean log-expr (TBI \u2212 Ctrl),\nmicroglia", fontsize=8.3)
    ax.set_xlim(-0.42, 0.32)
    stamp(ax, "A")

    # b: sorted-astrocyte bulk
    ax = fig.add_subplot(gs[0, 2:4])
    order = ["SPP1", "HMMR", "SOCS3", "TGFB1", "CD44", "HAS2", "TNFAIP6"]
    ab = astro.set_index("gene").loc[order].reset_index()
    cols = [BRK if g in ("TGFB1", "TNFAIP6", "SOCS3", "HAS2") else (AST if g in ("CD44", "HMMR") else ACC)
            for g in ab["gene"]]
    y = np.arange(len(ab))[::-1]
    ax.barh(y, ab["astro_delta_TBI"], color=cols, edgecolor="0.3", lw=0.6, height=0.66)
    ax.axvline(0, color="0.4", lw=0.8)
    for yi, (_, r) in zip(y, ab.iterrows()):
        if r["astro_p"] < 0.05:
            ax.text(r["astro_delta_TBI"] + (0.12 if r["astro_delta_TBI"] >= 0 else -0.12), yi, "*",
                    va="center", ha="left" if r["astro_delta_TBI"] >= 0 else "right",
                    fontsize=11, color="0.2", fontweight="bold")
    ax.set_yticks(y)
    ax.set_yticklabels(ab["gene"], fontsize=8.5, fontstyle="italic")
    ax.set_xlabel("\u0394 log\u2082 (TBI \u2212 Ctrl),\nsorted astrocyte bulk", fontsize=8.3)
    stamp(ax, "B")

    # c: four fragmentation routes
    ax = fig.add_subplot(gs[0, 4:6])
    dg = deg[deg["cell"] == "Microglia"].copy()
    order = ["Cemip", "Tmem2", "Hyal1", "Hyal2", "Cybb", "Rac2"]
    dg = dg.set_index("gene").loc[order].reset_index()
    cols = ["0.65", "0.65", "0.65", "0.65", HL, HL]
    y = np.arange(len(dg))[::-1]
    ax.barh(y, dg["pct_TBI"], color=cols, edgecolor="0.3", lw=0.6, height=0.66)
    for yi, (_, r) in zip(y, dg.iterrows()):
        lab = f"{r['pct_TBI']:.1f}%" + ("  *" if r["p"] < 0.05 else "")
        ax.text(r["pct_TBI"] + 0.6, yi, lab, va="center", fontsize=7.6, color="0.25")
    ax.set_yticks(y)
    ax.set_yticklabels(dg["gene"], fontsize=8.5, fontstyle="italic")
    ax.set_xlabel("% of TBI microglia detecting", fontsize=8.3)
    ax.set_xlim(0, 44)
    stamp(ax, "C")

    # d: accelerator-brake imbalance
    ax = fig.add_subplot(gs[1, 0:2])
    grp = [("Control", imb[imb["condition"] == "Control"]["imbalance"], NEU),
           ("TBI", imb[imb["condition"] == "TBI"]["imbalance"], ACC)]
    for i, (n, v, c) in enumerate(grp):
        xj = np.random.default_rng(1).normal(i, 0.06, len(v))
        ax.scatter(xj, v, s=22, color=c, alpha=0.7, edgecolor="0.3", lw=0.4, zorder=3)
        ax.hlines(v.mean(), i - 0.22, i + 0.22, color="0.15", lw=2, zorder=4)
    ax.axhline(0, color="0.5", lw=0.8, ls="--")
    ax.set_xticks([0, 1])
    ax.set_xticklabels(["Control", "TBI"], fontsize=9.5)
    ax.set_ylabel("Accelerator \u2212 brake imbalance\n(per-sample z-score)", fontsize=8.5)
    ax.set_xlim(-0.5, 1.5)
    ax.text(0.02, 0.98, "P = 1\u00d710\u207b\u2074", transform=ax.transAxes,
            ha="left", va="top", fontsize=7.5, color=ACC)
    stamp(ax, "D")

    # e: reproducibility forest
    ax = fig.add_subplot(gs[1, 2:4])
    y = np.arange(len(forest))[::-1]
    for yi, (_, r) in zip(y, forest.iterrows()):
        c = ACC if r["d"] < 0 else BRK
        ax.plot([r["lo"], r["hi"]], [yi, yi], color=c, lw=1.8, zorder=2)
        ax.scatter([r["d"]], [yi], s=70, color=c, edgecolor="0.2", lw=0.6, zorder=3)
    ax.axvline(0, color="0.5", lw=0.8, ls="--")
    ax.set_yticks(y)
    short = {"SEA-AD (human AD, snRNA)": "SEA-AD\n(human AD)",
             "CEREBRI (mouse TBI, snRNA)": "CEREBRI\n(mouse TBI)"}
    ax.set_yticklabels([short.get(d, d) for d in forest["dataset"]], fontsize=7.6)
    ax.set_xlabel("Brake-module d (95% CI)", fontsize=8.3)
    ax.set_ylim(-0.6, 1.6)
    ax.set_xlim(-1.9, 1.1)
    stamp(ax, "E")

    # f: human CSF brake-ligand trajectory across the ATN continuum (SomaScan)
    # cumulative estimate from A-T- baseline: amyloid onset, then tau emergence
    ax = fig.add_subplot(gs[1, 4:6])
    stages = ["A\u2212T\u2212", "A+T\u2212", "A+T+"]
    xs = [0, 1, 2]
    # TGFB1: three SomaScan aptamers plotted separately (they disagree in direction) — faint
    tgf = csf_apt[csf_apt["gene"] == "TGFB1"]
    for i, (_, r) in enumerate(tgf.iterrows()):
        ax.plot(xs, [r["cum_AmT"], r["cum_ApT"], r["cum_ApTp"]], marker="s", color=AST,
                lw=1.0, ms=4, alpha=0.5, zorder=2,
                label="TGFB1 aptamers (n=3)" if i == 0 else None)
    # TSG-6: single clean aptamer — bold
    ts = csf_apt[csf_apt["gene"] == "TNFAIP6"].iloc[0]
    ax.plot(xs, [ts["cum_AmT"], ts["cum_ApT"], ts["cum_ApTp"]], marker="o", color=BRK,
            lw=2.4, ms=7, zorder=3, label="TSG-6 (single aptamer)")
    ax.axhline(0, color="0.6", lw=0.8, ls="--")
    ax.set_xticks(xs); ax.set_xticklabels(stages, fontsize=9)
    ax.set_ylabel("\u0394 CSF level (log\u2082, vs A\u2212T\u2212)", fontsize=8.5)
    ax.set_xlim(-0.25, 2.25)
    ax.legend(fontsize=6.6, loc="lower left", frameon=False)
    stamp(ax, "F")

    # g: full axis at tau emergence (A+T- -> A+T+), accelerator up / brake down — own row
    ax = fig.add_subplot(gs[2, 1:5])
    te = csf[csf["contrast"] == "A+T- vs A+T+ (tau emergence)"].copy()
    # sort descending so accelerators (positive) are on the left
    te = te.sort_values("estimate", ascending=False).reset_index(drop=True)
    x = np.arange(len(te))
    cols = [ACC if a == "accelerator" else BRK for a in te["arm"]]
    ax.bar(x, te["estimate"], color=cols, edgecolor="0.3", lw=0.4, width=0.72)
    ax.axhline(0, color="0.4", lw=0.8)
    ax.set_xticks(x)
    xlabs = ["TSG-6" if g == "TNFAIP6" else g for g in te["gene"]]
    ax.set_xticklabels(xlabs, fontsize=6.8, fontstyle="italic", rotation=90)
    ax.set_ylabel("\u0394 at tau emergence\n(A+T\u2212 \u2192 A+T+), log\u2082", fontsize=8.3)
    # mark TSG-6 P
    ts_p = te[te["gene"] == "TNFAIP6"]["P"].iloc[0]
    ti = list(te["gene"]).index("TNFAIP6")
    ax.text(ti, 0.006, f"TSG-6\nP = {ts_p:.0e}", fontsize=6.5, color=BRK,
            ha="center", va="bottom")
    from matplotlib.patches import Patch
    ax.legend(handles=[Patch(color=ACC, label="accelerator"), Patch(color=BRK, label="brake")],
              fontsize=7.5, loc="upper right", frameon=False)
    stamp(ax, "G")

    fig.savefig(OUT, dpi=200, bbox_inches="tight")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
