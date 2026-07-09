# Spatial transcriptomics data inventory — TBI↔AD microglia/CD44 niche

## The two named accessions

**GSE263793 — Mallach 2024 (Cell Reports), "Microglia–astrocyte cross-talk in the amyloid
plaque niche"** — DIRECT HIT for our mechanism.
- Platform: **Stereo-seq** (BGI, subcellular) + CosMx subseries (GSE263789/GSE263791 are the subs).
- 18-month App-NL-G-F AD mouse vs WT; **plaque-segmentation masks included** (peri-plaque distance
  analysis ready out-of-the-box).
- Tests exactly our asserted-but-unshown claim: accelerator microglia + CD44+ astrocytes physically
  adjacent at plaques.
- Heavy: 30 GB RAW tar, ~1 GB/section gem.txt + 4.5 GB barcodeToPos.h5/section. Open access.

**GSE174367 — Morabito & Swarup 2021 (Nat Genet), human AD snMultiome (snRNA + snATAC), 191,890 nuclei.**
- NOT spatial — it is a single-nucleus multiome. Value: an independent human microglial
  enhancer/regulatory resource (candidate replication for the caQTL/ChromBPNet enhancer arm), not a
  niche dataset. Open access.

## Spatial sets found (GEO search)

### Mouse AD (amyloid niche)
- **GSE263793** (above) — Stereo-seq, plaque masks. **Top pick for AD niche.**
- **GSE327147** — MERFISH, 7 mouse brains with Aβ pathology.
- **GSE209583** — Visium, WT / 5XFAD / 5XFAD+treatment (n=14) — lighter, treatment arm.
- **GSE253570** — disease-associated cell states, spatial distribution (n=12).
- **GSE203424** — INPP5D / plaque / glial reactivity, APP/PS1 Visium (n=12).
- **GSE275026** — plaque-induced microglia reprogramming (n=8).

### Human AD
- **GSE233208** — human snRNA + spatial AD characterization (n=185). Check platform + access
  (may include controlled-access components).
- Karaahmet et al. (bioRxiv 2024.11.13.623438) human Visium — **CONTROLLED ACCESS** (AD Knowledge
  Portal DUC + ROSMAP neuritic-plaque self-sign; see governance note below). Do NOT ingest here.

### Mouse TBI (the convergence side)
- **GSE226211 / GSE226208 — "Shared inflammatory glial cell signature after brain injury"** — the
  single most on-thesis TBI spatial set; a shared glial signature is exactly our convergence claim.
- **GSE313407** — Adult mouse controlled cortical impact (CCI) Visium (n=34). Clean TBI Visium.
- **GSE319409** — secondary response to TBI, spatial (n=24).
- **GSE282909** — cell-type-specific transcriptomic reorganization after injury (n=16).
- **GSE236171** — spatiotemporal microglia activation trajectory after injury (n=4).
- **GSE214349** — haematoma-stimulated circuits, secondary brain injury (n=19).

## Prior spatial work on hand (user's Google Drive: spatial_AD_analysis/)

A substantial prior spatial analysis already exists (2026-05, separate Colab project):
- **Mouse (run_20260507): GSE263793 fully processed** — 5 Stereo-seq + 2 CosMx samples, bin50 +
  cell-bin (Cellpose 391k cells) pipelines, AUCell state gating, squidpy neighborhood enrichment,
  1000-shuffle perm tests. Headline: a **CD11c+_DAM gate** validated across all 5 sections (E3/E4
  independent 18M AD animals replicate at perm z=+27.3/+33.6; AD-vs-WT ~100×; age-progressive);
  peri-plaque CD44+ astrocyte shell replicated cross-platform on CosMx; the two populations
  spatially segregate (squidpy z=−5). 8-page exec deck exists.
- **Human (run_human_20260509): BLOCKED** — Karaahmet human Visium is behind AD-KP DUC
  (controlled). Discovery done, downloads 403. Never ingested.

