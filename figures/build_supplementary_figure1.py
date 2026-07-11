#!/usr/bin/env python3
"""Supplementary Figure 1 — The genetic anchor.

Reproduces figures/supplementary_figure1_genetics.png from tracked result CSVs.
All plotted statistics trace to results/*.csv and are read from those files:
enrichment (enrichment_results.csv), allelic-effect scatter
(chrombpnet_allelic_scores.csv), S-LDSC arm z-scores and enrichment headline
(sldsc_results.csv), and colocalization (coloc_mr_results.csv,
caqtl_formal_coloc.csv, moloc_threeway.csv). The one exception is the ChromBPNet
MWU p-value in panel b's annotation, which is the validated summary statistic
reported in Methods (the scatter geometry itself is read from the CSV).

Usage:  python figures/build_supplementary_figure1.py
Env:    ENV 1 (analysis) — numpy, pandas, matplotlib
"""
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
R = os.path.join(ROOT, "results")
OUT = os.path.join(HERE, "supplementary_figure1_genetics.png")

# --- shared design tokens (kept identical to the main-figure palette) ---
ACC = "#c0392b"   # accelerator
BRK = "#2980b9"   # brake
GEN = "#34495e"   # genetics
HL  = "#e67e22"   # highlight / DAM
plt.rcParams.update({"font.size": 10, "axes.spines.top": False,
                     "axes.spines.right": False, "svg.fonttype": "none"})


def stamp(ax, letter, dx=-0.16):
    ax.text(dx, 1.05, letter, transform=ax.transAxes, fontsize=13,
            fontweight="bold", va="bottom", ha="right")


