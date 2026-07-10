# Ambition expansion: two-hit risk model, data scout, and military positioning

*Working brief — generated during the hackathon session. Program facts verified where noted; dollar figures and cohort sizes flagged as unconfirmed.*

## 1. Two-hit mathematical risk model

A literature-parameterized model of P(AD | inherited threshold × environmental trigger). **Not fit to our snRNA data** — it operationalizes the manuscript's trigger-vs-threshold thesis using published effect sizes:
- **Inherited threshold (APOE):** RR vs ε3/ε3 — ε2/ε3 ≈ 0.6, ε3/ε4 ≈ 3.5, ε4/ε4 ≈ 12 (Farrer 1997 *JAMA* meta-analysis, PMID 9343467).
- **Environmental trigger (TBI):** HR vs no-TBI — single mild 2.36, single moderate/severe 3.77 (Barnes 2018 *JAMA Neurol*, PMID 29801145, veterans); repetitive mild 5+ ≈ 2.83 (Fann 2018 *Lancet Psychiatry*, PMID 29653873).
- **Interaction test:** additive vs multiplicative vs super-additive. The mechanism (separable trigger/threshold entering at different circuit points) predicts at least multiplicative combination — matching the APOE×TBI interaction the Million Veteran Program reports in veterans.
- Deliverables: `figure6_twohit_model.png`, `twohit_riskmatrix.csv`, `twohit_strata.csv`.

## 2. Data scout — candidate public datasets to ingest

**Key gap found: the compendium has impact/CCI + repetitive-impact TBI but NO blast TBI — the signature military injury mechanism.**

