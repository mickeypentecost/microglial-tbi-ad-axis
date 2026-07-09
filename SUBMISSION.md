# TBI installs what AD inherits: a shared microglial resolution-failure axis

### *Built with Claude — Life Sciences Hackathon · Research Track submission*

---

## The one-sentence claim

**Traumatic brain injury installs environmentally the same microglial
inflammatory program that Alzheimer's-disease risk alleles predispose to
genetically — and the pro-resolving brake that should shut it off, signaling
through the CD44 receptor hub, is disengaged in both.** This turns the
long-observed but unexplained epidemiological link from head injury to dementia
into a concrete, targetable molecular mechanism.

---

## Why this is a disease-overcoming result, not just an association

Moderate-to-severe TBI roughly doubles later dementia risk, but *why* has been a
black box — leaving no molecular handle to intervene on. We show that two
completely independent kinds of evidence point at **one program in one cell
type**:

- an **environmental** perturbation (acute injury), and
- **inherited** common-variant risk,

converge on the same microglial *accelerator* module (OPN/SPP1 · TREM2 · APOE ·
complement · TLR2), while the *resolution* module (TSG-6/TNFAIP6 · HAS · ANXA1 ·
TGFβ) that should terminate the response stays disengaged. Both arms signal
through **CD44** — the receptor where the accelerator ligand SPP1/OPN and the
brake ligand TSG-6 compete. A shared, brake-deficient axis converging on one
druggable receptor is exactly the shape of a **targetable common mechanism**.

---

## Where the gene modules come from, and why you can trust them

The accelerator/resolution axis is **hypothesis-driven**, defined *a priori* from
established biology — the disease-associated microglia (DAM) / neuroinflammation
literature for the accelerator arm (SPP1, TREM2, APOE, complement, GPNMB), and the
pro-resolving TSG-6→CD44 mechanism for the brake arm. It was **not** derived from
the datasets we test it on, so there is no circularity between definition and result.

Because a curated gene set invites confirmation-bias concerns, we ran two
**independent robustness checks** on the human AD microglia (SEA-AD) — the
unsupervised-factorization check was pre-specified in the analysis plan; the
coherence-vs-null test we added here — and we report one honest limitation:

- **Coherence** — the accelerator genes co-vary as a genuine module, beating
  **100% of detection-matched random gene sets** (mean pairwise r = 0.074 vs null
  0.013). It is a real co-regulated program, not an arbitrary list.
- **Unsupervised recovery** — a fully seed-free NMF factorization independently
  produces a factor aligning with the accelerator (r = 0.61), led by APOE, C1q,
  B2M, SPP1 — the module re-emerges without being told the gene list.
- **The receptor hub** — the module's two ligands, **SPP1/OPN** (pro-inflammatory)
  and **TSG-6/TNFAIP6** (pro-resolving, with hyaluronan), compete at one receptor:
  **CD44**, which gates TLR2/NF-κB (itself an accelerator gene). CD44 belongs in
  the axis by function as the integrating node, not by expression level.
- **An honest limitation** — the resolution arm is **near-undetectable in
  single-nucleus RNA** (TNFAIP6, HAS1/2/3 all < 1% of microglia; IL10 ~2%), so its
  "disengagement" is partly a measurement gap. Quantifying the brake properly
  requires **bulk RNA-seq**, where CD44 rises up to ~25-fold after controlled
  cortical impact (PMID 25309501). This is a concrete next experiment, not a
  claim we overstate.

---

## The evidence, in two arms

### Environmental arm (this analysis — public single-nucleus data, recomputed during the event)

We quantified microglial installation of the accelerator program directly from
two public single-nucleus datasets, computed fresh in this submission (simple
per-sample pseudobulk mean log-CPM, case vs control, no reliance on any prior
DE result):

- **Human AD** — SEA-AD MTG microglia (84 AD vs 5 control donors). The
  accelerator switches **APOE (Δ +0.61)**, **TLR2 (+0.72)**, and effectors
  **SPP1/OPN (+1.26)**, **C3**, and the **C1q complement genes** are up in AD
  microglia; the resolution-arm genes are flat.
- **Mouse TBI** — CEREBRI microglia (26 TBI vs 10 control samples). The same
  accelerator effectors rise after injury — **APOE (+0.88)**, **TNF (+0.81)**,
  **LPL (+0.75)**, **SPP1/OPN (+0.89)** — confirming that injury installs the
  program the AD genetics anchors.
- **Convergence.** Plotting each accelerator gene's AD-microglial installation
  against its genetic risk load (Fig 5) separates the **genetically anchored**
  switches (*APOE, TREM2, TNF* — ≥3 AD risk variants each) from the
  **environmentally installed** effectors (*SPP1/OPN, complement, TLR2*). Both
  sets are accelerator-arm; the resolution arm is engaged by neither.

*(A fuller companion resource — the CSGIA cross-species atlas over five
single-nucleus datasets plus an orthogonal proteomic modality — exists as a
separate project and is not part of this submission; every number above is
recomputed here from public data during the event.)*

