"""Perturbation of the PERMISSIVE-backbone TFs (CEBPB, SPI1) across BOTH arms.

Tests whether CEBPB/SPI1 ablation closes accelerator AND protective enhancers
(permissive backbone) vs the arm-specific NFkB/MEF2 discriminators.
"""
import os; os.environ["TF_USE_LEGACY_KERAS"]="1"; os.environ["TF_CPP_MIN_LOG_LEVEL"]="2"
import numpy as np, pandas as pd, json, py2bit, h5py, tf_keras
import tensorflow as tf

INPUT_LEN=2114; MAP={"A":0,"C":1,"G":2,"T":3}; BASES="ACGT"
def onehot(seq):
    x=np.zeros((len(seq),4),dtype=np.float32)
    idx=np.array([MAP.get(b,-1) for b in seq]); v=idx>=0
    x[np.arange(len(seq))[v],idx[v]]=1; return x
def load_inner(h5path):
    f=h5py.File(h5path,"r"); cfg=json.loads(f.attrs["model_config"])
    inner_cfg=[l for l in cfg["config"]["layers"] if l["class_name"]=="Functional"][0]["config"]
    inner=tf_keras.Model.from_config(inner_cfg)
    mg=f["model_weights"]["model"]
    for layer in inner.layers:
        if not layer.weights or layer.name not in mg: continue
        grp=mg[layer.name]; layer.set_weights([np.array(grp[w.name.split("/")[-1]]) for w in layer.weights])
    f.close(); return inner
def revcomp(s): return s[::-1].translate(str.maketrans("ACGT","TGCA"))
def best_hit(seq,pwm):
    L=len(pwm); best=(-1,'+',-1e9)
    for strand,s in [('+',seq),('-',revcomp(seq))]:
        arr=onehot(s)
        for i in range(len(s)-L):
            sc=float(np.sum(arr[i:i+L]*pwm))
            if sc>best[2]: best=(i,strand,sc)
    return best
def ablate(seq,start,strand,pwm):
    L=len(pwm); s=list(seq if strand=='+' else revcomp(seq))
    for j in range(L): s[start+j]=BASES[int(np.argmin(pwm[j]))]
    out="".join(s); return out if strand=='+' else revcomp(out)
def logcount(inner,seq):
    out=inner.predict(onehot(seq)[None],verbose=0)
    return float(np.ravel(out[1] if isinstance(out,list) else out)[0])

def main():
    tb=py2bit.open("hg38.2bit")
    enh=pd.read_csv("handoff/perturbation_enhancers.csv")
    motifs={k:np.array(v) for k,v in json.load(open("handoff/perturbation_motifs.json")).items()}
    inner=load_inner("corces_bundle/C24_microglia_model.h5")
    rows=[]
    for _,r in enh.iterrows():
        ch=r.chrom if str(r.chrom).startswith('chr') else 'chr'+str(r.chrom)
        center=(int(r.start)+int(r.end))//2; s0=center-INPUT_LEN//2
        try: seq=tb.sequence(ch,s0,s0+INPUT_LEN).upper()
        except Exception: continue
        if len(seq)!=INPUT_LEN or seq.count('N')>200: continue
        base=logcount(inner,seq); rec={'gene':r.gene,'arm':r.arm,'base':base}
        for tfname in ['CEBPB','SPI1']:
            st,strand,msc=best_hit(seq,motifs[tfname])
            rec[f'{tfname}_delta']=logcount(inner,ablate(seq,st,strand,motifs[tfname]))-base
            rec[f'{tfname}_score']=msc
        rows.append(rec)
    tb.close()
    out=pd.DataFrame(rows); out.to_csv("cebpb_perturbation.csv",index=False)
    from scipy.stats import wilcoxon
    print("scored",len(out))
    for tfname in ['CEBPB','SPI1']:
        print(f"\n=== {tfname} ablation ===")
        for arm in ['accelerator','protective']:
            d=out[out.arm==arm][f'{tfname}_delta']
            print(f"  {arm:12} median Δ={d.median():+.4f} mean={d.mean():+.4f} frac<0={np.mean(d<0):.2f} Wilcoxon_p={wilcoxon(d).pvalue:.2e}")

if __name__=="__main__": main()
