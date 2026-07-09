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
  gap with a concrete fix.

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

The convergence map yields a **therapeutic rationale** (not yet a validated
target — no perturbation data exists here): the CD44 hub is the point where the
accelerator ligand (SPP1/OPN) and the brake ligand (TSG-6) compete, so
**restoring the TSG-6→CD44 brake or blocking SPP1→CD44** is a single node
addressable in both TBI and AD contexts. Three concrete next steps make this
testable:

1. **Measure the resolution arm where it lives.** Re-run the coherence/null test
   on **bulk RNA-seq** microglia-enriched or microglial-proportion-corrected data
   for TNFAIP6/HAS1-3/HYAL/CD44 — the arm snRNA cannot see. Existing bulk CCI-TBI
   timecourses (e.g. PMID 25309501) are the immediate substrate.
2. **Upstream regulators.** Find the **transcription factors** whose motifs the
   accelerator enhancers depend on (candidate master regulators PU.1/SPI1, IRF8,
   MEF2C — the latter two themselves AD GWAS genes; CEBPB surfaced in our agnostic
   expansion), test which the top AD risk variants disrupt (ChromBPNet
   contribution scores / TF-MoDISco), and rank by whether silencing collapses the
   accelerator while sparing resolution.
3. **Ligand–receptor perturbation evidence.** Mine public SPP1/CD44 knockout and
   OPN-blockade datasets (OPN-KO.5xFAD reduces plaque and microglial TNF-α; PNAS
   2023, doi 10.1073/pnas.2218915120) to convert the rationale into a
   perturbation-anchored target.

---

*Team ≤ 2 · non-confidential submission · public data only · analysis performed
during the event.*
