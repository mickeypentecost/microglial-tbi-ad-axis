import { interpolate, useCurrentFrame } from "remotion";
import { mono } from "../theme";

// Counts up to a target value. Supports decimals, a suffix (%, ×), and an
// optional leading "+". Eases out so it settles rather than snapping.
export const CountUp: React.FC<{
  to: number;
  from?: number;
  startFrame?: number;
  durationInFrames?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  showPlus?: boolean;
  style?: React.CSSProperties;
}> = ({
  to,
  from = 0,
  startFrame = 0,
  durationInFrames = 40,
  decimals = 0,
  suffix = "",
  prefix = "",
  showPlus = false,
  style,
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [from, to],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    },
  );

  const sign = showPlus && value >= 0 ? "+" : "";
  const text = `${prefix}${sign}${value.toFixed(decimals)}${suffix}`;

  return (
    <span style={{ fontFamily: mono, fontVariantNumeric: "tabular-nums", ...style }}>
      {text}
    </span>
  );
};
