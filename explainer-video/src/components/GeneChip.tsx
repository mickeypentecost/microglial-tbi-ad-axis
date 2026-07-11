import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color, mono } from "../theme";

const armColor = {
  warm: { line: color.warm, glow: color.warmGlow },
  cool: { line: color.cool, glow: color.coolSecondary },
  hub: { line: color.hub, glow: color.hubBright },
} as const;

// A mono "gene" pill, tinted per arm, that springs in from its column side.
export const GeneChip: React.FC<{
  label: string;
  arm: keyof typeof armColor;
  delay?: number;
  from?: "left" | "right";
  sub?: string;
  compact?: boolean;
}> = ({ label, arm, delay = 0, from = "left", sub, compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = armColor[arm];

  const enter = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const dx = interpolate(enter, [0, 1], [from === "left" ? -28 : 28, 0]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: compact ? 7 : 10,
        padding: compact ? "8px 15px" : "12px 22px",
        borderRadius: 999,
        border: `1.5px solid ${c.line}`,
        background: `${c.line}1F`, // ~12% alpha
        opacity,
        transform: `translateX(${dx}px)`,
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: compact ? 22 : 28,
          fontWeight: 500,
          color: color.text,
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </span>
      {sub ? (
        <span style={{ fontFamily: mono, fontSize: compact ? 15 : 18, color: c.glow }}>{sub}</span>
      ) : null}
    </div>
  );
};
