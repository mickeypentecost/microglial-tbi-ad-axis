import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AD_GRADIENT, TBI_GRADIENT } from "./chartData";
import { roleColor, chartInk } from "./chartTheme";
import { inter, mono } from "../theme";

/**
 * Spatial localization gradient (paper Fig 2c/2f), in the film's grammar.
 * Accelerator score vs distance from the damage. The line TRACES on
 * left-to-right; markers pop as it passes; the near-damage end (highest score)
 * is emphasized. Warm line = the accelerator.
 *
 *   mode="plaque" — AD Stereo-seq: score by distance-from-plaque band
 *                   (on-plaque highest → >400 µm lowest)
 *   mode="lesion" — TBI Visium: score by distance-from-lesion quintile
 *                   (Q5/lesion highest → Q1/far lowest)
 *
 * X is ordered damage → far in both, so the plaque and lesion panels read the
 * same direction side by side.
 */
export const SpatialGradient: React.FC<{
  mode: "plaque" | "lesion";
  width?: number;
  height?: number;
  startFrame?: number;
}> = ({ mode, width = 620, height = 470, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rows = mode === "plaque" ? AD_GRADIENT : TBI_GRADIENT;
  const xLabel = mode === "plaque" ? "distance from plaque (\u00b5m)" : "distance from lesion";

  const padL = 84, padR = 40, padT = 40, padB = 90;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const vals = rows.map((r) => r.accel);
  const yMin = Math.min(...vals, 0);
  const yMax = Math.max(...vals);
  const pad = (yMax - yMin) * 0.15 || 0.05;
  const lo = yMin - pad, hi = yMax + pad;
  const xAt = (i: number) => padL + (rows.length === 1 ? 0 : (i / (rows.length - 1)) * plotW);
  const yAt = (v: number) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;
  const yticks = niceTicks(lo, hi, 4);

  // line-trace progress
  const drawT = interpolate(frame - startFrame, [0, 34], [0, rows.length - 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    if (i <= Math.floor(drawT)) pts.push(`${xAt(i)},${yAt(rows[i].accel)}`);
    else if (i - 1 < drawT) {
      const f = drawT - Math.floor(drawT);
      const x = xAt(i - 1) + (xAt(i) - xAt(i - 1)) * f;
      const y = yAt(rows[i - 1].accel) + (yAt(rows[i].accel) - yAt(rows[i - 1].accel)) * f;
      pts.push(`${x},${y}`);
      break;
    }
  }
  const warm = roleColor("accelerator");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* zero reference if the range spans it */}
      {lo < 0 && hi > 0 && (
        <line x1={padL} x2={padL + plotW} y1={yAt(0)} y2={yAt(0)} stroke={chartInk.zero} strokeWidth={1} strokeDasharray="5 6" opacity={0.6} />
      )}
      <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={chartInk.axis} />
      {yticks.map((t) => (
        <g key={t}>
          <line x1={padL - 6} x2={padL} y1={yAt(t)} y2={yAt(t)} stroke={chartInk.axis} />
          <text x={padL - 12} y={yAt(t) + 5} textAnchor="end" fill={chartInk.fg} style={{ fontFamily: mono, fontSize: 15 }}>{t.toFixed(2)}</text>
        </g>
      ))}
      {/* damage-end emphasis strip (leftmost band = nearest the damage) */}
      <rect x={padL - 2} y={padT} width={Math.max(2, plotW / rows.length)} height={plotH} fill={warm} opacity={0.08} />

      <text x={padL + plotW / 2} y={height - 34} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 19 }}>{xLabel}</text>
      {rows.map((r, i) => (
        <text key={r.band} x={xAt(i)} y={padT + plotH + 24} textAnchor="middle" fill={chartInk.axis} style={{ fontFamily: mono, fontSize: 13 }}>{r.band}</text>
      ))}
      <text x={22} y={padT + plotH / 2} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 18 }} transform={`rotate(-90 22 ${padT + plotH / 2})`}>
        accelerator score
      </text>

      {pts.length > 1 && (
        <polyline points={pts.join(" ")} fill="none" stroke={warm} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      )}
      {rows.map((r, i) => {
        const passed = drawT >= i;
        const pop = passed ? spring({ frame: frame - startFrame - i * 5, fps, config: { damping: 12, stiffness: 160, mass: 0.5 } }) : 0;
        return <circle key={r.band} cx={xAt(i)} cy={yAt(r.accel)} r={6 * pop} fill={warm} stroke={chartInk.fg} strokeWidth={1} />;
      })}
    </svg>
  );
};

function niceTicks(min: number, max: number, n: number): number[] {
  const step = (max - min) / n;
  return Array.from({ length: n + 1 }, (_, i) => min + i * step);
}

export default SpatialGradient;
