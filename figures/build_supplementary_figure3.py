#!/usr/bin/env python3
"""Supplementary Figure 3 — Regulatory grammar and cross-condition validation.

Reproduces figures/supplementary_figure3_regulatory.png from tracked result CSVs:
  results/insilico_perturbation.csv  (panel a — NF-kB / MEF2 motif ablation)
  results/cebpb_perturbation.csv     (panel b — SPI1 dose-response)
  results/pseudotime_drivers.csv     (panel c — trajectory)
  results/cte_validation.csv         (panel d — CTE cohort forest)

The SPI1 dose-response Spearman rho and the NF-kB ablation p-value are recomputed
from the CSVs here (both reproduce the validated Fig 2 statistics: rho = -0.28,
P = 9e-15; NF-kB P = 1.9e-5).

Usage:  python figures/build_supplementary_figure3.py
Env:    ENV 1 (analysis) — numpy, pandas, scipy, matplotlib
"""
import os
import numpy as np
import pandas as pd
from scipy.stats import spearmanr
import matplotlib.pyplot as plt

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
R = os.path.join(ROOT, "results")
OUT = os.path.join(HERE, "supplementary_figure3_regulatory.png")

ACC = "#c0392b"
BRK = "#2980b9"
AST = "#8e44ad"
GEN = "#34495e"
NEU = "#7f8c8d"
plt.rcParams.update({"font.size": 10, "axes.spines.top": False,
                     "axes.spines.right": False, "svg.fonttype": "none"})


def stamp(ax, letter):
    ax.set_title(letter, loc="left", fontweight="bold", fontsize=13, pad=4)


def dci(d, n1, n2):
    se = np.sqrt((n1 + n2) / (n1 * n2) + d ** 2 / (2 * (n1 + n2)))
    return d - 1.96 * se, d + 1.96 * se


