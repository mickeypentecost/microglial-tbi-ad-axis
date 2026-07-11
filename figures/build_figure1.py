#!/usr/bin/env python3
"""Auto-adapted build script — regenerates figures/figure1_convergence.png from results/*.csv.
Reads design_tokens.py (same dir) and the intermediate CSVs exported to results/.
Env: ENV 1 (analysis)."""
import os
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE); RES=os.path.join(ROOT,"results")
OUT=os.path.join(HERE,"figure1_convergence.png")
import matplotlib.pyplot as plt, matplotlib as mpl, numpy as np, pandas as pd, json, sys, os


sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
from design_tokens import PALETTE

mpl.rcParams.update({"font.size":9,"axes.spines.top":False,"axes.spines.right":False,"xtick.direction":"out","ytick.direction":"out","savefig.dpi":300,"font.family":"DejaVu Sans"})
from matplotlib.lines import Line2D
from matplotlib.patches import Patch, FancyBboxPatch, FancyArrowPatch
def panel_letter(ax,L,dx=-0.14): ax.text(dx,1.05,L,transform=ax.transAxes,fontsize=13,fontweight="bold",va="bottom",ha="right")
ACC=PALETTE["accelerator"]; BRK=PALETTE["brake"]; GEN=PALETTE["genetics"]; NEU=PALETTE["neutral"]; HL=PALETTE["highlight"]

ca=pd.read_csv(os.path.join(RES, "crossarm_convergence.csv"))
sl=pd.read_csv(os.path.join(RES, "f1_sldsc.csv"))
fo=pd.read_csv(os.path.join(RES, "f1_forest.csv"))
coh=json.load(open(os.path.join(RES, "f1_coherence.json")))

fig=plt.figure(figsize=(15.8,8.2))
gs=fig.add_gridspec(2,4,hspace=0.36,wspace=0.40,left=0.05,right=0.985,top=0.94,bottom=0.09,width_ratios=[1.05,0.82,0.92,1.05])
# (A) pipeline — BIGGER box text (8.8 -> 10.5)
axA=fig.add_subplot(gs[:,0]); axA.set_xlim(0,10); axA.set_ylim(0,10); axA.axis("off")
steps=[("single-cell\n& bulk RNA","#eaf2f8",GEN),("score the\naccelerator","#fdecea",ACC),("test across\ndatasets","#eafaf1","#27ae60"),("map onto\nAD genetics","#ecf0f1",GEN)]; ys=[8.6,6.2,3.8,1.4]
for (lab,fcc,ec),y in zip(steps,ys):
    axA.add_patch(FancyBboxPatch((1.9,y-0.82),6.2,1.64,boxstyle="round,pad=0.08",fc=fcc,ec=ec,lw=1.8)); axA.text(5,y,lab,fontsize=10.5,ha="center",va="center",color="0.2")
for y0,y1 in zip(ys[:-1],ys[1:]): axA.add_patch(FancyArrowPatch((5,y0-0.84),(5,y1+0.84),arrowstyle="-|>",color="0.4",lw=1.5,mutation_scale=13))
panel_letter(axA,"A",dx=-0.05)
# (B) recovery
axB=fig.add_subplot(gs[0,1]); x=np.arange(2); w=0.36
axB.bar(x-w/2,[coh["accel_coh"],coh["resol_coh"]],w,color=[ACC,BRK],edgecolor="k",lw=0.6,zorder=3); axB.bar(x+w/2,[coh["accel_null"],coh["resol_null"]],w,color=NEU,edgecolor="k",lw=0.6,alpha=0.55,zorder=3)
axB.set_xticks(x); axB.set_xticklabels(["Accel.","Resol."],fontsize=8); axB.set_ylabel("gene–gene co-activity"); axB.set_ylim(0,0.09); axB.text(0,coh["accel_coh"]+0.003,"p<0.01",ha="center",fontsize=7,color=ACC)
axB.legend([Patch(fc=NEU,alpha=0.55,ec="k"),Patch(fc=ACC,ec="k"),Patch(fc=BRK,ec="k")],["null","accel.","resol."],frameon=False,fontsize=6.2,loc="upper right"); panel_letter(axB,"B")
# (C) convergence
axC=fig.add_subplot(gs[0,2]); d=ca.dropna(subset=["AD_lfc","TBI_lfc"]).copy(); axC.axhline(0,color="0.8",lw=0.7); axC.axvline(0,color="0.8",lw=0.7); bu=(d.AD_lfc>0)&(d.TBI_lfc>0)
axC.scatter(d.AD_lfc[bu],d.TBI_lfc[bu],s=34,c=ACC,edgecolor="k",lw=0.4,zorder=3); axC.scatter(d.AD_lfc[~bu],d.TBI_lfc[~bu],s=28,c=NEU,edgecolor="k",lw=0.4,alpha=0.7,zorder=3)
for _,r in d.iterrows():
    if r.gene in ["SPP1","APOE","TLR2","TNF","TREM2"]: axC.annotate(r.gene,(r.AD_lfc,r.TBI_lfc),fontsize=6.2,fontstyle="italic",xytext=(3,2),textcoords="offset points")
