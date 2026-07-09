
import urllib.request, ssl, gzip, io, csv, time, os
os.chdir('/Users/mickey/.claude-science/orgs/00f151d4-d10c-41b6-a311-2179c2d9ae2e/workspaces/7285df42-75b8-485b-a19e-c4c9da3dd18f')
ctx=ssl.create_default_context()

# 1. fetch hm3 snplist (rsIDs to keep)
hm3_url="https://zenodo.org/records/10515792/files/hm3_no_MHC.list.txt?download=1"
print("fetching hm3 list...",flush=True)
with urllib.request.urlopen(hm3_url,timeout=120,context=ctx) as r:
    hm3=set(l.split()[0] for l in io.TextIOWrapper(r,encoding='utf-8') if l.strip())
print("hm3 SNPs:",len(hm3),flush=True)

# 2. stream Bellenguez full sumstats, keep hm3, write ldsc format (SNP A1 A2 N Z)
url="https://ftp.ebi.ac.uk/pub/databases/gwas/summary_statistics/GCST90027001-GCST90028000/GCST90027158/GCST90027158_buildGRCh38.tsv.gz"
import numpy as np
out=open('bellenguez_ldsc.sumstats','w')
out.write("SNP\tA1\tA2\tN\tZ\n")
t0=time.time(); n=0; kept=0
req=urllib.request.Request(url)
with urllib.request.urlopen(req,timeout=120,context=ctx) as resp:
    gz=gzip.GzipFile(fileobj=resp)
    tr=io.TextIOWrapper(gz,encoding='utf-8')
    header=tr.readline().rstrip('\n').split('\t')
    idx={c:i for i,c in enumerate(header)}
    iS=idx['variant_id']; iEA=idx['effect_allele']; iOA=idx['other_allele']
    iB=idx['beta']; iSE=idx['standard_error']; iNca=idx['n_cases']; iNco=idx['n_controls']
    for line in tr:
        n+=1
        f=line.rstrip('\n').split('\t')
        rs=f[iS]
        if rs not in hm3: continue
        try:
            b=float(f[iB]); se=float(f[iSE])
            if se<=0: continue
            z=b/se
            N=float(f[iNca])+float(f[iNco])
        except: continue
        out.write(f"{rs}\t{f[iEA].upper()}\t{f[iOA].upper()}\t{N:.0f}\t{z:.4f}\n")
        kept+=1
        if n%2000000==0: print(f"  scanned {n/1e6:.0f}M kept {kept} {time.time()-t0:.0f}s",flush=True)
out.close()
print(f"DONE scanned {n} kept {kept} in {time.time()-t0:.0f}s",flush=True)
