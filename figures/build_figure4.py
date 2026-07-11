#!/usr/bin/env python3
"""Auto-adapted build script — regenerates figures/figure4_switch.png from results/*.csv.
Reads design_tokens.py (same dir) and the intermediate CSVs exported to results/.
Env: ENV 1 (analysis)."""
import os
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE); RES=os.path.join(ROOT,"results")
OUT=os.path.join(HERE,"figure4_switch.png")
import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np
import pandas as pd
import json
import sys

mpl.rcParams.update({"font.size":9,"axes.spines.top":False,"axes.spines.right":False,"xtick.direction":"out","ytick.direction":"out","savefig.dpi":300,"font.family":"DejaVu Sans"})

from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle, Patch

def panel_letter(ax, L, dx=-0.16):
    ax.text(dx, 1.04, L, transform=ax.transAxes, fontsize=14, fontweight="bold", va="bottom", ha="right")

cp = pd.read_csv(os.path.join(RES, "f2_cebpb.csv"))
tr = pd.read_csv(os.path.join(RES, "trajectory_drivers.csv"))
st = json.load(open(os.path.join(RES, "f2_stats.json")))

ACC = "#c0392b"
BRK = "#2980b9"
GEN = "#34495e"
NEU = "#7f8c8d"
HL  = "#e67e22"

fig = plt.figure(figsize=(14.2, 9.0))
# B and C same width now; A a bit wider, E spans row1 cols1-2
gs = fig.add_gridspec(2, 3, height_ratios=[1, 1], width_ratios=[1.25, 1.0, 1.0],
                      hspace=0.34, wspace=0.34, left=0.06, right=0.975, top=0.94, bottom=0.09)

# (A)
axA = fig.add_subplot(gs[0, 0])
axA.set_xlim(0, 10); axA.set_ylim(0, 10); axA.axis("off")
xx = np.linspace(1, 9, 200)
peak = 6.2 + 2.1 * np.exp(-((xx - 5)**2) / 2.2)
axA.plot(xx, peak, color=GEN, lw=1.6)
axA.fill_between(xx, 6.2, peak, color=GEN, alpha=0.12)
axA.text(5, 8.9, "microglial enhancer (open chromatin / ATAC peak)", fontsize=7.6, ha="center", color=GEN)
axA.plot([1, 9], [4.6, 4.6], color="0.3", lw=2)
axA.text(0.7, 4.6, "DNA", fontsize=7.5, ha="right", va="center", color="0.3")
for name, mx, col in [("SPI1", 2.4, GEN), ("NF\u03baB", 4.4, ACC), ("MEF2C", 6.2, BRK), ("CEBPB", 7.8, GEN)]:
    axA.add_patch(Rectangle((mx - 0.5, 4.35), 1.0, 0.5, fc=col, ec="k", lw=0.5, zorder=3))
    axA.text(mx, 3.7, name, fontsize=7, ha="center", color=col, fontweight="bold")
axA.text(5, 2.4,
         "an AI model reads this DNA and predicts the peak;\nwe delete one motif at a time to see the peak close",
         fontsize=7, ha="center", color="0.3", style="italic")
panel_letter(axA, "A", dx=-0.05)

# (B)
axB = fig.add_subplot(gs[0, 1])
groups = ["NF\u03baB", "MEF2C", "SPI1", "CEBPB"]
x = np.arange(4); w = 0.38
ae = [st["nfkb_mean"], np.nan, st["spi1_acc"], st["cebpb_acc"]]
pe = [np.nan, st["mef2_mean"], st["spi1_prot"], st["cebpb_prot"]]
axB.bar(x - w/2, [a if not np.isnan(a) else 0 for a in ae], w, color=ACC, edgecolor="k", lw=0.5, zorder=3)
axB.bar(x + w/2, [p if not np.isnan(p) else 0 for p in pe], w, color=BRK, edgecolor="k", lw=0.5, zorder=3)
axB.axhline(0, color="k", lw=0.7)
axB.set_xticks(x); axB.set_xticklabels(groups, fontsize=8.5)
axB.set_ylabel("accessibility change when factor removed")
axB.set_ylim(-0.32, 0.055)
axB.text(0, 0.028, "p = 1.9×10⁻⁵", ha="center", va="bottom", fontsize=7, color=ACC)
axB.legend([Patch(fc=ACC, ec="k"), Patch(fc=BRK, ec="k")],
           ["accelerator switches", "resolution switches"],
           frameon=False, fontsize=6.6, loc="lower left")
panel_letter(axB, "B")

