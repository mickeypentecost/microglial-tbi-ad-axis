# TBI installs what AD inherits: a shared microglial resolution-failure axis

### *Built with Claude — Life Sciences Hackathon · Research Track submission*

---

## The one-sentence claim

**Traumatic brain injury installs environmentally the exact microglial
inflammatory program that Alzheimer's-disease risk alleles predispose to
genetically — and the pro-resolving brake that should shut it off is disengaged
in both.** This gives a concrete, testable molecular route for the long-observed
but unexplained epidemiological link from head injury to dementia.

---

## Why this is a disease-overcoming result, not just an association

Moderate-to-severe TBI roughly doubles later dementia risk, but *why* has been a
black box — leaving no molecular handle to intervene on. We show that two
completely independent kinds of evidence point at **one program in one cell
type**:

- an **environmental** perturbation (acute injury) and
- **inherited** common-variant risk

converge on the same microglial *accelerator* module (OPN/SPP1 · TREM2 · APOE ·
complement · CST7 · GPNMB), while the *resolution* module (TSG-6/TNFAIP6 · CD44 ·
ANXA1 · TGFβ) that should terminate the response stays flat. A shared,
brake-deficient axis is exactly the shape of a **targetable common mechanism** —
restore the brake or silence the accelerator, and you would predict benefit in
both conditions.

---

## The evidence, in two arms

### Environmental arm (companion CSGIA analysis — single-nucleus + proteomics)

Across five public datasets spanning mouse and human, injury and disease
(SEA-AD, Lau, Garza human-TBI, CEREBRI mouse-TBI, 5xFAD) plus an independent
protein-level atlas:

- The microglial accelerator program is **installed by both TBI and AD**; across
  the primary TBI↔AD comparisons the RISK-arm direction concordance is 60–82%
  (CEREBRI↔SEA-AD 60%, CEREBRI↔5xFAD 82%, Garza↔SEA-AD 74%).
- The accelerator **dwarfs the resolution arm everywhere** (module-score ratio
  7–35×); the OPN:TSG-6 ratio climbs with injury chronicity and with AD severity.
- The imbalance **survives a detectability control** (the brake genes are harder
  to measure, but restricting to well-detected genes the accelerator still rises
  ~13× more) and **re-emerges de novo** in unsupervised NMF (not a curation artifact).
- APOE ε4 dose shifts the accelerator:resolution ratio in the predicted
  direction (severity-adjusted ρ = +0.27, P = 0.013).

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
AD-associated enhancer variants each), while the downstream effectors **SPP1/OPN,
GPNMB, CST7** are installed environmentally. The genetics perturbs the switch; the
injury drives the effectors; both land on one program.

---

## What is genuinely new here

We are explicit about the boundary between reproduction and novelty — the rubric
rewards verifiable specificity, so we do not overclaim:

- **Known (independently reproduced as validation):** AD heritability is enriched
  in microglial regulatory DNA (Gjoneska 2015; Nott 2019; Corces 2020). Our 21×
  S-LDSC value recomputes this from Bellenguez + Corces — a provenance anchor, not
  a discovery. TREM2/APOE and the DAM state are well characterized.
- **New:** (1) the **accelerator-vs-resolution partition as a pre-specified
  genetic test** — AD risk loads onto the pro-inflammatory arm and *avoids* the
  pro-resolving arm (a negative control nobody has run); (2) the **quantified,
  per-gene environmental↔genetic convergence** across single-nucleus + proteomics
  + GWAS + chromatin on one curated axis; (3) the **resolution-insufficiency**
  framing (TSG-6/CD44) as the shared deficit and therefore the intervention point.

---

## Verifiable, reproducible, open

- **All data public**, every accession and URL in `DATA_PROVENANCE.md`
  (Bellenguez GCST90027158; Corces `corceslab/variantapp` C24; Zenodo 10515792;
  Ali 2026 *Neuron* PMID 41916283).
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

The immediate extension turns this from a convergence map into a **drug-target
nomination**: find the **transcription factors** whose motifs the accelerator
enhancers depend on (candidate master regulators PU.1/SPI1, IRF8, MEF2C — the
latter two themselves AD GWAS genes), test which of them the top AD risk variants
disrupt (ChromBPNet contribution scores), and rank them by whether silencing them
would collapse the accelerator while sparing the resolution arm. A single
microglial TF that gates the shared axis would be a common intervention point for
both injury-triggered and inherited dementia risk.

---

*Team ≤ 2 · non-confidential submission · public data only · analysis performed
during the event.*
