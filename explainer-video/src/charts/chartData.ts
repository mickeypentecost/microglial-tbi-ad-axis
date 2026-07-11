// Real values pulled verbatim from the analysis repo results/ CSVs.
// DATA ONLY — no colors here. The chart components pull color/fonts from
// your ../theme.ts so everything renders in the film's visual grammar.
//
// Source CSVs (in the analysis repo):
//   results/f1_forest.csv, results/crossarm_convergence.csv,
//   results/sldsc_results.csv, results/spatial_stereoseq_gradient.csv,
//   results/spatial_convergence_tbi_gradient.csv, results/f1_coherence.json

export const ACCELERATOR_GENES = [
  "SPP1", "CD44", "ITGAX", "TREM2", "TYROBP", "C3", "C1QA", "C1QB", "C1QC",
  "CST7", "GPNMB", "LPL", "CLEC7A", "LGALS3", "TLR2", "CD68", "B2M", "APOE",
  "IL1B", "TNF", "CXCL10",
];
export const BRAKE_GENES = [
  "TNFAIP6", "HAS1", "HAS2", "HAS3", "HMMR", "ANXA1", "TGFB1", "SOCS3",
  "IL10", "HYAL1", "HYAL2",
];

// Semantic role for each series — the chart maps role -> your theme color.
export type Role = "accelerator" | "brake" | "hub" | "neutral";

// --- Convergence forest (f1_forest.csv): accelerator Cohen's d, disease/injury vs control
export type ForestRow = { label: string; d: number; lo: number; hi: number; significant: boolean };
export const FOREST: ForestRow[] = [
  { label: "CEREBRI (mouse TBI)", d: 0.964, lo: 0.202, hi: 1.727, significant: true },
  { label: "Emory CTE proteomics", d: 0.857, lo: 0.324, hi: 1.525, significant: true },
  { label: "SEA-AD (human AD)", d: 0.351, lo: -0.080, hi: 0.782, significant: false },
  { label: "Marinaro (bulk)", d: -0.037, lo: -0.876, hi: 0.803, significant: false },
];

// --- "Up in BOTH" scatter (crossarm_convergence.csv): AD_lfc vs TBI_lfc per accelerator gene
// 20 of 21 accelerator genes; CLEC7A omitted (TBI_lfc missing in source CSV).
export type ScatterPoint = { gene: string; ad: number; tbi: number; upBoth: boolean };
export const SCATTER: ScatterPoint[] = [
  { gene: "SPP1", ad: 1.258, tbi: 0.886, upBoth: true },
  { gene: "CD44", ad: -0.187, tbi: 0.131, upBoth: false },
  { gene: "ITGAX", ad: 0.172, tbi: 0.038, upBoth: true },
  { gene: "TREM2", ad: 0.018, tbi: -0.510, upBoth: false },
  { gene: "TYROBP", ad: -0.140, tbi: 0.011, upBoth: false },
  { gene: "C3", ad: 0.266, tbi: 0.019, upBoth: true },
  { gene: "C1QA", ad: 0.294, tbi: -0.348, upBoth: false },
  { gene: "C1QB", ad: 0.547, tbi: -0.325, upBoth: false },
  { gene: "C1QC", ad: 0.290, tbi: -0.373, upBoth: false },
  { gene: "CST7", ad: 0.015, tbi: 0.196, upBoth: true },
  { gene: "GPNMB", ad: -0.072, tbi: 0.253, upBoth: false },
  { gene: "LPL", ad: 0.054, tbi: 0.749, upBoth: true },
  { gene: "LGALS3", ad: 0.044, tbi: 0.567, upBoth: true },
  { gene: "TLR2", ad: 0.717, tbi: 0.238, upBoth: true },
  { gene: "CD68", ad: 0.056, tbi: 0.183, upBoth: true },
  { gene: "B2M", ad: 0.016, tbi: 0.145, upBoth: true },
  { gene: "APOE", ad: 0.608, tbi: 0.884, upBoth: true },
  { gene: "IL1B", ad: 0.055, tbi: 0.417, upBoth: true },
  { gene: "TNF", ad: 0.016, tbi: 0.810, upBoth: true },
  { gene: "CXCL10", ad: 0.003, tbi: 0.354, upBoth: true },
];

// --- Genetics (sldsc_results.csv, all_microglia row)
export const GENETICS = {
  pctGenome: 1.5,
  pctHeritability: 31.4,
  enrichment: 21.0,
  pText: "P = 1\u00d710\u207b\u2075",
  armZ: [
    { label: "Accelerator", z: 0.99, role: "accelerator" as Role },
    { label: "DAM", z: -0.43, role: "neutral" as Role },
    { label: "Resolution", z: -1.04, role: "brake" as Role },
  ],
};

// --- CD44 four-modality convergence (manuscript Fig 5C, fact-checked)
export type CD44Row = { label: string; value: number; sig: string; role: Role };
export const CD44_FOUR: CD44Row[] = [
  { label: "Sorted astrocyte bulk RNA (TBI)", value: 1.04, sig: "*", role: "hub" },
  { label: "Mouse plaque protein", value: 0.72, sig: "\u2020", role: "accelerator" },
  { label: "Human AD brain protein", value: 0.26, sig: "**", role: "neutral" },
  { label: "CEREBRI microglia snRNA (TBI)", value: 0.13, sig: "**", role: "brake" },
];

// --- Spatial gradients
export const AD_GRADIENT = [
  { band: "on-plaque", accel: 0.428 }, { band: "0-25", accel: 0.407 },
  { band: "25-50", accel: 0.393 }, { band: "50-100", accel: 0.368 },
  { band: "100-200", accel: 0.356 }, { band: "200-400", accel: 0.325 },
  { band: ">400", accel: 0.247 },
];
export const TBI_GRADIENT = [
  { band: "Q5 (lesion)", accel: 0.102 }, { band: "Q4", accel: -0.018 },
  { band: "Q3", accel: -0.042 }, { band: "Q2", accel: -0.051 },
  { band: "Q1 (far)", accel: -0.061 },
];

export const COHERENCE = {
  accelObserved: 0.074, accelNull: 0.013,
  resolObserved: 0.003, resolNull: 0.003, accelBeatsPct: 1.0,
};

// --- Regulatory switch: in-silico motif-ablation, enhancer-closure Δ accessibility
// (results/insilico_perturbation.csv, arm means; manuscript Fig 4b/c).
// NF-κB closes the ACCELERATOR specifically (activator); MEF2 does NOT close the
// brake (MEF2C is a repressor holding the accelerator off, not an identity factor).
// Bars are drawn as magnitude of closure |Δ|; more negative Δ = stronger closure.
export type AblationRow = { tf: string; target: string; delta: number; sig: string; role: Role; ns?: boolean };
export const SWITCH_ABLATION: AblationRow[] = [
  { tf: "NF-\u03baB", target: "accelerator enhancers", delta: -0.029, sig: "**", role: "accelerator" },
  { tf: "MEF2", target: "brake enhancers", delta: -0.006, sig: "n.s.", role: "brake", ns: true },
];
// SPI1 = lineage-identity factor: dose-dependent closure of BOTH arms (rho=-0.28,
// P=9e-15). Strongest ablation hit but a poor drug target (closing it kills the
// microglial state itself). Carried for the caption / identity annotation.
export const SPI1_IDENTITY = { rho: -0.28, pText: "P = 9\u00d710\u207b\u00b9\u2075" };
export const SWITCH_STATS = {
  nfkbPText: "P = 1.9\u00d710\u207b\u2075",
};