# (C) same width as B
axC = fig.add_subplot(gs[0, 2])
sp = cp.dropna(subset=["SPI1_score", "SPI1_delta"])
axC.scatter(sp.SPI1_score, sp.SPI1_delta, s=8, c=GEN, alpha=0.32, edgecolor="none", zorder=2)
bins = np.linspace(sp.SPI1_score.min(), sp.SPI1_score.max(), 9)
bc = (bins[:-1] + bins[1:]) / 2
med = [sp.SPI1_delta[(sp.SPI1_score >= bins[i]) & (sp.SPI1_score < bins[i+1])].median() for i in range(8)]
axC.plot(bc, med, "-o", color=HL, lw=2, ms=5, zorder=4, label="binned median")
axC.axhline(0, color="0.7", lw=0.7)
axC.set_xlabel("SPI1/PU.1 motif strength")
axC.set_ylabel("accessibility change when SPI1 removed")
axC.text(0.03, 0.06, "\u03c1 = -0.28\np = 9×10⁻¹⁵", transform=axC.transAxes, fontsize=7.6, color=HL, va="bottom")
axC.legend(frameon=False, fontsize=7, loc="upper right")
panel_letter(axC, "C")

# (D)
axD = fig.add_subplot(gs[1, 0])
trs = tr.sort_values("rho_vs_pseudotime")
cols = [BRK if g in ["MEF2C", "P2RY12", "TMEM119"] else (ACC if r > 0 else NEU)
        for g, r in zip(trs.gene, trs.rho_vs_pseudotime)]
axD.barh(np.arange(len(trs)), trs.rho_vs_pseudotime, color=cols, edgecolor="k", lw=0.4, zorder=3)
axD.set_yticks(np.arange(len(trs)))
axD.set_yticklabels([f"$\\it{{{g}}}$" for g in trs.gene], fontsize=7.2)
axD.axvline(0, color="k", lw=0.7)
axD.set_xlabel("correlation with disease progression")
axD.legend([Patch(fc=ACC, ec="k"), Patch(fc=BRK, ec="k"), Patch(fc=NEU, ec="k")],
           ["accelerator", "resolution/resting", "other"],
           frameon=False, fontsize=6.4, loc="upper left", bbox_to_anchor=(0.02, 0.32))
panel_letter(axD, "D")

# (E)
axE = fig.add_subplot(gs[1, 1:])
axE.set_xlim(0, 10); axE.set_ylim(0, 10); axE.axis("off")
axE.add_patch(FancyBboxPatch((3.0, 7.0), 4.0, 1.9, boxstyle="round,pad=0.1", fc="#ecf0f1", ec=GEN, lw=2))
axE.text(5, 7.95, "SPI1 / CEBPB", fontsize=11, fontweight="bold", color=GEN, ha="center", va="center")
axE.text(5, 7.35, "required identity factors", fontsize=8, style="italic", color="0.35", ha="center", va="center")
axE.add_patch(FancyBboxPatch((2.0, 3.9), 2.9, 2.0, boxstyle="round,pad=0.1", fc="#fdecea", ec=ACC, lw=2))
axE.text(3.45, 5.2, "NF\u03baB", fontsize=11, fontweight="bold", color=ACC, ha="center")
axE.text(3.45, 4.5, "activator", fontsize=8, style="italic", color="0.35", ha="center")
axE.add_patch(FancyBboxPatch((5.1, 3.9), 2.9, 2.0, boxstyle="round,pad=0.1", fc="#eaf2f8", ec=BRK, lw=2))
axE.text(6.55, 5.2, "MEF2C", fontsize=11, fontweight="bold", color=BRK, ha="center")
axE.text(6.55, 4.5, "repressor", fontsize=8, style="italic", color="0.35", ha="center")
axE.add_patch(FancyBboxPatch((3.0, 1.0), 4.0, 1.6, boxstyle="round,pad=0.1", fc="#fef5e7", ec=HL, lw=1.8))
axE.text(5, 1.8, "accelerator program", fontsize=10.5, fontweight="bold", color="#9c640c", ha="center", va="center")
axE.add_patch(FancyArrowPatch((3.45, 3.85), (4.4, 2.65), arrowstyle="-|>", color=ACC, lw=1.8, mutation_scale=15))
axE.add_patch(FancyArrowPatch((6.55, 3.85), (5.6, 2.65), arrowstyle="|-|,widthA=0,widthB=6", color=BRK, lw=1.8, mutation_scale=1))
axE.add_patch(FancyArrowPatch((5, 6.95), (5, 5.95), arrowstyle="-|>", color=GEN, lw=1.6, mutation_scale=14))
panel_letter(axE, "E", dx=-0.03)

fig.savefig(OUT, dpi=200, bbox_inches="tight")
plt.close(fig)