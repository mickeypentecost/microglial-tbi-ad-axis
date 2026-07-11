#!/usr/bin/env python3
"""Auto-adapted build script — regenerates figures/figure5_cd44_hub.png from results/*.csv.
Reads design_tokens.py (same dir) and the intermediate CSVs exported to results/.
Env: ENV 1 (analysis)."""
import os
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE); RES=os.path.join(ROOT,"results")
OUT=os.path.join(HERE,"figure5_cd44_hub.png")
import sys
import os


sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
from design_tokens import PALETTE

import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np
import pandas as pd
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from matplotlib.colors import Normalize
from matplotlib.cm import ScalarMappable

mpl.rcParams.update({"font.size": 9, "axes.spines.top": False, "axes.spines.right": False,
                     "xtick.direction": "out", "ytick.direction": "out", "savefig.dpi": 300,
                     "font.family": "DejaVu Sans"})

def panel_letter(ax, L, dx=-0.16):
    ax.text(dx, 1.04, L, transform=ax.transAxes, fontsize=14, fontweight="bold", va="bottom", ha="right")

ACC = PALETTE["accelerator"]
BRK = PALETTE["brake"]
AST = PALETTE["astrocyte"]
HL = PALETTE["highlight"]
GEN = PALETTE["genetics"]
NEU = PALETTE["neutral"]

hub = pd.read_csv(os.path.join(RES, "f5_hub.csv"))
astro = pd.read_csv(os.path.join(RES, "f5_astro.csv"))

# CD44 cross-modality convergence data
cd44 = pd.DataFrame([
    dict(modality="Sorted astrocyte\nbulk RNA (TBI)", value=1.04, unit="log2FC", p=0.016, source="GSE276182 (this study)"),
    dict(modality="Human AD brain\nprotein", value=0.26, unit="log2FC", p=0.0008, source="PMID 41875888 (recomputed)"),
    dict(modality="Mouse plaque\nprotein", value=0.72, unit="log2FC", p=0.057, source="PMID 39934151 (recomputed)"),
    dict(modality="CEREBRI microglia\nsnRNA (TBI)", value=0.13, unit="Δ log-norm", p=0.0004, source="GSE269748 (this study)"),
])

hd = hub.groupby(["gene", "cell_type"]).agg(mean_logCPM=("mean_logCPM", "mean"), pct=("pct_detect", "mean")).reset_index()

fig = plt.figure(figsize=(16.5, 4.9))
gs = fig.add_gridspec(1, 4, width_ratios=[1.12, 0.95, 1.05, 1.15], wspace=0.52, left=0.05, right=0.99, top=0.90, bottom=0.19)

# (A) dotplot
axA = fig.add_subplot(gs[0])
genes = ["Spp1", "Tlr2", "Cd44", "Anxa1", "Tnfaip6", "Has2"]
cts = ["Microglia", "Astrocyte"]
norm = Normalize(0, max(hd.mean_logCPM.max(), 0.5))
cmap = plt.cm.Reds
for yi, g in enumerate(genes):
    for xi, ct in enumerate(cts):
        row = hd[(hd.gene == g) & (hd.cell_type == ct)]
        if row.empty:
            continue
        axA.scatter(xi, yi, s=max(12, float(row["pct"].iloc[0]) * 3.5), color=cmap(norm(float(row.mean_logCPM.iloc[0]))), edgecolor="0.3", lw=0.5, zorder=3)
axA.set_xticks([0, 1])
axA.set_xticklabels(cts, fontsize=8.5)
axA.set_yticks(range(len(genes)))
axA.set_yticklabels(genes, fontsize=8.5, fontstyle="italic")
axA.set_xlim(-0.6, 1.6)
axA.set_ylim(-0.6, len(genes) - 0.4)
cb = fig.colorbar(ScalarMappable(norm=norm, cmap=cmap), ax=axA, fraction=0.04, pad=0.04)
cb.set_label("mean log CPM", fontsize=7.5)
cb.ax.tick_params(labelsize=7)
axA.text(0.5, -0.16, "dot size = % expressing", transform=axA.transAxes, ha="center", fontsize=7, color="0.4")
panel_letter(axA, "A")

