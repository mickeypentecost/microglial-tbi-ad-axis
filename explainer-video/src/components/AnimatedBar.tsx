import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CountUp } from "./CountUp";
import { color, mono } from "../theme";

const toneOf = (t: "warm" | "cool" | "hub") =>
  t === "warm" ? color.warm : t === "cool" ? color.cool : color.hub;

// A bar that grows from a baseline to a target height. `direction` "up" rises
// above the baseline; "down" drops below it. `value` is the schematic height
// fraction (0..1). Optionally shows a counting fold-change (`fc`, signed) and a
// significance mark (`sig`) at the growing end of the bar.
export const AnimatedBar: React.FC<{
  value: number; // 0..1 target fraction of maxH
  tone: "warm" | "cool" | "hub";
  label: string;
  direction?: "up" | "down";
  delay?: number;
  maxH?: number;
  width?: number;
  fc?: number; // signed log2 fold-change to display
  sig?: string; // significance mark, e.g. "**"
}> = ({ value, tone, label, direction = "up", delay = 0, maxH = 220, width = 76, fc, sig }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = toneOf(tone);

  const grow = spring({ frame: frame - delay, fps, config: { damping: 18 } });
  const h = interpolate(grow, [0, 1], [0, value * maxH]);
  const up = direction === "up";

  const readout =
    fc !== undefined ? (
      <div style={{ textAlign: "center", fontFamily: mono, fontSize: 20, color: c, whiteSpace: "nowrap", lineHeight: 1.1 }}>
        <CountUp to={fc} startFrame={delay + 4} durationInFrames={38} decimals={2} showPlus />
        {sig ? <span style={{ fontSize: 16, color: color.textSecondary }}> {sig}</span> : null}
      </div>
    ) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width }}>
      <div style={{ height: up ? maxH : undefined, width, display: "flex", flexDirection: "column", justifyContent: up ? "flex-end" : "flex-start" }}>
        {up ? <div style={{ marginBottom: 6, opacity: grow }}>{readout}</div> : null}
        <div
          style={{
            width,
            height: h,
            borderRadius: up ? "8px 8px 2px 2px" : "2px 2px 8px 8px",
            background: `linear-gradient(${up ? "to top" : "to bottom"}, ${c}22, ${c})`,
            border: `1px solid ${c}`,
          }}
        />
        {!up ? <div style={{ marginTop: 6, opacity: grow }}>{readout}</div> : null}
      </div>
      <div style={{ marginTop: 12, fontFamily: mono, fontSize: 15, color: color.textSecondary, textAlign: "center", maxWidth: width + 60, lineHeight: 1.3, whiteSpace: "pre-line" }}>
        {label}
      </div>
    </div>
  );
};
