"""Shared design tokens for the CSGIA figure set. Import in every panel so color = meaning is
identical across all five figures. See DESIGN_SYSTEM.md for the full spec."""

# Role -> color. Color always means the same biological thing.
PALETTE = {
    "accelerator": "#c0392b",   # deep red  — gas-pedal genes, drives inflammation
    "brake":       "#2980b9",   # blue      — brake/resolution, calms & repairs
    "astrocyte":   "#8e44ad",   # purple    — the second cell
    "genetics":    "#34495e",   # slate     — GWAS / S-LDSC / QTL / inherited risk
    "neutral":     "#7f8c8d",   # grey      — control / null
    "neutral_lt":  "#bdc3c7",   # light grey
    "highlight":   "#e67e22",   # amber     — one call-out per panel max
}
# Sequential ramps for gradients (spatial distance, pseudotime)
CMAP = {"accelerator": "Reds", "brake": "Blues", "genetics": "Greys", "astrocyte": "Purples"}

# Genome-wide-significance line for GWAS panels
GWS_NEGLOG10 = 7.30103  # -log10(5e-8)

# Canonical plain-language labels (use in axis titles / legends)
LABELS = {
    "accelerator": "Accelerator (gas-pedal genes)",
    "brake": "Brake (resolution genes)",
    "NFKB1": "NF\u03baB (the gas pedal)",
    "MEF2C": "MEF2C (the brake pedal)",
    "backbone": "SPI1 / CEBPB (the engine)",
    "CD44": "CD44 (shared docking point)",
}

def triangulation_badge(ax, sources, loc=(0.03, 0.03)):
    """Stamp the systems-biology triangulation badge naming ≥2 independent supports."""
    txt = "\u25c6\u25c6 " + " + ".join(sources)
    ax.text(loc[0], loc[1], txt, transform=ax.transAxes, fontsize=6.2,
            color="#34495e", va="bottom", ha="left",
            bbox=dict(boxstyle="round,pad=0.25", fc="#ecf0f1", ec="#34495e", lw=0.6))

def micro_caption(fig, how, shows, y=-0.02):
    """Two-clause plain-language footer: how the method works / what it shows."""
    fig.text(0.5, y, f"How it works: {how}   What it shows: {shows}",
             ha="center", fontsize=7, color="0.4", wrap=True)


def best_corner(xs, ys, xlim, ylim, frac=0.34):
    import numpy as np
    xs=np.asarray(xs,float); ys=np.asarray(ys,float)
    xlo,xhi=xlim; ylo,yhi=ylim; xw=(xhi-xlo)*frac; yw=(yhi-ylo)*frac
    corners={"upper left":((xlo,xlo+xw),(yhi-yw,yhi)),"upper right":((xhi-xw,xhi),(yhi-yw,yhi)),
             "lower left":((xlo,xlo+xw),(ylo,ylo+yw)),"lower right":((xhi-xw,xhi),(ylo,ylo+yw))}
    counts={k:int(((xs>=a)&(xs<=b)&(ys>=c)&(ys<=d)).sum()) for k,((a,b),(c,d)) in corners.items()}
    return min(counts,key=counts.get),counts
