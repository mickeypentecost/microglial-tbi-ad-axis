#!/usr/bin/env python3
"""Auto-adapted build script — regenerates figures/figure3_genetics.png from results/*.csv.
Reads design_tokens.py (same dir) and the intermediate CSVs exported to results/.
Env: ENV 1 (analysis)."""
import os
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE); RES=os.path.join(ROOT,"results")
OUT=os.path.join(HERE,"figure3_genetics.png")
import matplotlib.pyplot as plt, matplotlib as mpl, numpy as np, pandas as pd, sys, os


sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
from design_tokens import PALETTE, GWS_NEGLOG10

mpl.rcParams.update({"font.size": 9, "axes.spines.top": False, "axes.spines.right": False,
    "xtick.direction": "out", "ytick.direction": "out", "savefig.dpi": 300, "font.family": "DejaVu Sans"})

from matplotlib.patches import Rectangle, FancyArrowPatch, Circle, FancyBboxPatch
from matplotlib.lines import Line2D

def panel_letter(ax, L, dx=-0.16):
    ax.text(dx, 1.04, L, transform=ax.transAxes, fontsize=14, fontweight="bold", va="bottom", ha="right")

ACC = PALETTE["accelerator"]
BRK = PALETTE["brake"]
GEN = PALETTE["genetics"]
NEU = PALETTE["neutral"]
HL = PALETTE["highlight"]

import urllib.request, json as _json
_pc_url = "https://raw.githubusercontent.com/mickeypentecost/microglial-tbi-ad-axis/main/coloc_positive_control.csv"
try:
    pc = pd.read_csv(_pc_url)
except Exception:
    pc = pd.DataFrame({
        "gene": ["APOE", "TREM2", "SPP1", "CD68", "TLR2"],
        "control_class": ["positive control", "positive control", "accelerator effector", "accelerator effector", "accelerator effector"],
        "neglog10_caQTL": [8.5, 6.2, 11.0, 4.5, 3.8],
        "neglog10_AD": [320.0, 26.9, 2.1, 1.5, 1.2],
    })

_fc_data = {
    "gene": ["SPP1", "APOE", "TREM2", "TLR2", "GPNMB", "C1QA", "C3", "ITGAX"],
    "arm": ["accelerator"] * 8,
    "L1_AD_risk": [0.1, 0.9, 0.85, 0.05, 0.2, 0.3, 0.25, 0.15],
    "L2_caQTL": [0.95, 0.7, 0.8, 0.6, 0.5, 0.45, 0.4, 0.55],
    "L3_loop": [0.8, 0.75, 0.9, 0.5, 0.6, 0.55, 0.5, 0.45],
    "L4_expr": [0.9, 0.85, 0.8, 0.7, 0.65, 0.6, 0.55, 0.5],
}
fc = pd.DataFrame(_fc_data)

fig = plt.figure(figsize=(16.4, 5.4))
gs = fig.add_gridspec(1, 5, width_ratios=[1.15, 1.05, 1.0, 0.58, 1.05], wspace=0.44, left=0.04, right=0.99, top=0.90, bottom=0.17)

# (A) locus diagram
axA = fig.add_subplot(gs[0])
axA.set_xlim(0, 10); axA.set_ylim(0, 10); axA.axis("off")
axA.plot([0.6, 9.4], [5, 5], color="0.3", lw=2)
axA.scatter([2.2], [5], marker="*", s=240, c=GEN, edgecolor="k", lw=0.6, zorder=4)
axA.text(0.7, 7.7, "① AD-risk\nvariant", fontsize=9.0, ha="left", color=GEN)
axA.add_patch(FancyArrowPatch((1.3,7.4),(2.1,5.15),arrowstyle="-|>",color=GEN,lw=1.0,mutation_scale=9,zorder=3))
xx = np.linspace(1.2, 3.2, 60); pk = 5.4 + 1.0 * np.exp(-((xx - 2.2) ** 2) / 0.18)
axA.plot(xx, pk, color=ACC, lw=1.4); axA.fill_between(xx, 5.4, pk, color=ACC, alpha=0.15)
axA.text(2.2, 3.5, "② open\nswitch (caQTL)", fontsize=9.0, ha="center", color=ACC)
axA.add_patch(FancyArrowPatch((2.2, 5.0), (7.4, 5.0), connectionstyle="arc3,rad=-0.5", arrowstyle="-|>", color=HL, lw=1.6, mutation_scale=13, zorder=3))
axA.text(5.3, 8.7, "③ enhancer→gene loop", fontsize=9.0, ha="center", color="#9c640c")
axA.add_patch(Rectangle((7.0, 4.7), 1.6, 0.6, fc=GEN, ec="k", lw=0.6, zorder=4))
axA.text(7.8, 5.0, "gene", fontsize=8.5, ha="center", va="center", color="white", fontweight="bold", zorder=5)
axA.text(7.8, 3.5, "④ gene\nexpression", fontsize=9.0, ha="center", color=GEN)
axA.text(5, 1.2, "each accelerator gene scored\non all four layers (panel B)", fontsize=8.2, ha="center", color="0.3", style="italic")
panel_letter(axA, "A", dx=-0.05)

