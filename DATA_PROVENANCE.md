# Data provenance

Every external input, with exact accession/URL, version, retrieval method, and
license. All data are **public**. No controlled-access or individual-level data
are redistributed in this repository; only summary statistics, model weights,
and derived annotations are included or scripted for download.

---

## 1. AD GWAS summary statistics — Bellenguez et al. 2022

- **Accession:** GWAS Catalog `GCST90027158` (PMID **35379992**; Bellenguez C et
  al., *Nature Genetics* 2022, "New insights into the genetic etiology of
  Alzheimer's disease and related dementias").
- **File:** `GCST90027158_buildGRCh38.tsv.gz` (**GRCh38-native**, no liftover of
  sumstats required), 755.2 MB.
- **URL:** `https://ftp.ebi.ac.uk/pub/databases/gwas/summary_statistics/GCST90027001-GCST90028000/GCST90027158/`
- **Cohort:** 39,106 clinically-diagnosed AD cases, European ancestry (stage-1
  discovery used here).
- **Retrieval:** streamed and filtered on the fly (`code/_munge_stream.py`);
  21,101,114 variants scanned → 58,541 in axis cis-windows, 5,637 genome-wide
  significant, 1,200,216 HapMap3 SNPs munged for S-LDSC.
- **License:** GWAS Catalog terms (open; cite the primary study).

## 2. Microglial ChromBPNet models + scATAC peaks — Corces et al. 2020

- **Primary paper:** Corces MR et al., *Nature Genetics* 2020 (PMID **33106633**),
  "Single-cell epigenomic analyses implicate candidate causal variants at
  inherited risk loci for Alzheimer's and Parkinson's diseases."
- **Model weights + peaks:** `github.com/corceslab/variantapp` (the authors' VEP
  platform). Cluster **C24 = Microglia** (mapping confirmed from the app's
  `utils/form.py`; full cluster→cell-type map in `corces_model_provenance.md`).
  - `C24_cbp/model.h5` (76.6 MB), `C24_cbp/biasmodel.h5` (5.1 MB), C24 peak set
    (54,330 unique intervals, GRCh38).
- **Model architecture:** ChromBPNet (bias-corrected BPNet); we score the
  bias-free inner submodel (see `code/chrombpnet_scoring.py`). Validated against
  the authors' published C24 scores: |LFC| Pearson r = 0.986, JSD Spearman ρ = 1.0.
- **License:** repository code under its stated terms; model weights are the
  authors' released research artifacts (cite PMID 33106633).

## 3. S-LDSC reference panel — 1000 Genomes + baseline-LD v2.2

- **Source:** Zenodo record **10515792** (mirror of the Alkes Price group
  LDSCORE reference data; the canonical Broad `data.broadinstitute.org`
  distribution redirects to a bucket path that is not directly fetchable).
- **URL pattern:** `https://zenodo.org/records/10515792/files/<file>?download=1`
- **Files (total ~1.08 GB):**
  - `1000G_Phase3_baselineLD_v2.2_ldscores.tgz` (675.8 MB) — 97-annotation baseline-LD model, GRCh37
  - `1000G_Phase3_plinkfiles.tgz` (288.3 MB) — 1000G EUR genotypes
  - `1000G_Phase3_weights_hm3_no_MHC.tgz` (12.8 MB) — regression weights
  - `1000G_Phase3_frq.tgz` (85.9 MB) — allele frequencies
- **Coordinate note:** baseline-LD is **GRCh37**; our enhancer annotations are
  GRCh38, lifted to hg19 with the UCSC `hg38ToHg19.over.chain.gz` chain
  (0 peaks failed liftover). LD scores computed with `--print-snps` restricted to
  the baseline HapMap3 SNP set so annotation and baseline share identical SNP
  columns.
- **Software:** LD Score Regression, `github.com/bulik/ldsc` (GPL-3.0). The
  original requires Python 2.7; a Python-3 port (2to3 + pandas-2 / bitarray-2
  fixes) is used here and its diffs are reproducible from `code/`.
- **License:** reference data are open research resources; cite Finucane et al.
  2015 (*Nat Genet*) and Gazal et al. 2017.

## 4. Companion single-nucleus + proteomics data (CSGIA arm — referenced, not in this repo)

The environmental-arm scores in `results/crossarm_convergence.csv` derive from
the companion CSGIA analysis over these public datasets:

| Dataset | Accession | Role |
|---------|-----------|------|
| SEA-AD MTG | Allen Institute SEA-AD | human AD snRNA (microglia/astrocyte) |
| Lau et al. | GEO **GSE157827** | human AD snRNA |
| Garza et al. (human TBI) | GEO **GSE209552** | acute human TBI snRNA |
| CEREBRI (mouse TBI) | GEO **GSE269748** | mouse TBI time-course |
| Zhou / 5xFAD | GEO **GSE140511** | mouse AD model |
| Ali et al. fluid proteomics | PMID **41916283** (*Neuron* 2026) | CSF/plasma multi-dementia |

## 5. Gene coordinates

- **Source:** Ensembl REST (`rest.ensembl.org`), GRCh38, for all 38 human axis
  genes (`results/axis_targets.csv`). CCL6 is mouse-only (no 1:1 human ortholog)
  and correctly excluded.

---

## Reproducibility notes

- All network fetches target allowlisted public endpoints (EBI, Zenodo, UCSC
  REST, Ensembl REST, GitHub).
- Random seeds fixed where stochastic (MAF-matched permutation seed 0; NMF
  random_state 0 in the companion arm).
- Coordinate builds are explicit throughout (GRCh38 for GWAS/peaks/genes; hg19
  for the 1000G S-LDSC reference).