# (B) astrocyte injury bars (from astro csv)
axB = fig.add_subplot(gs[1])
ab = astro.set_index("gene")
inj = ["Spp1", "Cd44", "Has2", "Hmmr", "Tnfaip6"]
lfc = [ab.loc[g, "log2fc"] for g in inj]
pv = [ab.loc[g, "p"] for g in inj]
cols = [ACC if l > 0 else BRK for l in lfc]
axB.barh(range(len(inj)), lfc, color=cols, edgecolor="white", height=0.6)
axB.set_yticks(range(len(inj)))
axB.set_yticklabels(inj, fontsize=8.5, fontstyle="italic")
axB.axvline(0, color="0.4", lw=0.9)
axB.set_xlabel("log2 FC (injury vs. control),\nsorted astrocytes", fontsize=8.3)
for i, (l, p) in enumerate(zip(lfc, pv)):
    sig = "**" if p < 0.01 else ("*" if p < 0.05 else "")
    if sig:
        axB.text(l + (0.04 if l > 0 else -0.04), i, sig, va="center", ha="left" if l > 0 else "right", fontsize=9, color="0.2")
panel_letter(axB, "B", dx=-0.2)

# (C) CD44 cross-modality convergence
axC = fig.add_subplot(gs[2])
mcolors = [AST, GEN, ACC, BRK]
yb = np.arange(len(cd44))[::-1]
axC.barh(yb, cd44["value"], color=mcolors, edgecolor="0.3", lw=0.6, height=0.62)
axC.set_yticks(yb)
axC.set_yticklabels(cd44["modality"], fontsize=7.6)
axC.axvline(0, color="0.4", lw=0.9)
axC.set_xlabel("CD44 up in disease/injury\n(log2FC or Δ)", fontsize=8.3)
for yi, (v, p) in zip(yb, zip(cd44["value"], cd44["p"])):
    sig = "**" if p < 0.01 else ("*" if p < 0.05 else "†")
    axC.text(v + 0.03, yi, sig, va="center", ha="left", fontsize=9, color="0.2")
axC.set_xlim(0, 1.25)
panel_letter(axC, "C", dx=-0.34)

# (D) conclusion schematic
axD = fig.add_subplot(gs[3])
axD.set_xlim(0, 10)
axD.set_ylim(0, 10)
axD.axis("off")
axD.text(5, 9.7, "one receptor, opposing inputs", fontsize=11.0, fontweight="bold", color="0.25", ha="center", va="top")
axD.add_patch(plt.Circle((5, 5), 1.5, fc="#f4ecf7", ec=AST, lw=2.6, zorder=3))
axD.text(5, 5, "CD44", fontsize=15, fontweight="bold", color=AST, ha="center", va="center", zorder=4)
axD.add_patch(FancyBboxPatch((0.7, 7.5), 8.6, 1.6, boxstyle="round,pad=0.1", fc="#fdecea", ec=ACC, lw=2.0))
axD.text(5, 8.3, "$\\it{SPP1}$ ↑↑ · hyaluronan ↑", fontsize=10.5, fontweight="bold", ha="center", va="center", color=ACC)
axD.text(5, 7.75, "(accelerator)", fontsize=8.8, ha="center", va="center", color=ACC)
axD.add_patch(FancyArrowPatch((5, 7.45), (5, 6.6), arrowstyle="-|>", color=ACC, lw=2.4, mutation_scale=17, zorder=2))
axD.text(6.35, 7.02, "pushed", fontsize=9.0, ha="left", va="center", color=ACC, style="italic")
axD.add_patch(FancyBboxPatch((0.7, 0.9), 8.6, 1.6, boxstyle="round,pad=0.1", fc="#eaf2f8", ec=BRK, lw=2.0))
axD.text(5, 1.7, r"$\it{TSG\text{-}6}$ ↓", fontsize=10.5, fontweight="bold", ha="center", va="center", color=BRK)
axD.text(5, 1.15, "(brake fails)", fontsize=8.8, ha="center", va="center", color=BRK)
axD.add_patch(FancyArrowPatch((5, 2.55), (5, 3.4), arrowstyle="-[", color=BRK, lw=2.4, mutation_scale=15, zorder=2))
axD.text(6.35, 2.98, "never released", fontsize=9.0, ha="left", va="center", color=BRK, style="italic")
panel_letter(axD, "D", dx=-0.03)

fig.savefig(OUT, bbox_inches="tight")
plt.close(fig)