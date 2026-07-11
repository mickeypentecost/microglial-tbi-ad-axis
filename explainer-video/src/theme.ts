import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

// Fonts — loaded once and reused across every scene/component.
// Pin to just the weights/subset we use so renders don't fan out into
// hundreds of font requests.
export const inter = loadInter("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
}).fontFamily;
export const mono = loadMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
}).fontFamily;

// Spatial grammar (constant across the whole film):
//   warm  = accelerator / injury   (one side)
//   cool  = brake / resolution     (other side)
//   indigo = CD44, the central convergence hub
export const color = {
  // Backdrop
  bgBase: "#0A0E1A",
  bgGradient: "#111827",
  hairline: "#1E293B",

  // Accelerator / injury (warm-red)
  warm: "#FF5A4D",
  warmSecondary: "#F59E0B",
  warmGlow: "#FF7849",

  // Brake / resolution (cool-blue)
  cool: "#38BDF8",
  coolSecondary: "#22D3EE",

  // CD44 hub (indigo)
  hub: "#818CF8",
  hubBright: "#A5B4FC",

  // Text
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",

  // "Built with Claude" clay accent (Scene 8 end card only)
  clay: "#D97757",
} as const;

// Layout constants
export const layout = {
  width: 1920,
  height: 1080,
  fps: 30,
  sidePadding: 140, // >= 120px per spec
  tracking: "0.08em", // uppercase section labels
} as const;

// Named frame ranges per scene (design frames; audio wins once narration exists).
// [startFrame, endFrame] inclusive-ish; durations derived below.
// Durations fit to the 145 wpm scratch narration (VO length + ~1.4s breathing;
// Scene 4 floored at its 4-beat length). Re-fit when the real VO lands.
export const scenes = {
  hook: { start: 0, end: 604 },
  cellAndBuilt: { start: 605, end: 1481 },
  data: { start: 1482, end: 2122 },
  convergence: { start: 2123, end: 2722 },
  genetics: { start: 2723, end: 3801 },
  cd44Hub: { start: 3802, end: 4417 },
  whyItMatters: { start: 4418, end: 5239 },
  close: { start: 5240, end: 5549 },
} as const;

export const TOTAL_FRAMES = 5550;

export const dur = (s: { start: number; end: number }) => s.end - s.start + 1;
