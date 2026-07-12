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
// Fit to each scene's real VO length (VO + ~0.9s tail). Scene 4 kept at ~20s —
// its four visual beats (scatter/forest → plaques → lesion) need the time.
// Frames 0–29 are a 1s intro hold (background only) before Scene 1; the close
// carries an extra 2s to fade fully to black.
export const scenes = {
  hook: { start: 30, end: 521 }, // VO 15.3s  (after 1s intro hold)
  cellAndBuilt: { start: 522, end: 1336 }, // VO 26.0s
  data: { start: 1337, end: 1931 }, // VO 18.7s
  convergence: { start: 1932, end: 2531 }, // VO 16.3s (visuals-driven, ~20s)
  genetics: { start: 2532, end: 3502 }, // VO 31.2s (Scene5v2)
  cd44Hub: { start: 3503, end: 4043 }, // VO 16.9s
  whyItMatters: { start: 4044, end: 4776 }, // VO 23.3s
  close: { start: 4777, end: 5136 }, // VO 8.5s + 2s outro fade
} as const;

export const TOTAL_FRAMES = 5137;

export const dur = (s: { start: number; end: number }) => s.end - s.start + 1;
