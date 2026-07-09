# The causal / perturbable upgrade — novelty synthesis

This session extended the microglial TBI→AD axis from a **convergence map** (TBI and AD look
alike) to a **causal, directional, perturbable model** (here is the switch, which way it runs,
and how to flip it). Three new analytical arms, each from public data or models in hand.

![synthesis]({{artifact:art_ee419b7f-ee2c-4c8b-a402-14d7b50e3b55}})

---

## What is now established, and how novel each piece is

### Tier 1 — CONVERGENCE (prior work this project; confirmatory of the field)
- Microglia are the AD-heritability cell type (S-LDSC 21×, 31% h²); TBI and AD engage the same
  SPP1/complement/DAM accelerator program. **Known in the field — we reproduced it independently.**

### Tier 2 — CAUSATION / DIRECTION (NEW this session)
1. **The accelerator effectors are environmentally installed, not inherited cis-drivers.**
   Tested first with bulk-brain + macrophage eQTLs, then closed with **cell-type-matched myeloid
   eQTLs** (Alasoo macrophage, BLUEPRINT monocyte; up to p=3×10⁻²⁷) for the 5 axis eGenes with
   myeloid coverage — SPP1 (accelerator) + ATP8B4, P2RY12, MKNK1, LPCAT2 (protective). **No
   colocalization** with AD GWAS in any (max PP4=0.02); GPNMB had no myeloid eQTL and is untested.
   The reason is unambiguous: strong eQTLs, but **no genome-wide AD signal in these windows**. The
   cell-type-matched result removes the "bulk brain diluted the microglial signal" objection —
   even the strongest myeloid eQTLs do not colocalize. Genetic risk lives in the microglial
   enhancer *landscape* (S-LDSC), not single-gene eQTLs. **Novel framing:** it separates the
   *trigger-installed effectors* from the *inherited susceptibility* — the logic of a two-hit
   (TBI + genotype) model. *Caveat:* true enhancer-level caQTL coloc (Kosoy/Raj microglia
   regulome) is the remaining test; the eQTL Catalogue serves no caQTL.
2. **The genetic asymmetry** (established earlier this session): AD risk loads the accelerator
   arm (1.48×) and spares the protective/homeostatic arm (1.09×, n.s.). **Novel** — nobody had a
   protective gene set to test against, so the head-to-head had never been run.

### Tier 2.5 — THE FULL MICROGLIAL CIRCUIT (NEW this session)
5. **We wired the entire variant→program circuit in one cell type, empirically.** Using the open
   Kosoy microglia regulome, each arrow is now a *measured* link, not an assumption:
   **AD variant → microglial caQTL (chromatin) → ABC/Hi-C enhancer–promoter loop → axis-gene
   expression (our snRNA).** The layered circuit (per accelerator gene) shows the effector/driver
   split directly: SPP1 lights up caQTL + expression but not AD-risk; APOE lights up AD-risk. This
   is a level of GWAS-to-function grounding — variant to program, in the exact cell type,
   cross-layer — that most convergence papers do not reach.
6. **SPI1/PU.1 is the convergent master regulator — two orthogonal methods agree.** Our ChromBPNet
   motif-ablation names SPI1 the #1 TF by effect (dose-dependent: stronger PU.1 motif → bigger
   accessibility loss, rho=−0.28, p=9×10⁻¹⁵; closes both arms = permissive backbone). Kosoy 2022,
   by an entirely different method (TF regulatory-network analysis), independently names **SPI1 the
   key master regulator of the microglial regulome and AD risk.** Arriving at the same master
   regulator from chromatin-model perturbation and from network genetics is strong, independent
   triangulation. **Novel** — the convergence was not engineered; we found SPI1 before checking
   theirs.

### Tier 3 — PERTURBATION / MECHANISM (NEW this session)
3. **In silico ChromBPNet perturbation — a two-tier TF architecture.** We ablated four TF motifs
   and found two functionally distinct tiers:
   - **Discriminating switch (arm-specific):** ablating **NFκB** closes accelerator enhancers
     (Wilcoxon p=1.9×10⁻⁵; specific vs MEF2 control p=0.009). Ablating **MEF2** does *not* close
     protective enhancers → **MEF2C acts as a repressor/brake of the accelerator, not a pioneer
     holding homeostatic chromatin open.**
   - **Permissive backbone (non-specific):** ablating **CEBPB** closes *both* arms (accelerator
     p=1.6×10⁻⁸, protective p=1.8×10⁻⁷) and ablating **SPI1/PU.1** closes both most strongly of
     all (p up to 10⁻³¹). Normalized arm-specificity cleanly separates the tiers (switch NFκB 1.6 /
     MEF2 2.0 vs backbone SPI1/CEBPB ≈0.35).

   **CEBPB is the standout backbone factor and itself AD-regulated:** it is upregulated in AD
   microglia and drives δ-secretase (AEP/LGMN, which cleaves APP and tau); the E3 ligase COP1/RFWD2
   degrades C/EBPβ to restrain microglial neuroinflammation. So it is a therapeutic node even
   though it does not discriminate arms — a complementary strategy to flipping the NFκB switch.
   **Novel mechanistic refinement** (MEF2 = repressor; two-tier grammar) and a falsifiable,
   wet-lab-testable set of predictions.
4. **Trajectory:** the homeostatic→accelerator transition is fundamentally a **loss of MEF2C/
   P2RY12 identity** (dpt vs homeostatic score rho=−0.49) with a coordinated **rise of NFκB and
   SPI1** — the same NFκB the perturbation model flags as the accelerator's activator, riding on
   the SPI1/CEBPB backbone the perturbation identifies as permissive. Resilient ε4 carriers sit
   earlier in the transition (p=0.051). **Novel** — ties the switch to a temporal order and
   independently corroborates the perturbation arm (two methods, one NFκB).

