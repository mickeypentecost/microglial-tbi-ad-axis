import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CountUp } from "./CountUp";
import { color, inter, mono } from "../theme";

const toneColor = {
  warm: color.warm,
  cool: color.cool,
  hub: color.hubBright,
  text: color.text,
} as const;

// Oversized counting number + caption. The hero stat unit for Scene 5.
export const StatCallout: React.FC<{
  value: number;
  label: string;
  delay?: number;
  decimals?: number;
  suffix?: string;
  showPlus?: boolean;
  tone?: keyof typeof toneColor;
  size?: number;
}> = ({ value, label, delay = 0, decimals = 0, suffix = "", showPlus = false, tone = "text", size = 108 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 18 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [18, 0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: inter, fontWeight: 700, fontSize: size, lineHeight: 1, color: toneColor[tone], letterSpacing: "-0.02em" }}>
        <CountUp to={value} startFrame={delay + 4} durationInFrames={40} decimals={decimals} suffix={suffix} showPlus={showPlus} />
      </div>
      <div style={{ fontFamily: mono, fontSize: 20, letterSpacing: "0.06em", textTransform: "uppercase", color: color.textSecondary, marginTop: 12 }}>
        {label}
      </div>
    </div>
  );
};