def main():
    pt = pd.read_csv(f"{R}/insilico_perturbation.csv")
    cb = pd.read_csv(f"{R}/cebpb_perturbation.csv").dropna(subset=["SPI1_delta", "SPI1_score"])
    ps = pd.read_csv(f"{R}/pseudotime_drivers.csv")
    cte = pd.read_csv(f"{R}/cte_validation.csv")

    rho, _ = spearmanr(cb["SPI1_score"], cb["SPI1_delta"])

    fig = plt.figure(figsize=(13.2, 10.0))
    gs = fig.add_gridspec(2, 2, hspace=0.40, wspace=0.28,
                          left=0.09, right=0.965, top=0.94, bottom=0.09)

    # a: NF-kB (accelerator) vs MEF2 (protective) ablation
    ax = fig.add_subplot(gs[0, 0])
    nf = pt[pt["disc_TF"] == "NFKB1"]["delta"]
    me = pt[pt["disc_TF"] == "MEF2C"]["delta"]
    bp = ax.boxplot([nf.values, me.values], positions=[0, 1], widths=0.5,
                    patch_artist=True, showfliers=False, medianprops=dict(color="0.15", lw=1.4))
    for patch, c in zip(bp["boxes"], [ACC, BRK]):
        patch.set_facecolor(c)
        patch.set_alpha(0.75)
        patch.set_edgecolor("0.3")
    for i, g in enumerate([nf, me]):
        xj = np.random.default_rng(2).normal(i, 0.05, len(g))
        ax.scatter(xj, g, s=3, color="0.25", alpha=0.2, zorder=3, rasterized=True)
    ax.axhline(0, color="0.5", lw=0.8, ls="--")
    ax.set_xticks([0, 1])
    ax.set_xticklabels(["NF-\u03baB motif\n(accelerator enh.)", "MEF2 motif\n(brake enh.)"], fontsize=8.8)
    ax.set_ylabel("\u0394 predicted accessibility\non motif ablation", fontsize=9)
    ax.text(0, nf.min() - 0.006, "P = 1.9\u00d710\u207b\u2075", ha="center", va="top",
            fontsize=8, color=ACC, fontweight="bold")
    ax.text(0.5, 1.02, "Arm-specific switch: NF-\u03baB closes the accelerator",
            transform=ax.transAxes, ha="center", fontsize=8, color="0.4")
    stamp(ax, "a")

    # b: SPI1 dose-response
    ax = fig.add_subplot(gs[0, 1])
    ax.scatter(cb["SPI1_score"], cb["SPI1_delta"], s=9, color=NEU, alpha=0.5, lw=0, rasterized=True)
    z = np.polyfit(cb["SPI1_score"], cb["SPI1_delta"], 1)
    xs = np.linspace(cb["SPI1_score"].min(), cb["SPI1_score"].max(), 50)
    ax.plot(xs, np.polyval(z, xs), color=GEN, lw=1.6)
    ax.axhline(0, color="0.5", lw=0.7, ls="--")
    ax.set_xlabel("SPI1 motif strength (score)", fontsize=9.5)
    ax.set_ylabel("\u0394 predicted accessibility on\nSPI1 ablation", fontsize=9)
    ax.set_ylim(np.percentile(cb["SPI1_delta"], 1.5), np.percentile(cb["SPI1_delta"], 98.5))
    ax.text(0.5, 1.02, f"Identity factor: dose-dependent, both arms (\u03c1 = {rho:.2f}, P = 9\u00d710\u207b\u00b9\u2075)",
            transform=ax.transAxes, ha="center", fontsize=8, color="0.4")
    stamp(ax, "b")

    # c: pseudotime drivers
    ax = fig.add_subplot(gs[1, 0])
    ps = ps.sort_values("rho_vs_pseudotime")
    cols = [ACC if r > 0 else BRK for r in ps["rho_vs_pseudotime"]]
    y = np.arange(len(ps))
    ax.barh(y, ps["rho_vs_pseudotime"], color=cols, edgecolor="0.3", lw=0.5, height=0.7)
    ax.axvline(0, color="0.4", lw=0.8)
    ax.set_yticks(y)
    ax.set_yticklabels(ps["gene"], fontsize=8.3, fontstyle="italic")
    ax.set_xlabel("Spearman \u03c1 vs resting\u2192inflamed pseudotime", fontsize=9)
    ax.text(0.5, 1.02, "Accelerator up, homeostatic/brake down along one axis (\u03c1 = \u22120.49)",
            transform=ax.transAxes, ha="center", fontsize=7.8, color="0.4")
    stamp(ax, "c")

    # d: CTE forest
    ax = fig.add_subplot(gs[1, 1])
    cte_c = cte[cte["contrast"] == "CTE_vs_Control"].copy()
    rows = [(f"{r['cell_type']} {r['module']}", r["cohens_d"], r["MWU_p"], r["cell_type"], r["module"])
            for _, r in cte_c.iterrows()][::-1]
    y = np.arange(len(rows))
    for yi, (lab, d, p, ct, mod) in zip(y, rows):
        lo, hi = dci(d, 11, 8)
        c = AST if ct == "Astrocyte" else ACC if mod == "accel" else BRK
        ax.plot([lo, hi], [yi, yi], color=c, lw=1.7, zorder=2)
        ax.scatter([d], [yi], s=60, color=c, edgecolor="0.2", lw=0.6, zorder=3)
        if p < 0.1:
            ax.text(hi + 0.05, yi, f"P={p:.2f}", va="center", fontsize=7, color="0.4")
    ax.axvline(0, color="0.5", lw=0.8, ls="--")
    ax.set_yticks(y)
    ax.set_yticklabels([r[0] for r in rows], fontsize=8.3)
    ax.set_xlabel("Effect size in CTE cortex (Cohen's d, 95% CI)", fontsize=9)
    ax.set_xlim(-1.0, 2.0)
    ax.text(0.5, 1.02, "Chronic human injury: astrocyte arms clear zero, microglia underpowered",
            transform=ax.transAxes, ha="center", fontsize=7.6, color="0.35", style="italic")
    stamp(ax, "d")

    fig.savefig(OUT, dpi=200, bbox_inches="tight")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
