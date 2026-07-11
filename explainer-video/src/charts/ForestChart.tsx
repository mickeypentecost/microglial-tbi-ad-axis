import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { FOREST, ForestRow } from "./chartData";
import { roleColor, chartInk } from "./chartTheme";
import { inter, mono } from "../theme";

/**
 * Convergence forest (paper Fig 1D), rendered in the film's grammar.
 * Subtle build: each CI whisker extends outward from the point estimate and
 * the marker springs in, staggered top-to-bottom. Warm = significant
 * (CI excludes 0), muted = not. Draw on transparent — sits on the dark stage.
 */
export const ForestChart: React.FC<{
  width?: number;
  height?: number;
  data?: ForestRow[];
  startFrame?: number;
  stagger?: number;
}> = ({ width = 820, height = 520, data = FOREST, startFrame = 0, stagger = 10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padL = 300, padR = 50, padT = 24, padB = 64;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMin = -1.0, xMax = 1.9;
  const xS = (v: number) => padL + ((v - xMin) / (xMax - xMin)) * plotW;
  const rowY = (i: number) => padT + (i + 0.5) * (plotH / data.length);
  const ticks = [-1, -0.5, 0, 0.5, 1, 1.5];

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <line x1={xS(0)} x2={xS(0)} y1={padT} y2={padT + plotH} stroke={chartInk.zero} strokeWidth={1.5} strokeDasharray="5 6" opacity={0.6} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={xS(t)} x2={xS(t)} y1={padT + plotH} y2={padT + plotH + 6} stroke={chartInk.axis} />
          <text x={xS(t)} y={padT + plotH + 28} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: mono, fontSize: 20 }}>{t}</text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={height - 8} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 22 }}>
        effect size (Cohen&apos;s d)
      </text>

      {data.map((row, i) => {
        const enter = spring({ frame: frame - startFrame - i * stagger, fps, config: { damping: 200, stiffness: 120 } });
        const ci = interpolate(frame - startFrame - i * stagger, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = rowY(i), xd = xS(row.d);
        const xlo = xd + (xS(row.lo) - xd) * ci;
        const xhi = xd + (xS(row.hi) - xd) * ci;
        const c = row.significant ? roleColor("accelerator") : roleColor("neutral");
        return (
          <g key={row.label} opacity={enter}>
            <text x={padL - 18} y={y + 7} textAnchor="end" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 21 }}>{row.label}</text>
            <line x1={xlo} x2={xhi} y1={y} y2={y} stroke={c} strokeWidth={4} strokeLinecap="round" />
            <circle cx={xd} cy={y} r={9 * enter} fill={c} stroke={chartInk.fg} strokeWidth={1.2} />
          </g>
        );
      })}
    </svg>
  );
};

export default ForestChart;