axC.set_xlabel("Δ in Alzheimer's (logFC)"); axC.set_ylabel("Δ in brain injury (logFC)")
axC.legend([Line2D([],[],marker="o",ls="",mfc=ACC,mec="k",ms=6),Line2D([],[],marker="o",ls="",mfc=NEU,mec="k",ms=6)],["up in both","other"],frameon=False,fontsize=6.4,loc="lower right"); panel_letter(axC,"C")
# (D) forest
axD=fig.add_subplot(gs[1,1]); fo=fo.sort_values("d")
for i,r in enumerate(fo.itertuples()):
    col=ACC if r.d>0 else NEU; axD.plot([r.lo,r.hi],[i,i],color=col,lw=2,zorder=2); axD.scatter([r.d],[i],s=48,color=col,edgecolor="k",lw=0.6,zorder=3)
axD.axvline(0,color="0.5",lw=0.9,ls="--"); axD.set_yticks(np.arange(len(fo))); axD.set_yticklabels([r.dataset.split(' (')[0] for r in fo.itertuples()],fontsize=7.0); axD.set_xlabel("effect size (Cohen's d)"); axD.set_ylim(-0.6,len(fo)-0.4); panel_letter(axD,"D")
# (E) S-LDSC
axE=fig.add_subplot(gs[1,2]); row=sl[sl.annotation=="all_microglia"].iloc[0]; ps=row.prop_snps*100; ph=row.prop_h2*100
bars=axE.bar([0,1],[ps,ph],width=0.5,color=[NEU,GEN],edgecolor="k",lw=0.6,zorder=3); axE.set_xticks([0,1]); axE.set_xticklabels(["% of\ngenome","% of\nAD risk"],fontsize=7.6); axE.set_ylabel("Percent"); axE.set_ylim(0,42)
for b,v in zip(bars,[ps,ph]): axE.text(b.get_x()+b.get_width()/2,v+1.0,f"{v:.1f}%",ha="center",fontsize=9,fontweight="bold")
axE.text(0.5,38,"p=1×10⁻⁵",ha="center",fontsize=7.2,color=GEN); panel_letter(axE,"E")
# (F) conclusion — TALL right column, TOP -> BOTTOM flow, generous spacing
axF=fig.add_subplot(gs[:,3]); axF.set_xlim(0,10); axF.set_ylim(0,10); axF.axis("off")
axF.text(5,9.7,"three independent lines of evidence",fontsize=9.8,fontweight="bold",color="0.25",ha="center",va="top")
srcs=[("recovered blindly\n(co-activity beats null)",8.4,ACC),
      ("up in BOTH\nAlzheimer's & injury",6.4,"#27ae60"),
      ("31% of inherited\nAD risk in its DNA",4.4,GEN)]
for lab,yc,col in srcs:
    axF.add_patch(FancyBboxPatch((1.05,yc-0.72),7.9,1.44,boxstyle="round,pad=0.1",fc="white",ec=col,lw=1.9)); axF.text(5,yc,lab,fontsize=9.4,ha="center",va="center",color="0.2")
    axF.add_patch(FancyArrowPatch((5,yc-0.74),(5,yc-1.42),arrowstyle="-|>",color=col,lw=1.6,mutation_scale=13))
# program box at BOTTOM — tighter box, gene list wrapped to 3 even lines of 5, larger text
axF.add_patch(FancyBboxPatch((1.0,0.7),8.0,2.3,boxstyle="round,pad=0.12",fc="#fef5e7",ec=HL,lw=2.5))
axF.text(5,2.58,"the accelerator program",fontsize=11.0,fontweight="bold",color="#9c640c",ha="center",va="center")
_g1="$\\it{SPP1}$·$\\it{APOE}$·$\\it{TREM2}$·$\\it{TYROBP}$·$\\it{C1q}$"
_g2="$\\it{C3}$·$\\it{ITGAX}$·$\\it{GPNMB}$·$\\it{CST7}$·$\\it{LPL}$"
_g3="$\\it{TLR2}$·$\\it{CD68}$·$\\it{B2M}$·$\\it{IL1B}$·$\\it{TNF}$"
axF.text(5,1.55,_g1+"\n"+_g2+"\n"+_g3,fontsize=8.6,ha="center",va="center",color="0.2",linespacing=1.6)
panel_letter(axF,"F",dx=-0.05)
fig.savefig(OUT,dpi=200,bbox_inches="tight"); plt.close(fig)
print("Fig1: A step-box text 8.8→10.5, boxes widened; F evidence-box text 7.8→9.4, program title 9.6→10.8, gene list 6.8→8.0.")