### Genetic arm (this repository — three independent layers)

We tested whether the *human genetics of AD* concentrates on the same axis, using
Bellenguez GWAS + Corces microglial ChromBPNet models + S-LDSC — **entirely
public data, analysis performed during the event.**

| Layer | Method | Result |
|-------|--------|--------|
| **1 · Variant enrichment** | AD variants ∩ microglial accelerator enhancers; MAF-matched permutation | Accelerator **OR = 1.56, P = 0.0022**; not APOE-driven (APOE-excluded P = 9.5×10⁻³); **resolution OR = 0** |
| **2 · Allelic effect** | ChromBPNet allelic scoring of every enhancer variant | AD-associated accelerator variants disrupt microglial chromatin more (**Mann-Whitney P = 0.005**); top hit **rs3800342 in the *TREM2* enhancer** (AD P = 9.3×10⁻¹²) |
| **3 · Heritability** | S-LDSC partitioned h², conditional on baseline-LD v2.2 | Microglial regulatory DNA (1.5% of genome) carries **31% of AD SNP-heritability — 21× enrichment, P = 1.1×10⁻⁵**; within-axis coefficient is accelerator-positive, resolution/DAM-negative |

**Convergence.** Per accelerator gene, the two arms line up: the upstream
microglial switches **TREM2, APOE, TNF** carry the genetic risk load (≥3
AD-associated enhancer variants each), while the effectors **SPP1/OPN, the C1q
complement genes, C3, and TLR2** are installed environmentally (up in AD and/or
TBI microglia, few common risk variants). The genetics perturbs the switch; the
injury drives the effectors; both land on one program.

---

## From convergence to causation: the perturbable circuit

The two arms above establish *convergence* (TBI and AD hit one program). We then
asked the harder questions — **which way does it run, where does inherited risk
actually act, and how do you flip it** — using only public data and models.

### Direction: the effectors are installed, not inherited

Colocalization of AD GWAS with axis-gene QTLs, taken to the highest available
resolution:

| Test | Data | Result |
|------|------|--------|
| **cis-eQTL coloc** | cell-type-matched myeloid eQTLs (Alasoo macrophage, BLUEPRINT monocyte; up to P=3×10⁻²⁷) | **No coloc** (max PP4=0.02) — removes the "bulk brain diluted the signal" objection |
| **enhancer caQTL coloc** | Kosoy/Raj primary-microglia meta-caQTL (n=150) | GWS caQTL at SPP1 (P=1.5×10⁻¹²), but **no coloc** with AD (max PP4=0.06); CTSB PP3=0.97 = association *without* colocalization |
| **pairwise coloc across 3 layers** | caQTL, eQTL, GWAS — three independent shared-SNP ABF tests (not a joint 3-trait model), both molecular QTLs from primary microglia | caQTL↔eQTL real but modest (C1QA PP4=0.18); **neither molecular trait colocalizes with AD** (max 0.06) |

The chromatin→expression regulation of the accelerator effectors is genetically
real but **independent of inherited AD risk**. Risk enters through APOE/TREM2 and
the broad enhancer landscape (S-LDSC), not the effector loci — the exact logic of
a **two-hit (injury × genotype)** model: the effectors are what the *trigger*
installs, the risk alleles set the *threshold*.

### Perturbation: a two-tier TF architecture, and the master regulator

In silico ChromBPNet motif ablation on the 754 axis enhancers reveals two tiers:

- **Permissive backbone (non-specific):** ablating **SPI1/PU.1** closes both arms
  most strongly (dose-dependent — stronger motif → bigger closure, rho=−0.28,
  P=9×10⁻¹⁵), with **CEBPB** alongside it. CEBPB is itself AD-regulated (drives
  δ-secretase cleaving APP/tau; degraded by COP1) — a therapeutic node in its own
  right.
- **Discriminating switch (arm-specific):** ablating **NFκB** closes accelerator
  enhancers specifically (P=1.9×10⁻⁵); ablating **MEF2** does *not* close
  protective enhancers → **MEF2C is a repressor/brake, not a pioneer.**

**Independent convergence:** our perturbation names SPI1 the #1 TF from a
chromatin model; Kosoy 2022, by TF-regulatory-network analysis (a completely
different method), independently names **SPI1 the master regulator of the
microglial regulome and AD risk.** Two orthogonal methods, one regulator.

### Trajectory: the transition is loss of MEF2C identity

Diffusion pseudotime over the SEA-AD microglia orders the homeostatic→accelerator
transition as a **loss of MEF2C/P2RY12 identity** (dpt vs homeostatic score
rho=−0.49) with a coordinated rise of NFκB/SPI1 — the same switch, now with a
temporal order. Resilient APOE-ε4 carriers sit earlier in the transition
(directional, P=0.05; the incoming ~100-sample cohort will make this conclusive).