---

## Do we now know HOW TBI increases AD risk?

**A specific, mechanistic hypothesis — much sharper than convergence, but not yet proven in
humans.** The model the three arms support:

> TBI acutely **installs** the accelerator program (an environmental trigger — SPP1/GPNMB are
> environmentally driven, not genetic). In a brain whose microglial enhancer landscape already
> carries AD risk alleles, the program is easier to install and the **MEF2C brake is
> insufficient** to repress it. NFκB sustains the accelerator enhancers; homeostatic identity
> (MEF2C/P2RY12) is lost; the SPP1/tau-tracking program persists → accelerated neurodegeneration.

**Genetics sets the threshold; TBI provides the trigger; both converge on one NFκB-driven,
MEF2C-repressible microglial switch.** The unproven link is **persistence in humans** — our
mouse data (CEREBRI) shows the injury program partly *resolves* by 6 months, so whether TBI
installs a *durable* accelerator state in humans is the open question (see gaps).

---

## Drug-target rationale (rationale, NOT validated targets) — and how to hit the right cells

| Target | Action | Why | Cell-type delivery |
|--------|--------|-----|--------------------|
| **NFκB** | inhibit | perturbation predicts NFκB ablation shuts accelerator enhancers; NFκB rises along the transition | microglial-enhancer-driven, to avoid systemic immunosuppression |
| **SPP1 / CD44 hub** | neutralize ligand / antagonize receptor | CD44 integrates SPP1 (pro-inflammatory) vs TSG-6 (pro-resolving) and gates TLR2/NFκB; OPN-KO cuts 5xFAD plaque 40–60% | microglia + astrocytic CD44 relay |
| **MEF2C** | de-repress / restore | MEF2C is the brake; IFN-I suppresses it, so cGAS-STING/IFN-I inhibition would de-repress it | microglia specifically |
| **CEBPB / C/EBPβ** | lower / degrade | permissive backbone required by both arms; AD-regulated, drives δ-secretase (APP/tau cleavage); COP1/RFWD2 normally degrades it | microglia; dials down the whole enhancer landscape (broader than the NFκB switch) |

**The cell-type-targeting contribution is concrete:** our enhancer-level work provides the
**microglial cis-regulatory elements** (BED peaks, ChromBPNet-validated as microglia-active) that
could drive **AAV/LNP payloads restricted to microglia** — so the recommendation is not just
"target SPP1" but "target it with a microglial-enhancer-driven construct." That closes the loop
from GWAS → enhancer → deliverable.

---

## What we still don't know (honest gaps) and the data that would close them

1. **Human persistence of the TBI-installed program** — THE key gap. Mouse shows partial
   resolution by 6mo; we have no chronic human microglia. → longitudinal human brain / iPSC-
   microglia months–years post-injury.
2. **Chromatin-QTL colocalization — CLOSED in primary human microglia.** Using the open
   Kosoy/Raj microglia regulome (150 donors — first primary-human-microglia caQTL), we dissected
   the axis at the enhancer level. Microglial chromatin at axis genes IS genetically controlled —
   a genome-wide-significant caQTL at SPP1 (p=1.5×10⁻¹²), with nominally-significant caQTLs at
   ITGAX (4×10⁻⁵), GPNMB, LGALS3, and C1Q (~10⁻⁴). But the split is clean:
   **effectors have genetically-controlled chromatin but AD-null enhancers** (SPP1 strongly so,
   ITGAX/GPNMB/LGALS3/C1Q nominally — no GWS AD signal in the enhancer → environmentally
   installed, not inherited), while
   **only APOE (AD p<10⁻³⁰⁰) and TREM2 (10⁻²⁷) are true inherited risk loci** where AD risk and
   microglial chromatin coincide. Formal shared-SNP colocalization (Wakefield ABF, per-variant
   caQTL from primary microglia) confirms it: **max PP4=0.06 across 37 axis genes — no
   colocalization anywhere.** CTSB is the textbook case of *association without colocalization*
   (PP3=0.97: caQTL and AD signal both present but from distinct causal variants). This is the
   definitive close — in the exact cell type, not bulk brain or macrophage surrogate. E-P linking
   (ABC/Hi-C) additionally places 524 AD-locus variants in microglial enhancers that physically
   loop to 33 axis genes. **Pairwise colocalization across all three molecular layers**
   (caQTL, eQTL, and AD GWAS — three independent shared-SNP Wakefield-ABF tests, not a joint
   3-trait model) is the capstone: caQTL↔eQTL coloc is real but modest (strongest C1QA PP4=0.18 —
   enhancers do regulate their genes), yet **neither molecular trait colocalizes with AD** (max
   eQTL↔GWAS PP4=0.06, max caQTL↔GWAS PP4=0.06). So the chromatin→expression axis is genetically
   real but *AD-risk-independent* — shown at all three molecular layers, not inferred.
3. **Is MEF2 instructive?** The in silico result says MEF2 represses; the causal test is CRISPRi/a
   of MEF2C/CEBPB/CD44 in **human iPSC-microglia**.
4. **Two-hit epidemiology** — does TBI × accelerator-genotype predict faster decline in humans?
   → **ADNI-DoD** (see `adni_dod_sidequest.md`, run separately).
5. **Spatial context** — is the accelerator microglia near tau vs plaque? → AsymAD / PIG spatial
   transcriptomics.
6. **Power** — resilience tests are directional at n=9 vs 16; the incoming ~100-sample cohort
   moves them to conclusive.

See `data_inventory.md` for the full catalog of datasets pulled and identified.
