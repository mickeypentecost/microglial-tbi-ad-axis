# Side quest — the two-hit test (TBI × accelerator-genotype → dementia) in ADNI-DoD

**Run this prompt in a SEPARATE Claude Science session/project.** It uses controlled-access
data (ADNI / DoD-ADNI) that must NOT enter the `microglial-tbi-ad-axis` hackathon project,
whose submission is restricted to public data + analyses generated during the event. Keep the
two worlds separate: this side quest tests our hypothesis against independent human outcome
data; its results can be *cited* back qualitatively but its data and derived tables must stay
in the separate project.

---

## Copy-paste prompt

> I have (or am requesting) access to **DOD-ADNI** (the Department of Defense Alzheimer's
> Disease Neuroimaging Initiative, Vietnam-era veterans with TBI/PTSD history) and/or the main
> **ADNI** cohort via the LONI IDA (https://ida.loni.usc.edu). I want to test a specific
> pre-registered hypothesis and nothing else. Do not pull in any other project's data.
>
> **Hypothesis (two-hit model).** Traumatic brain injury and inherited AD risk that acts through
> the *microglial accelerator program* combine super-additively to drive progression to
> dementia. Specifically: among older adults, individuals who (a) have a history of TBI **and**
> (b) carry high genetic load in microglial accelerator-program regulatory DNA will show faster
> cognitive decline and higher conversion to dementia than either hit alone — a positive
> **TBI × genotype interaction**, over and above APOE-ε4.
>
> **Background this rests on (from a separate public-data analysis — cite, don't re-run):**
> - AD SNP-heritability is concentrated in microglial regulatory DNA (S-LDSC: ~21× enrichment,
>   ~31% of h²), and within microglia the enrichment loads the **accelerator** arm
>   (SPP1/complement/DAM), not the homeostatic/protective arm.
> - The accelerator *effector* genes (SPP1, GPNMB) are environmentally installed (no eQTL
>   colocalization with AD risk) — i.e. TBI is a plausible environmental trigger of the same
>   program that genetics predisposes to.
> - Resilience tracks a MEF2C-high homeostatic microglial state and is a graded/modifiable
>   program, not an inherited risk-lowering genotype.
> So the model is: **genetics sets the threshold, TBI provides the trigger, both converge on the
> microglial accelerator axis.**
>
> **Variables to pull (minimum):**
> 1. **TBI exposure** — DOD-ADNI TBI history (LONI: `MEDHIST`, TBI-specific CRFs, or the
>    DoD TBI/PTSD group assignment); code as ever-TBI vs never, and if available a severity/
>    count and time-since-injury.
> 2. **Genotype** — APOE genotype (ε2/ε3/ε4). If genome-wide data are available, construct a
>    **microglial-accelerator polygenic score**: restrict a standard AD PRS (Bellenguez 2022
>    weights) to variants in microglial accelerator enhancers. If only APOE is available,
>    use ε4 dose as the genetic hit and note the limitation.
> 3. **Outcome** — longitudinal cognition (ADAS-Cog13, CDR-SB, MMSE) and diagnostic conversion
>    (CN→MCI→AD) with dates; CSF/PET biomarkers (Aβ42, p-tau181, amyloid/tau PET) where present.
> 4. **Covariates** — age, sex, education, baseline diagnosis, PTSD status (DoD cohort),
>    ancestry PCs if PRS is used.
>
> **Analysis design:**
> 1. **Interaction model (primary).** Linear mixed model of cognitive trajectory:
>    `cognition ~ TBI * genotype_score + age + sex + edu + APOE_e4 + (time | subject)`,
>    testing the **TBI × genotype_score** term. Report the interaction β, CI, p. The pre-specified
>    win is a positive interaction (super-additivity).
> 2. **Survival (secondary).** Cox model for time-to-dementia with TBI, genotype_score, and their
>    interaction; Kaplan–Meier by the four groups (neither / TBI-only / genotype-only / both).
> 3. **Biomarker mediation (exploratory).** Does the TBI×genotype effect on cognition run through
>    p-tau (consistent with the axis tracking tau > amyloid)? Test with a mediation model.
> 4. **Stratify by APOE** to check whether the accelerator-PRS effect is APOE-independent.
>
> **Power / honesty notes I want enforced:** DoD-ADNI is small (~200 TBI-history subjects) —
> report observed power, do not over-interpret a null interaction, and present the four-group
> KM plot even if underpowered. If a microglial-accelerator PRS can't be built (no GWAS-wide
> genotypes), fall back to APOE-ε4 as the genetic hit and say so explicitly.
>
> **Deliverables:** (1) the interaction model table + forest plot of the TBI×genotype term;
> (2) four-group Kaplan–Meier to dementia; (3) a short methods note on cohort, n per group, and
> power; (4) a one-paragraph verdict on whether the two-hit model is supported, refuted, or
> underpowered. Keep everything in THIS project only.

---

## Why this is the right independent test
Everything in the main project is cross-sectional and correlational — it shows TBI and AD
*converge* on the microglial accelerator axis but not that the two hits *combine* to cause faster
decline in humans. ADNI-DoD is one of the very few cohorts with TBI history + genotype +
longitudinal outcome, so it is the natural place to test the causal, epidemiological prediction
that the mechanistic work generates. A positive TBI×genotype interaction would convert the
convergence map into a clinical risk model.
