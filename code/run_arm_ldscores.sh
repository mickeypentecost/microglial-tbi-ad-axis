#!/bin/bash
ENV=/Users/mickey/.claude-science/conda/envs/ldsc
export PATH=$ENV/bin:$PATH
PY=$ENV/bin/python
cd /Users/mickey/.claude-science/orgs/00f151d4-d10c-41b6-a311-2179c2d9ae2e/workspaces/7285df42-75b8-485b-a19e-c4c9da3dd18f/ldsc_run
ARM=$1
BED=../sldsc_annot_${ARM}_hg19.bed
OUT=../sldsc/${ARM}; mkdir -p $OUT
PLINK=../ldsc_ref/1000G_EUR_Phase3_plink
for chr in $(seq 1 22); do
  PYTHONPATH=. $PY make_annot.py --bed-file $BED \
    --bimfile $PLINK/1000G.EUR.QC.${chr}.bim \
    --annot-file $OUT/${ARM}.${chr}.annot.gz 2>/dev/null
  PYTHONPATH=. $PY ldsc.py --l2 --bfile $PLINK/1000G.EUR.QC.${chr} \
    --ld-wind-cm 1 --annot $OUT/${ARM}.${chr}.annot.gz --thin-annot \
    --print-snps ../ldsc_ref/printsnps/hm3.${chr}.snplist \
    --out $OUT/${ARM}.${chr} >/dev/null 2>&1
  echo "  $ARM chr${chr}: $(gunzip -c $OUT/${ARM}.${chr}.l2.ldscore.gz|tail -n +2|wc -l|tr -d ' ') SNPs kept"
done
echo "$ARM DONE"
