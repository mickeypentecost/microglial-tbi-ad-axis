"""In silico TF-motif perturbation with the Corces C24 microglia ChromBPNet model.

For each axis enhancer, predict baseline chromatin accessibility (log-count head),
then ablate the discriminating TF motif (NFkB in accelerator enhancers, MEF2 in
protective enhancers) by replacing the strongest motif match with its lowest-affinity
bases, and predict the change in accessibility. Delta<0 => motif ablation is predicted
to CLOSE the enhancer (the motif was holding it open).
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
        grp=mg[layer.name]
        vals=[np.array(grp[w.name.split("/")[-1]]) for w in layer.weights]
        layer.set_weights(vals)
    f.close(); return inner

def revcomp(s): return s[::-1].translate(str.maketrans("ACGT","TGCA"))

def best_motif_hit(seq, pwm):
    """Return (start, strand, score) of strongest PWM match in seq (both strands)."""
    L=len(pwm); best=(-1,'+',-1e9)
    for strand,s in [('+',seq),('-',revcomp(seq))]:
        arr=onehot(s)
        for i in range(len(s)-L):
            sc=float(np.sum(arr[i:i+L]*pwm))
            if sc>best[2]: best=(i,strand,sc)
    return best

def ablate(seq, start, strand, pwm):
    """Replace the matched motif window with the lowest-PWM base at each position."""
    L=len(pwm); s=list(seq if strand=='+' else revcomp(seq))
    worst=[BASES[int(np.argmin(pwm[j]))] for j in range(L)]
    for j in range(L): s[start+j]=worst[j]
    out="".join(s)
    return out if strand=='+' else revcomp(out)

def predict_logcount(inner, seq):
    x=onehot(seq)[None]
    out=inner.predict(x,verbose=0)
    logcount=out[1] if isinstance(out,list) else out
    return float(np.ravel(logcount)[0])

def main():
    tb=py2bit.open("hg38.2bit")
    enh=pd.read_csv("handoff/perturbation_enhancers.csv")
    motifs={k:np.array(v) for k,v in json.load(open("handoff/perturbation_motifs.json")).items()}
    inner=load_inner("corces_bundle/C24_microglia_model.h5")
    disc={'accelerator':'NFKB1','protective':'MEF2C'}
    rows=[]
    for _,r in enh.iterrows():
        ch=r.chrom if str(r.chrom).startswith('chr') else 'chr'+str(r.chrom)
        center=(int(r.start)+int(r.end))//2
        s0=center-INPUT_LEN//2; e0=s0+INPUT_LEN
        try: seq=tb.sequence(ch,s0,e0).upper()
        except Exception: continue
        if len(seq)!=INPUT_LEN or seq.count('N')>200: continue
        tfname=disc[r.arm]; pwm=motifs[tfname]
        base=predict_logcount(inner,seq)
        st,strand,mscore=best_motif_hit(seq,pwm)
        seq_ab=ablate(seq,st,strand,pwm)
        pert=predict_logcount(inner,seq_ab)
        # control: ablate the OTHER arm's motif (specificity check)
        other=motifs['NFKB1' if tfname!='NFKB1' else 'MEF2C']
        st2,str2,_=best_motif_hit(seq,other)
        seq_ctrl=ablate(seq,st2,str2,other)
        pert_ctrl=predict_logcount(inner,seq_ctrl)
        rows.append({'gene':r.gene,'arm':r.arm,'chrom':ch,'center':center,'disc_TF':tfname,
                     'base_logcount':base,'ablated_logcount':pert,'delta':pert-base,
                     'motif_score':mscore,'ctrl_delta':pert_ctrl-base})
    tb.close()
    out=pd.DataFrame(rows)
    out.to_csv("insilico_perturbation.csv",index=False)
    print("scored",len(out),"enhancers")
    for arm in ['accelerator','protective']:
        d=out[out.arm==arm]
        print(f"{arm}: n={len(d)} disc-motif Δlogcount median={d.delta.median():.4f} "
              f"ctrl(other-motif) median={d.ctrl_delta.median():.4f}")
    from scipy.stats import wilcoxon, mannwhitneyu
    for arm in ['accelerator','protective']:
        d=out[out.arm==arm]
        w=wilcoxon(d.delta).pvalue
        ws=wilcoxon(d.delta,d.ctrl_delta).pvalue
        print(f"{arm}: Wilcoxon Δ<0 p={w:.2e}; disc vs ctrl p={ws:.2e}")

if __name__=="__main__": main()