### ⚠️ Governance note (critical for hackathon standalone requirement)
Two separate walls apply to the Drive material:
1. **This prior spatial analysis is a PRIOR ANALYSIS** — under the user's stated rule
   ("reuse data, not prior analyses"), the Drive notebooks/results/gates cannot be reused as
   analysis. The underlying PUBLIC data (GSE263793 etc.) can be re-pulled and re-analyzed fresh.
2. **The Karaahmet human Visium is CONTROLLED ACCESS** (AD Knowledge Portal DUC) — must not enter
   this public project at all, in any form.

## TBI spatial datasets — the convergence half (added after user-supplied refs)

The AD half of "TBI installs what AD inherits" now has spatial support (Visium GSE203424 +
Stereo-seq GSE263793). The TBI half had none until these. All are mouse, genome-wide spatial.

- **GSE319409 — Sullivan 2026, Acta Neuropathol Commun (PMID 41508250, DOI 10.1186/s40478-025-02219-1).**
  Non-penetrating impact TBI, Visium, days 1-7, +4-AP treatment arm (n=24). Explicitly reports TBI
  induces **"disease-associated glial phenotypes"** mapped predominantly to the **corpus callosum**;
  immune/vascular pathways up, myelination down. **Best convergence partner** — clean impact TBI,
  named DAG program, defined compartment, Visium (method-matched to our AD Visium arm).
- **GSE282909 — Swaro 2025, Cell Reports (PMID 40478731, DOI 10.1016/j.celrep.2025.115795).**
  CHIMERA mild diffuse TBI, Visium, subacute (Ciernia lab, UBC). Generalizable cross-region TBI
  signatures + cell-type-specific dysregulation, incl. **astrocyte susceptibility** (dentate molecular
  layer) — hooks our astrocytic CD44-relay arm. Strong second (cross-region generalizability).
- **OmicGlaze — Li et al., bioRxiv 2026 (preprint; user-supplied URL biorxiv.org/content/10.64898/2026.03.30.715462v1 — DOI not verified via CrossRef, prefix does not match bioRxiv's usual 10.1101).** Spatial MULTI-omics of mouse
  mild TBI: spatial transcriptome + **first spatial ATAC-seq (epigenome) map of TBI** near single-cell
  resolution. Names **ATF3 (AP-1 family TF)** as key regulator of injury-induced cellular stress.
  PREPRINT + heavier ATAC processing, but the highest-ambition option: its spatial ATAC is the TBI
  analog of our AD regulatory arm (Corces enhancers / Kosoy caQTL / SPI1-CEBPB-NFκB architecture).

### The ATF3/AP-1 cross-injury TF hypothesis (novel, testable)
Our AD axis TF architecture = SPI1/CEBPB (permissive backbone) + NFκB/MEF2 (arm-specific switch).
OmicGlaze names ATF3/AP-1 as the TBI injury-stress regulator. AP-1 (Jun/Fos/ATF) is a canonical
partner of PU.1/SPI1 and NFκB at myeloid enhancers. Hypothesis: **TBI (via ATF3/AP-1) and AD (via
SPI1/CEBPB/NFκB) converge on overlapping microglial accelerator enhancers through different upstream
TFs** — injury and inheritance routing through shared regulatory grammar. Testable against our
existing Corces C24 / Kosoy caQTL enhancer set + (ambitious) OmicGlaze spatial ATAC.

### Convergence-test design note
AD niche is organized around PLAQUES (focal amyloid landmark); TBI niche around the LESION / white-
matter tract (no plaques). Right test = same PROGRAM + same ARCHITECTURE around a different injury
landmark: does accelerator/DAM concentrate at the TBI lesion as it does near plaques, and does the
CD44-astrocyte response form a peri-lesional shell as it forms a peri-plaque shell? Landmark-agnostic
but architecture-conserved = the novel spatial statement of convergence.