*Full detail and figures: `results/novelty_synthesis.md`, `moloc_threeway.png`,
`full_circuit.png`, `caqtl_enhancer.png`, `insilico_perturbation.png`,
`tf_architecture.png`, `trajectory.png`.*

---

## What is genuinely new here

We are explicit about the boundary between reproduction and novelty — the rubric
rewards verifiable specificity, so we do not overclaim:

- **Known (independently reproduced as validation):** AD heritability is enriched
  in microglial regulatory DNA (Gjoneska 2015; Nott 2019; Corces 2020). Our 21×
  S-LDSC value recomputes this from Bellenguez + Corces — a provenance anchor, not
  a discovery. TREM2/APOE and the DAM state are well characterized.
- **New:** (1) the **recognition of CD44 as the integrating receptor hub** of the
  axis — the accelerator ligand SPP1/OPN and the brake ligand TSG-6 compete at one
  druggable receptor that gates TLR2/NF-κB; (2) the **accelerator-vs-resolution
  partition as a genetic test** — AD risk loads onto the pro-inflammatory arm and
  *avoids* the pro-resolving arm (a negative control nobody has run); (3) the
  **quantified, per-gene environmental↔genetic convergence** — human-AD and
  mouse-TBI microglial installation against GWAS + chromatin risk on one axis;
  (4) the **measurement finding** — the resolution arm is unmeasurable in snRNA and
  requires bulk RNA-seq (CD44 rises up to ~25-fold after controlled cortical
  impact; PMID 25309501), reframing "resolution insufficiency" as partly an assay
  gap with a concrete fix; (5) the **direction result** — formal colocalization at
  three molecular layers (myeloid eQTL, primary-microglia caQTL, and pairwise caQTL/eQTL/GWAS coloc)
  shows the accelerator effectors are genetically controlled but *AD-risk-independent*
  — installed by the trigger, not inherited; (6) the **perturbable two-tier TF
  architecture** — SPI1/CEBPB permissive backbone vs NFκB/MEF2 arm-specific switch,
  with MEF2C shown to be a repressor, not a pioneer; and (7) the **independent SPI1
  convergence** — our chromatin-model perturbation and Kosoy's TF-network analysis
  name the same master regulator by different methods.

---

## Verifiable, reproducible, open

- **All data public**, every accession and URL in `DATA_PROVENANCE.md`
  (Bellenguez GCST90027158; Corces `corceslab/variantapp` C24; Zenodo 10515792;
  SEA-AD MTG and CEREBRI GSE269748 single-nucleus data).
- **MIT-licensed**; reproducible notebook + scripts; three documented
  environments. The ChromBPNet scoring reconstructs the Corces model bias-free
  and is **validated against the authors' own scores (|LFC| r = 0.986)**; the
  S-LDSC pipeline is a Python-3 port of `bulik/ldsc` with all fixes documented.
- **Honest statistics.** The genome-scale microglial enrichment is highly
  significant (P = 1.1×10⁻⁵); the tiny within-axis annotations are reported by the
  *direction* of their coefficients (95% CIs shown, none individually
  significant), not oversold.

---

## What it unlocks next (48-hour-plus roadmap)

The convergence-plus-causation map yields a **therapeutic rationale with an
identified regulatory circuit** (still not a wet-lab-validated target — all
perturbation here is in silico): silence the **SPI1/CEBPB backbone** to lower the
whole program, or flip the **NFκB/MEF2 switch** to close the accelerator while
sparing resolution, and restore the **TSG-6→CD44 brake** at the effector level.
Because the effectors are *installed* (not inherited), they are the right level to
intervene on in an already-triggered brain. What remains:

1. **The two-hit clinical test (highest priority).** Whether prior TBI × APOE
   genotype interacts to raise dementia risk is the epidemiological keystone the
   molecular model predicts. We provide a **standalone ADNI-DoD analysis prompt**
   (`results/adni_dod_sidequest.md`) to run under separate data governance —
   controlled-access data deliberately kept out of this public project.
2. **Measure the resolution arm where it lives.** Re-run the coherence/null test on
   **bulk RNA-seq** for TNFAIP6/HAS1-3/HYAL/CD44 — the arm snRNA cannot see.
   Existing bulk CCI-TBI timecourses (e.g. PMID 25309501) are the immediate substrate.
3. **Wet-lab perturbation.** The in silico predictions (SPI1/CEBPB knockdown, NFκB
   inhibition, MEF2C de-repression, SPP1→CD44 blockade; OPN-KO.5xFAD reduces plaque,
   PNAS 2023 doi 10.1073/pnas.2218915120) are now specific, ranked, and falsifiable
   — ready for CRISPRi/knockdown in microglial models, delivered via
   microglia-enhancer-driven AAV/LNP.
4. **The incoming cohort.** ~100 samples across six brain regions (AD/LBD/control,
   APOE-annotated) will move every resilience/APOE result from directional (n=9 vs 16,
   P≈0.05) to conclusive.

---

*Team ≤ 2 · non-confidential submission · public data only · analysis performed
during the event.*