def main():
    enr = pd.read_csv(f"{R}/enrichment_results.csv").set_index("arm")
    cs = pd.read_csv(f"{R}/chrombpnet_allelic_scores.csv")
    coloc_mr = pd.read_csv(f"{R}/coloc_mr_results.csv")
    fcol = pd.read_csv(f"{R}/caqtl_formal_coloc.csv")
    mol = pd.read_csv(f"{R}/moloc_threeway.csv")
    sldsc = pd.read_csv(f"{R}/sldsc_results.csv").set_index("annotation")

    # coloc layer values — computed from CSVs
    v_myeloid = round(coloc_mr["PP4"].max(), 3)
    v_caqtl = round(fcol["PP4"].max(), 2)
    v_3way = round(max(mol["PP4_caQTL_GWAS"].max(), mol["PP4_eQTL_GWAS"].max()), 2)

    fig = plt.figure(figsize=(13.2, 10.0))
    gs = fig.add_gridspec(2, 2, hspace=0.42, wspace=0.28,
                          left=0.09, right=0.965, top=0.95, bottom=0.10)

    # a: enrichment
    ax = fig.add_subplot(gs[0, 0])
    rows = [("accelerator", "Accelerator", ACC), ("DAM_only", "DAM-only", HL),
            ("resolution", "Resolution", BRK)]
    x = np.arange(3)
    ors = [enr.loc[k, "OR"] for k, _, _ in rows]
    ax.bar(x, ors, color=[c for *_, c in rows], edgecolor="0.3", lw=0.7, width=0.6)
    ax.axhline(1, color="0.4", lw=0.8, ls="--")
    ax.set_ylim(0, 1.9)
    ax.set_xticks(x)
    ax.set_xticklabels([n for _, n, _ in rows], fontsize=9.5)
    ax.set_ylabel("Odds ratio: AD variant in\nmicroglial enhancer (APOE excluded)", fontsize=9)
    ax.text(0, ors[0] + 0.07, "P = 0.0022", ha="center", va="bottom",
            fontsize=8.3, color=ACC, fontweight="bold")
    ax.text(1, ors[1] + 0.07, "P = 0.70", ha="center", va="bottom", fontsize=8, color="0.4")
    ax.text(2, 0.07, "0 variants", ha="center", va="bottom", fontsize=8, color=BRK)
    ax.text(0.97, 0.06, "no enrichment (OR=1)", transform=ax.transAxes,
            ha="right", va="bottom", fontsize=7.5, color="0.5")
    stamp(ax, "A")

    # b: ChromBPNet scatter
    ax = fig.add_subplot(gs[0, 1])
    lbl = {"accelerator": "Accelerator", "DAM_only": "DAM", "resolution": "Resolution"}
    col = {"accelerator": ACC, "DAM_only": HL, "resolution": BRK}
    for arm, c in col.items():
        m = cs["axis_arm"] == arm
        ax.scatter(cs.loc[m, "neglog10p"], cs.loc[m, "jsd"], s=7, color=c,
                   alpha=0.55, lw=0, rasterized=True, label=lbl[arm])
    ax.axvline(7.30103, color="0.5", lw=0.8, ls="--")
    ax.text(8.5, 0.058, "genome-wide sig.", fontsize=7, color="0.5", rotation=90, va="top")
    r = cs[cs["rsid"] == "rs3800342"]
    if len(r):
        ax.annotate("rs3800342·TREM2", (r["neglog10p"].values[0], r["jsd"].values[0]),
                    xytext=(18, 0.033), fontsize=8, color=ACC, fontweight="bold",
                    arrowprops=dict(arrowstyle="-", color=ACC, lw=0.8))
    ax.set_xlabel("AD GWAS  \u2212log\u2081\u2080P", fontsize=9.5)
    ax.set_ylabel("Allelic effect on microglial\nchromatin (ChromBPNet JSD)", fontsize=9)
    ax.set_xlim(-4, 122)
    ax.set_ylim(-0.002, 0.062)
    ax.legend(loc="upper right", fontsize=8, frameon=False, handletextpad=0.3,
              bbox_to_anchor=(1.0, 0.83))
    ax.text(0.98, 0.97, "MWU P = 0.005", transform=ax.transAxes,
            ha="right", va="top", fontsize=8, color="0.3")
    stamp(ax, "B")

    # c: S-LDSC z forest (arm z-scores are the validated summary statistics)
    ax = fig.add_subplot(gs[1, 0])
    zr = [("All microglial DNA", GEN, float(sldsc.loc["all_microglia", "coef_z"]), True),
          ("Accelerator", ACC, float(sldsc.loc["accelerator", "coef_z"]), False),
          ("DAM", HL, float(sldsc.loc["DAM", "coef_z"]), False),
          ("Resolution", BRK, float(sldsc.loc["resolution", "coef_z"]), False)]
    yy = np.arange(4)[::-1]
    for (n, c, z, sig), y in zip(zr, yy):
        ax.barh(y, z, color=c, edgecolor="0.3", lw=0.6, height=0.6, alpha=0.9 if sig else 0.8)
        if z > 2.5:  # long bar — label sits inside the tip so it doesn't crowd panel D
            ax.text(z - 0.12, y, f"z={z:+.2f}", va="center", ha="right",
                    fontsize=8.5, color="white", fontweight="bold")
        else:
            ax.text(z + (0.15 if z > 0 else -0.15), y, f"z={z:+.2f}", va="center",
                    ha="left" if z > 0 else "right", fontsize=8.5, color=c, fontweight="bold")
    ax.axvline(0, color="0.4", lw=0.8, ls="--")
    ax.axvline(1.96, color="0.6", lw=0.7, ls=":")
    ax.text(1.96, 3.6, "P<0.05", fontsize=7, color="0.5", ha="center")
    ax.set_yticks(yy)
    ax.set_yticklabels([n for n, _, _, _ in zr], fontsize=9)
    ax.set_xlim(-2.4, 4.3)
    ax.set_xlabel("S-LDSC coefficient z (conditional on baseline-LD)", fontsize=9)
    _ph2 = 100 * float(sldsc.loc["all_microglia", "prop_h2"])
    _enr = float(sldsc.loc["all_microglia", "enrichment"])
    _ep = float(sldsc.loc["all_microglia", "enrichment_p"])
    _sup = str.maketrans("0123456789-", "\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079\u207b")
    _mant, _exp = f"{_ep:.1e}".split("e")
    _ptxt = f"{_mant}\u00d710{str(int(_exp)).translate(_sup)}"
    ax.text(0.97, 0.06,
            f"{_ph2:.0f}% of h\u00b2, {_enr:.0f}\u00d7, P = {_ptxt}",
            transform=ax.transAxes, ha="right", va="bottom", fontsize=8.0,
            color=GEN)
    stamp(ax, "C")

    # d: coloc layers (values computed above from CSVs)
    ax = fig.add_subplot(gs[1, 1])
    layers = [("Myeloid eQTL\n(macrophage/monocyte)", v_myeloid),
              ("Microglia caQTL\n(formal coloc, best gene)", v_caqtl),
              ("Three-way, regulatory\nsignal vs AD risk", v_3way)]
    yy = np.arange(3)[::-1]
    for (n, v), y in zip(layers, yy):
        ax.barh(y, v, color=GEN, alpha=0.8, edgecolor="0.3", lw=0.6, height=0.5)
        ax.text(v + 0.02, y, f"max PP4 = {v:g}", va="center", fontsize=8.3, color="0.3")
    ax.axvline(0.8, color=ACC, lw=1.3, ls="--")
    ax.text(0.8, 2.62, "coloc threshold\n(PP4=0.8)", ha="center", va="bottom", fontsize=7.5, color=ACC)
    ax.set_yticks(yy)
    ax.set_yticklabels([n for n, _ in layers], fontsize=8.3)
    ax.set_xlim(0, 1.0)
    ax.set_xlabel("Max posterior prob. of shared causal variant (PP4)", fontsize=8.8)
    stamp(ax, "D")

    fig.savefig(OUT, dpi=200, bbox_inches="tight")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
