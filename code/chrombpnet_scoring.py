"""ChromBPNet allelic scoring — reconstructed bias-free inner model.

The Corces C24 (microglia) ChromBPNet .h5 (Keras 2.4.0) contains a Lambda layer
whose Python-3.6/3.7 marshaled bytecode cannot be unmarshaled under Python 3.11
("bad marshal data"). Solution: the allelic effect is computed on the INNER
ChromBPNet submodel (pure Conv1D/Cropping/Add/Dense, NO Lambda), which outputs
(logits, logcounts) directly. The Lambda only combines model+bias logcounts for
absolute prediction; it is sequence-independent and cancels between alleles.

Validated against Corces' own scored_ADVariants_Ryan.csv (cluster 24):
  |LFC| Pearson r = 0.986, JSD Spearman rho = 1.0 (sign/scale = convention).
"""
import os; os.environ["TF_USE_LEGACY_KERAS"]="1"; os.environ["TF_CPP_MIN_LOG_LEVEL"]="2"
import tensorflow as tf, tf_keras, h5py, json, numpy as np

def load_inner_chrombpnet(h5path):
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

INPUT_LEN=2114; MAP={"A":0,"C":1,"G":2,"T":3}
def onehot(seq):
    x=np.zeros((len(seq),4),dtype=np.float32)
    idx=np.array([MAP.get(b,-1) for b in seq]); v=idx>=0
    x[np.arange(len(seq))[v],idx[v]]=1; return x
def softmax(z): z=z-z.max(-1,keepdims=True); e=np.exp(z); return e/e.sum(-1,keepdims=True)
def jsd(P,Q):
    M=0.5*(P+Q); Pc,Qc,Mc=np.clip(P,1e-12,1),np.clip(Q,1e-12,1),np.clip(M,1e-12,1)
    return 0.5*np.sum(Pc*np.log(Pc/Mc),1)+0.5*np.sum(Qc*np.log(Qc/Mc),1)

# allelic_lfc = log2(pred_counts[effect]/pred_counts[noneffect]); >0 => effect allele opens chromatin
# jsd on softmax(logits) profiles; rank-identical to Corces jsd.