| Accession | Organism / modality | Access | Why it strengthens the axis |
|---|---|---|---|
| GSE230253 | Mus musculus / single-nucleus RNA-seq | Open (GEO) | Only published single-nucleus blast-TBI atlas of hippocampus — lets us test whether the SPP1/complement/ITGAX microglial 'accelerator' program and the pro-resol |
| GSE207078 | Mus musculus / single-nucleus RNA-seq | Open (GEO) | Second independent blast-TBI snRNA-seq dataset (different region: neurogenic SVZ). Provides cross-region blast replication for the microglial accelerator/brake  |
| GSE209552 | Homo sapiens / single-cell/single-nucleus RNA-seq | Open (GEO) | Human ACUTE TBI at single-cell resolution — the missing acute human timepoint between injury and chronic AD. Enables testing whether the microglial accelerator  |
| GSE104687 | Homo sapiens / bulk RNA-seq (4 regions) | Open (GEO + aging.brain-map.org portal) | Human bulk RNA-seq with documented TBI history AND dementia/AD neuropath in the same aged donors — the single best resource to test the accelerator vs brake bal |
| GSE249918 | Mus musculus / bulk RNA-seq (sorted microglia) | Open (GEO) | Purified-microglia time course lets us resolve WHEN the accelerator peaks and whether the pro-resolving brake (TSG-6/hyaluronan/ANXA1/TGFB1) is transiently or n |
| PMID 41345250 | Mus musculus / bulk RNA-seq (astrocyte-focused, chronic) | Open (accession stated in article; retri | The axis routes microglial SPP1/osteopontin through astrocytic CD44. This chronic astrocyte dataset tests the RECEPTOR arm — whether CD44+ reactive astrocytes p |
| PMID 37875548 | Homo sapiens / GWAS summary statistics | Controlled at individual level (MVP/dbGa | Directly military. Complements the two-hit THRESHOLD arm: whether inherited TBI-liability loci overlap AD-risk loci (APOE/TREM2) vs the trigger-installed effect |
| DOD-ADNI (dbGaP / LONI — repository accession not tool-verified) | Homo sapiens / Clinical cohort (imaging, CSF, genotype, cognition) | Controlled access (LONI/ADNI + DoD data  | The definitive military cohort tying TBI history + APOE genotype + AD biomarker/dementia outcome. Anchors the APOE-stratified ranked-hypothesis deliverable for  |

**Top recommendations:**
- GSE230253 (blast-TBI mouse hippocampus snRNA-seq) — the single highest-value ingest: only published single-nucleus BLAST-TBI atlas, directly closes the military-mechanism gap in the cross-species axis.
- GSE104687 (Allen Aging/Dementia/TBI bulk RNA-seq, GEO n=376) — best resource to quantify the pro-resolving BRAKE deficit (TSG-6/hyaluronan/CD44) in humans with joint TBI history + AD neuropath + APOE.
- GSE209552 (human acute resected TBI single-cell) — supplies the missing acute human timepoint between injury and chronic AD/CTE.
- GSE207078 (blast SVZ snRNA-seq) — second independent blast dataset, cross-region replication toward the '≥3 datasets' pre-specified bar.
- DOD-ADNI + MVP TBI GWAS (PMID 37875548) — controlled-access military cohorts for the APOE-stratified threshold arm; use summary-level tier only.

## 3. Military positioning

**Funding mechanisms (program existence/scope verified; award ceilings NOT confirmed):**
- **Peer Reviewed Alzheimer's Research Program (PRARP), transitioning to the brandin** — U.S. Department of Defense — Congressionally Directed Medical Research Programs . Fit: Our project is almost a purpose-built match. It directly addresses 'understand the mechanism of AD/ADRD, particularly after TBI' by defining a shared microglial inflammatory progra
- **Traumatic Brain Injury and Psychological Health Research Program (TBIPHRP), form** — U.S. Department of Defense — CDMRP, managed by DHA R&D / USAMRDC (same office as. Fit: Fits the mechanistic and biomarker-discovery half of our work: the microglial 'accelerator/brake' circuit is a candidate biological factor for long-term post-TBI outcomes, and our 
- **Long-Term Impact of Military-Relevant Brain Injury Consortium – Chronic Effects ** — DoD + U.S. Department of Veterans Affairs (co-funded) — administered through the. Fit: Not a standing open solicitation but the most important precedent and collaboration target: LIMBIC-CENC already works on veteran outcome/risk models and has the cohorts and public 
- **VA ORD Merit Review awards and MVP-enabled studies on TBI/PTSD × APOE × dementia** — U.S. Department of Veterans Affairs — Office of Research & Development (Biomedic. Fit: These MVP findings are the epidemiological mirror of our molecular thesis and external support for the two-hit model: at population scale in veterans, injury (trigger) and APOE gen
- **TBI-relevant DARPA programs are neurotechnology- and device-oriented — e.g., Res** — Defense Advanced Research Projects Agency (DARPA), Biological Technologies / Def. Fit: Weak-to-indirect fit and we should say so honestly: DARPA does not fund the kind of single-nucleus/genomic risk-mechanism work at the core of this project. Mention only if the proj

**Recommended lead deliverable:**
Lead deliverable: a computable, APOE-aware veteran risk-stratification concept — a signature-based model that combines injury dose (blast / repetitive head impact / TBI severity) with APOE genotype and the shared microglial accelerator-vs-brake module scores to rank individuals by likelihood of injury-accelerated AD/ADRD. This is the highest-resonance output because it (a) mirrors and extends the LIMBIC-CENC prognostic-model and VA/MVP APOE×TBI work that DoD/VA already fund, (b) fits the PRARP Diagnostics/Prognostics focus area directly, and (c) is buildable now on public data as a validated-in-civilian-cohorts prototype explicitly positioned for later validation in veteran cohorts (LIMBIC-CENC / MVP). Package it with the paired biomarker/target rationale (CD44/OPN axis and the TSG-6/CD44 resolution deficit) as a second, mechanism-facing deliverable. Frame both as decision-support and ta

**Manuscript sentences (drop-in, military framing):**
- Traumatic brain injury is an established risk factor for later dementia in service members and veterans, and veteran-cohort studies report that head trauma and PTSD increase the impact of the APOE ε4 variant on Alzheimer's risk — yet the molecular circuit that carries injury forward into Alzheimer's-type neurodegeneration has remained undefined.
- Here we show that TBI and Alzheimer's disease converge on a single microglial inflammatory program — an 'accelerator' (SPP1/osteopontin, complement, TREM2, APOE, ITGAX, GPNMB) engaged without its pro-resolving 'brake' (TSG-6/CD44 resolution machinery) — providing a mechanistic explanation for the epidemiological TBI-to-dementia link that is of direct programmatic interest to military and veteran health research.
- Our two-hit model separates a modifiable injury TRIGGER, which installs downstream effector genes carrying no inherited AD risk, from an inherited THRESHOLD set at APOE and TREM2, offering a genotype-aware framework to identify service members and veterans at greatest risk of injury-accelerated dementia after blast exposure, repetitive head impact, or single moderate-to-severe TBI.
- Because the shared accelerator and the disengaged pro-resolving brake both signal through the receptor CD44, this axis defines a single convergent node and a rationale (not yet validated) for resolution-restoring intervention relevant to both acute military TBI and long-term dementia prevention.
- Built entirely from public data through one harmonized cross-species pipeline and released as a DOI-versioned, openly queryable resource, this work provides an APOE-stratified, injury-dose risk-stratification prototype designed for validation in military and veteran cohorts such as LIMBIC-CENC and the Million Veteran Program.