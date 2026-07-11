#!/usr/bin/env python3
"""Auto-adapted build script — regenerates figures/figure2_space_time.png from results/*.csv.
Reads design_tokens.py (same dir) and the intermediate CSVs exported to results/.
Env: ENV 1 (analysis)."""
import os
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE); RES=os.path.join(ROOT,"results")
OUT=os.path.join(HERE,"figure2_space_time.png")
import matplotlib.pyplot as plt, matplotlib as mpl, numpy as np, pandas as pd, sys
sys.path.insert(0, ".")
import importlib.util, os

# Load design_tokens from artifact
spec = importlib.util.spec_from_file_location("design_tokens", os.path.join(HERE, "design_tokens.py"))
design_tokens = importlib.util.module_from_spec(spec)
spec.loader.exec_module(design_tokens)
PALETTE = design_tokens.PALETTE

mpl.rcParams.update({"font.size":9,"axes.spines.top":False,"axes.spines.right":False,"savefig.dpi":300,"font.family":"DejaVu Sans"})
ACC=PALETTE["accelerator"]
ad=pd.read_csv(os.path.join(RES, "ad_tissue_spots.csv"))
tbi=pd.read_csv(os.path.join(RES, "f4_tbi_tissue.csv"))
adg=pd.read_csv(os.path.join(RES, "f4_ad_grad.csv"))
tbg=pd.read_csv(os.path.join(RES, "f4_tbi_grad.csv"))
def pl(ax,L,dx=-0.09,dy=1.02): ax.text(dx,dy,L,transform=ax.transAxes,fontsize=15,fontweight="bold",va="bottom",ha="right")
def cbar(ax,sc,lab=None):
    cb=fig.colorbar(sc,ax=ax,fraction=0.038,pad=0.012)
    if lab: cb.set_label(lab,fontsize=7.5)
    cb.ax.tick_params(labelsize=6.5); return cb
fig=plt.figure(figsize=(15.0,8.2))
gs=fig.add_gridspec(2,3,width_ratios=[1,1,1.05],height_ratios=[1,1],hspace=0.34,wspace=0.34,left=0.05,right=0.975,top=0.95,bottom=0.10)
# ROW 1 AD — A anchor East (toward B), B anchor West (toward A): pairs the maps, opens B|C gap
axA=fig.add_subplot(gs[0,0]); prox=np.clip(ad.dist_to_plaque.values,0,2000); o2=np.argsort(-prox)
sa=axA.scatter(ad.x.values[o2],ad.y.values[o2],c=prox[o2],s=3.0,cmap="viridis_r",lw=0,rasterized=True)
onp=ad[ad.on_plaque==1]; axA.scatter(onp.x,onp.y,s=6,facecolors="none",edgecolors="#e74c3c",lw=0.35,rasterized=True)
axA.set_aspect("equal"); axA.set_anchor("E"); axA.invert_yaxis(); axA.set_xticks([]); axA.set_yticks([]); cbar(axA,sa,"dist. to plaque (µm)"); axA.set_xlabel("AD — plaque location (red = on-plaque)",fontsize=8.5); pl(axA,"A")
axB=fig.add_subplot(gs[0,1]); o=np.argsort(ad.accel.values)
sb=axB.scatter(ad.x.values[o],ad.y.values[o],c=ad.accel.values[o],s=3.0,cmap="magma",vmin=-0.4,vmax=1.0,lw=0,rasterized=True)
axB.set_aspect("equal"); axB.set_anchor("W"); axB.invert_yaxis(); axB.set_xticks([]); axB.set_yticks([]); cbar(axB,sb); axB.set_xlabel("AD — accelerator score",fontsize=8.5); pl(axB,"B")
axC=fig.add_subplot(gs[0,2]); axC.plot(range(len(adg)),adg.accel,"-o",color=ACC,lw=2,ms=5.5); axC.axvspan(-0.5,0.5,color=ACC,alpha=0.10)
axC.set_xticks(range(len(adg))); axC.set_xticklabels(adg.dband,rotation=45,ha="right",fontsize=7); axC.set_ylabel("accelerator score",fontsize=8.5); axC.set_xlabel("distance from plaque (µm)",fontsize=8.5); pl(axC,"C",dx=-0.20)
# ROW 2 TBI — D anchor East (toward E), E anchor West (toward D)
axD=fig.add_subplot(gs[1,0]); inj=np.clip(tbi.injury.values,-0.3,1.5); o4=np.argsort(inj)
sd=axD.scatter(tbi.x.values[o4],tbi.y.values[o4],c=inj[o4],s=8,cmap="cividis",lw=0,rasterized=True)
axD.set_aspect("equal"); axD.set_anchor("E"); axD.invert_yaxis(); axD.set_xticks([]); axD.set_yticks([]); cbar(axD,sd,"injury signature"); axD.set_xlabel("TBI — lesion (tissue-damage markers)",fontsize=8.5); pl(axD,"D")
axE=fig.add_subplot(gs[1,1]); o3=np.argsort(tbi.accel.values)
se=axE.scatter(tbi.x.values[o3],tbi.y.values[o3],c=tbi.accel.values[o3],s=8,cmap="magma",vmin=-0.4,vmax=1.0,lw=0,rasterized=True)
axE.set_aspect("equal"); axE.set_anchor("W"); axE.invert_yaxis(); axE.set_xticks([]); axE.set_yticks([]); cbar(axE,se); axE.set_xlabel("TBI — accelerator score",fontsize=8.5); pl(axE,"E")
axF=fig.add_subplot(gs[1,2]); axF.plot(range(len(tbg)),tbg.accel,"-o",color=ACC,lw=2,ms=5.5); axF.axvspan(-0.5,0.5,color=ACC,alpha=0.10); axF.axhline(0,color="0.6",lw=0.8)
axF.set_xticks(range(len(tbg))); axF.set_xticklabels(tbg.injq,rotation=45,ha="right",fontsize=7); axF.set_ylabel("accelerator score",fontsize=8.5); axF.set_xlabel("distance from lesion",fontsize=8.5); pl(axF,"F",dx=-0.20)
fig.savefig(OUT,dpi=175,bbox_inches="tight"); plt.close(fig)