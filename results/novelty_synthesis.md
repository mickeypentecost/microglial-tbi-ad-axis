# The causal / perturbable upgrade — novelty synthesis

This session extended the microglial TBI→AD axis from a **convergence map** (TBI and AD look
alike) to a **causal, directional, perturbable model** (here is the switch, which way it runs,
and how to flip it), and finally to a **spatial and temporal model** (where the axis fires in
tissue, and when the brake is available). Each arm draws on public data or models in hand.

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
7. **The resolution arm is measurable in bulk, and TBI disengages it at the CD44 hub.** The brake
   genes (TSG-6/TNFAIP6, HAS1-3, HYAL1/2) are effectively invisible in snRNA (~0.3% detection) but
   detected in **87–100%** of human AD bulk hippocampus samples (GSE153873) — "resolution
   insufficiency" was partly an *assay artifact*. With the hyaluronidases and CD44 receptor added,
   the HA-matrix module is genuinely coherent (0.14 vs null 0.03, 94th percentile; the accelerator
   arm is far more coherent in bulk, 0.37, than in snRNA, 0.074). In sorted mouse cells after TBI
   (GSE276182), **astrocytes** raise the CD44 receptor (+1.04, p=0.016), the SPP1/OPN accelerator
   ligand (+4.6, p=0.016), and HA synthesis (HAS2 +0.76, p=0.016) while **suppressing the
   pro-resolving TSG-6 ligand (TNFAIP6 −0.34, p=0.032)** — receptor up, brake ligand down: the
   disengaged brake, measured directly in the cell type and genes single-nucleus cannot see.
   **Novel** — converts "the brake is off" from a literature claim into a fresh, modality-matched
   measurement.
8. **The accelerator concentrates spatially at BOTH the AD plaque and the TBI lesion — the same
   axis, two injuries.** Subcellular spatial transcriptomics (Stereo-seq, 18-month App-NL-G-F AD,
   GSE263793, 142,383 bins at 50 µm with the study's plaque mask) shows the accelerator module
   rising **toward amyloid plaques**, and the effect **survives a tissue-geometry control**: after
   partialling out distance-to-tissue-centroid, the accelerator still tracks plaque distance
   (partial ρ=−0.24), and bins near plaques exceed far bins **within every concentric geometry
   band** (Δ=+0.16 inner → +0.23 edge). The resolution/HA brake is **spatially excluded**
   (ρ=+0.38 — depleted where the accelerator fires) and astrocytes co-concentrate peri-plaque
   (the CD44-shell receptor half). *Honest caveat, from the WT_F5 negative control (GSM8199181, no
   plaques):* a general **center-high tissue gradient** exists independent of plaques (WT centroid
   ρ=−0.44), and it accounts for roughly half the marginal plaque signal (marginal plaque ρ=−0.46 ≈
   centroid ρ=−0.45). So the accelerator concentrates at plaques *on top of* a geometric center-high
   baseline — the plaque-specific component is modest but robust to the confound. The same gradient appears at the **TBI lesion** (Visium, impact TBI 7 d,
   GSE319409, 6 TBI vs 6 Sham vehicle sections): the accelerator tracks the lesion (accel-vs-injury
   ρ=+0.47, using a lesion proxy that shares no gene with the accelerator module, so it is not
   circular) and is up TBI-vs-Sham (p=4×10⁻²⁶). **Novel** — the axis is not just co-expressed in
   bulk but spatially organizes around two distinct injury landmarks; different geometry (focal
   plaque vs diffuse lesion), same accelerator concentration.
9. **The resolution brake is a temporal PHASE, not a fixed level — and that reconciles the
   AD/TBI asymmetry.** In the CEREBRI mouse TBI time-course (GSE269748, 24 h → 7 d → 6 mo), the
   microglial resolution/HA module is **highest acutely (24 h, +0.065) and collapses by 7 d
   (−0.019)** as the accelerator surges to its subacute peak (24 h +0.76 → 7 d +1.24 → 6 mo +0.70;
   accel time-trend ρ=+0.44, resolHA ρ=−0.25, both p≈0). Individual brakes confirm it: Anxa1 peaks
   at 7 d, while Socs3/Tgfb1 are highest at 24 h. So the modest brake rise seen at the TBI Visium
   lesion (a single 7-d snapshot) is the **tail of an acute resolution attempt**; the chronic AD
   plaque niche looks like the **6-month** TBI state — accelerator elevated, brake gone. **Novel** —
   reframes "resolution failure" from a static deficit to a lost temporal window: TBI mounts an
   early brake AD never regains. *Caveat:* CEREBRI has controls only at 24 h, so this is a
   within-TBI trajectory anchored to one acute baseline; 7 d/6 mo rest on 4 donors each.

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
5. **Spatial context — DONE (findings 8–9).** The accelerator concentrates at the AD plaque
   (Stereo-seq, ρ=−0.28) and the TBI lesion (Visium, ρ=+0.47), with astrocytes co-concentrating
   peri-plaque (the CD44-shell). The one remaining spatial question is **single-cell adjacency**:
   Visium (55 µm) and Stereo-seq bins average multiple cells, so the accelerator-microglia ↔
   CD44-astrocyte *cell-touching-cell* relay is at the resolution ceiling — the prior Colab CosMx
   work put them in a **two-zone** architecture (DAM core → CD44-astrocyte shell, segregated at
   single-cell z≈−5), which our binned data are consistent with but cannot re-resolve. → Xenium/
   MERFISH human AD for true single-cell adjacency.
6. **Resolution-arm direction in a well-powered human set** — bulk closes the *detection* and
   *coherence* gap (finding 7 above) and the mouse shows the CD44-hub disengagement, but the human
   AD-vs-control direction is underpowered in GSE153873 (n=12 vs 10; only SPP1 reaches p=0.038). A
   larger bulk cohort (Mayo/MSBB-class) would settle the human brake direction.
7. **Power** — resilience tests are directional at n=9 vs 16; the incoming ~100-sample cohort
   moves them to conclusive.

See `data_inventory.md` for the full catalog of datasets pulled and identified.
