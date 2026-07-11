// Bridges the data-role vocabulary to YOUR film palette (../theme.ts).
// Charts never hardcode a hex — they call roleColor(role).
import { color } from "../theme";
import type { Role } from "./chartData";

export const roleColor = (role: Role): string => {
  switch (role) {
    case "accelerator":
      return color.warm; // #FF5A4D
    case "brake":
      return color.cool; // #38BDF8
    case "hub":
      return color.hub; // #818CF8
    case "neutral":
    default:
      return color.textSecondary; // #94A3B8
  }
};

// Structural chart colors, all from the film theme.
export const chartInk = {
  fg: color.text, // axis + label text
  axis: color.textMuted, // axis lines/ticks
  grid: color.hairline, // gridlines
  zero: color.textMuted, // zero reference line
};