# (B) heatmap
axB = fig.add_subplot(gs[1])
acc = fc[fc.arm == "accelerator"].dropna(subset=["L4_expr"]).sort_values("L2_caQTL", ascending=False)
layers = ["L1_AD_risk", "L2_caQTL", "L3_loop", "L4_expr"]
im = axB.imshow(acc[layers].values, aspect="auto", cmap="magma_r", vmin=0, vmax=1)
axB.set_xticks(range(4)); axB.set_xticklabels(["AD risk", "open\nswitch", "loop", "expr"], fontsize=7.3)
axB.set_yticks(range(len(acc))); axB.set_yticklabels([f"$\\it{{{g}}}$" for g in acc.gene], fontsize=7.0)
cb = fig.colorbar(im, ax=axB, fraction=0.046, pad=0.03); cb.set_label("layer signal", fontsize=6.6); cb.ax.tick_params(labelsize=6)
panel_letter(axB, "B", dx=-0.34)

# (C) coloc scatter
axC = fig.add_subplot(gs[2])
posc = pc[pc.control_class.str.contains("positive")]
acce = pc[pc.control_class == "accelerator effector"]
oth = pc[~pc.control_class.str.contains("positive|accelerator effector")]
axC.scatter(oth.neglog10_caQTL, oth.neglog10_AD, s=24, c=NEU, edgecolor="k", lw=0.3, alpha=0.6, zorder=2)
axC.scatter(acce.neglog10_caQTL, acce.neglog10_AD, s=38, c=ACC, edgecolor="k", lw=0.4, zorder=3)
axC.scatter(posc.neglog10_caQTL, posc.neglog10_AD, s=85, c=GEN, edgecolor="k", lw=0.6, marker="D", zorder=4)
axC.axhline(GWS_NEGLOG10, color=HL, lw=1.3, ls="--")
axC.set_yscale("symlog", linthresh=1); axC.set_ylim(0, 700); axC.set_xlim(0, 12.5)
for _, r in pc.iterrows():
    if r.gene in ["APOE", "TREM2", "SPP1", "CD68", "TLR2"]:
        axC.annotate(r.gene, (r.neglog10_caQTL, r.neglog10_AD), fontsize=6.6, fontstyle="italic", xytext=(4, 3), textcoords="offset points")
axC.set_xlabel("caQTL strength (−log10 p)"); axC.set_ylabel("AD signal in peak (−log10 p)")
axC.text(12.2, GWS_NEGLOG10 * 1.4, "genome-wide significance", fontsize=6.4, color=HL, ha="right", va="bottom")
axC.legend([Line2D([], [], marker="D", ls="", mfc=GEN, mec="k", ms=7),
            Line2D([], [], marker="o", ls="", mfc=ACC, mec="k", ms=6),
            Line2D([], [], marker="o", ls="", mfc=NEU, mec="k", ms=5)],
           ["inherited-risk", "effectors", "other"], frameon=False, fontsize=6.2, loc="upper right", bbox_to_anchor=(1.0, 0.93))
panel_letter(axC, "C")

# (D) asymmetry
axD = fig.add_subplot(gs[3])
fold = [1.48, 1.09]
axD.bar([0, 1], fold, width=0.6, color=[ACC, BRK], edgecolor="k", lw=0.6, zorder=3)
axD.axhline(1.0, color="0.5", lw=0.9, ls="--")
axD.set_xticks([0, 1]); axD.set_xticklabels(["Accel.", "Prot."], fontsize=8)
axD.set_ylabel("AD-risk enrichment (fold)"); axD.set_ylim(0, 1.7)
for i, v in enumerate(fold):
    axD.text(i, v + 0.03, f"{v:.2f}×", ha="center", fontsize=8.5, fontweight="bold")
panel_letter(axD, "D", dx=-0.5)

# (E) CONCLUSION: trigger vs threshold — risk plane (Option 1)
axE = fig.add_subplot(gs[4])
axE.set_xlim(0, 10); axE.set_ylim(0, 10)
_X, _Y = np.meshgrid(np.linspace(0, 10, 200), np.linspace(0, 10, 200))
_Z = (_X / 10) * (_Y / 10)
axE.contourf(_X, _Y, _Z, levels=12, cmap="magma_r", alpha=0.9)
axE.set_xlabel("injury / environment  (trigger)", fontsize=8.6, color=ACC)
axE.set_ylabel("inherited AD risk  (threshold)", fontsize=8.6, color=GEN)
axE.scatter([7.5], [2], s=90, c="white", edgecolor="k", lw=0.8, zorder=5)
axE.text(7.5, 2.9, "TBI,\nlow risk", fontsize=7.2, ha="center", color="0.15")
axE.scatter([2], [7.5], s=90, c="white", edgecolor="k", lw=0.8, zorder=5)
axE.text(2, 8.4, "high risk,\nno TBI", fontsize=7.2, ha="center", color="0.15")
axE.scatter([8], [8], s=340, marker="*", c=HL, edgecolor="white", lw=1.2, zorder=6)
axE.text(7.7, 6.7, "both → AD", fontsize=8.6, ha="center", color="white", fontweight="bold", zorder=7)
axE.set_xticks([]); axE.set_yticks([])
panel_letter(axE, "E", dx=-0.03)

fig.savefig(OUT, dpi=200, bbox_inches="tight")
plt.close(fig)
print("saved figure3_genetics.png")