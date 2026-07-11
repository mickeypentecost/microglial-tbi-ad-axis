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

## 4. Environmental-arm single-nucleus data

The environmental-arm scores in `results/crossarm_convergence.csv` were computed
**during the event**, directly from two public single-nucleus datasets — a simple
per-sample pseudobulk (mean log-CPM, case vs control) on the microglia, with no
reliance on any prior differential-expression analysis:

| Dataset | Accession | Role |
|---------|-----------|------|
| SEA-AD MTG | Allen Institute SEA-AD | human AD snRNA — accelerator installation (84 AD vs 5 control donors) |
| CEREBRI (mouse TBI) | GEO **GSE269748** | mouse TBI snRNA — accelerator installation (26 TBI vs 10 control) |

Robustness checks in `figures/module_validation.png` (coherence-vs-null, NMF
recovery, refined gene set) were computed on the SEA-AD microglia in the same
manner.

## 5. Gene coordinates

- **Source:** Ensembl REST (`rest.ensembl.org`), GRCh38, for all 38 human axis
  genes (`results/axis_targets.csv`). CCL6 is mouse-only (no 1:1 human ortholog)
  and correctly excluded.

---

## Reproducibility notes

- All network fetches target allowlisted public endpoints (EBI, Zenodo, UCSC
  REST, Ensembl REST, GitHub).
- Random seeds fixed where stochastic (MAF-matched permutation seed 0; NMF
  random_state 0; matched-random null seed 0).
- Coordinate builds are explicit throughout (GRCh38 for GWAS/peaks/genes; hg19
  for the 1000G S-LDSC reference).

## Resolution-arm bulk RNA-seq (added: causal/perturbable arm)

- **GSE153873** — human AD hippocampus bulk RNA-seq (12 AD / 10 aged / 8 young). NCBI GEO, open.
  STAR gene-count matrix (`GSE153873_summary_count.star.txt.gz`). Used for resolution-gene
  detection-rescue and module-coherence-vs-null.
- **GSE276182** — mouse sorted astrocyte + microglia bulk RNA-seq ± traumatic brain injury
  (control/EE/KD genotypes). NCBI GEO, open. Gene-count matrix (`GSE276182_gene_count_TBI.txt.gz`).
  Used for the astrocytic CD44-relay injury response (CD44/SPP1/HAS2 up, TSG-6/TNFAIP6 down).

## Spatial + temporal arm (added: spatial convergence)

- **GSE263793** — Mallach 2024 (Cell Reports), mouse App-NL-G-F AD, **Stereo-seq** (BGI) subcellular
  spatial transcriptomics, 18-month section AD_E3 + plaque segmentation mask. NCBI GEO, open.
  Downloaded `*_bin1_max.gem.txt.gz` + `*_PlaqueSegmentation_Binary_Aligned.png.gz`, binned to
  50 µm on Modal ephemeral compute (raw gem too large for local disk). Used for the peri-plaque
  accelerator gradient and brake-exclusion result.
- **GSE319409** — Sullivan et al. 2026 (PMID 41508250), mouse impact TBI (+4-AP treatment arm),
  10x **Visium** CytAssist, 7 days post-injury. NCBI GEO, open. Used the 6 TBI + 6 Sham
  **vehicle-only** sections (no drug confound) for the TBI lesion-niche gradient and TBI-vs-Sham
  module contrast.
- **GSE269748** — CEREBRI mouse TBI single-nucleus RNA-seq time-course (24 h / 7 d / 6 mo),
  TBI vs control. Used for the temporal reading of the resolution brake (acute-transient) — controls
  present at 24 h only, so analyzed as a within-TBI trajectory.
- **GSE203424** — Sierksma/INPP5D APP/PS1 mouse, 10x Visium 55 µm (3 PSAPP + 3 WT untreated).
  NCBI GEO, open. Used for the genotype-contrast Visium panel (accelerator up in amyloid; spatial
  focality genotype-independent — the resolution ceiling that motivated the Stereo-seq step).

## Chronic traumatic encephalopathy (human trauma-tauopathy) validation

- **GSE261807** — Butler et al. 2025 (*Nature* **647**, 228–237; PMID 40963024), repetitive head
  impact and low-stage CTE cortex, single-nucleus RNA-seq (8 control / 9 RHI / 11 CTE donors).
  NCBI GEO, open. Filtered count matrices scored for the accelerator/brake modules in microglia
  and astrocytes (Supplementary Fig. 3d).
- **Emory/Boston University CTE brain proteomics** — Gutierrez-Quiceno et al. 2021
  (*Mol. Neurodegener.* **16**, 40; PMID 34172091), TMT mass-spectrometry of frontal/temporal
  cortex, 43 CTE across McKee stages I–IV + 23 controls (plus other tauopathies). Deposited
  open-access on Synapse (`syn51217209`); we used `EmoryCTE_2xTAMPOR_9152x87_log2(...).csv`
  (protein × sample matrix) and the matched traits table. Reanalysed here for the accelerator
  module dose–response across McKee stage (Fig. 1d forest row; Supplementary Fig. 3e). Brake
  ligands are below the MS detection floor, so only the accelerator arm is tested.
- **GSE155114** — Chancellor/Stein et al., "Altered oligodendroglia and astroglia in CTE",
  human CTE white-matter single-nucleus RNA-seq (8 CTE / 8 control, inDrops). NCBI GEO, open.
  Directionally concordant supporting cohort (microglial accelerator/brake positive but
  underpowered); values in `results/gse155114_cte_snrna_modules.csv`, not shown as a figure.

## Human CSF proteomics across the amyloid–tau continuum (brake-ligand measurement)

The resolution brake ligands TSG-6 (TNFAIP6) and TGFB1 are below the detection floor of
brain-tissue mass spectrometry and single-nucleus RNA; they are reliably quantified only on
affinity proteomic platforms (SomaScan/Olink). Two published CSF SomaScan resources provide the
brake trajectory across ATN stages (Supplementary Fig. 2f,g):

- **Ali et al. 2025** (*Neuron*; PMID 40088886; DOI 10.1016/j.neuron.2025.02.014), multi-cohort
  CSF SomaScan. Supplementary table `mmc2.xlsx`, sheet S1 (per-contrast summary statistics with
  A−T−/A+T−/A+T+ ATN staging). Used the amyloid-onset (A−T− vs A+T−), tau-emergence
  (A+T− vs A+T+) and full-AD contrasts (Discovery estimates) for the axis genes. NOTE: a
  separate 2026 Ali/Cruchaga paper (PMID 41916283, the AD/DLB/FTD/PD differential-abundance
  analysis) is a *different* deposit and is not the ATN-staged source used here.
- **Guo et al. 2024** (*Nat. Hum. Behav.* **8**, 2047–2066; PMID 38987357), PPMI CSF SomaScan.
  Supplementary `MOESM3_ESM.xlsx`, sheet ST4 (per-group protein differences across the ATN
  continuum) — corroborating the TSG-6/TGFB1 amyloid-onset vs tau-emergence directions.

Reanalysed here into `results/csf_tau_emergence_axis.csv` (per-gene estimate/P/FDR at each ATN
contrast) and `results/csf_imbalance_test.csv` (accelerator−brake composite). Both papers are
published; only our computed statistics are stored, no participant-level data.
