import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { SWITCH_ABLATION, AblationRow, SWITCH_STATS } from "./chartData";
import { roleColor, chartInk } from "./chartTheme";
import { inter, mono } from "../theme";

/**
 * Regulatory-switch ablation bars (paper Fig 4b/c), in the film's grammar.
 * In-silico motif ablation: how much each TF's deletion CLOSES its arm's
 * enhancers. Bars show magnitude of closure |Δ accessibility|, growing downward
 * from a baseline (deletion = loss). NF-κB closes the accelerator specifically
 * (warm, significant); MEF2 does NOT close the brake (cool, n.s.) — the visual
 * proof that MEF2C is a repressor, not an identity factor.
 */
export const SwitchAblationChart: React.FC<{
  width?: number;
  height?: number;
  data?: AblationRow[];
  startFrame?: number;
  stagger?: number;
}> = ({ width = 560, height = 470, data = SWITCH_ABLATION, startFrame = 0, stagger = 12 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padL = 70, padR = 40, padT = 78, padB = 96;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const baseY = padT; // bars hang DOWN from here (closure = loss)
  const maxMag = 0.035; // axis: |Δ| up to 0.035
  const barSlot = plotW / data.length;
  const bw = 92;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* baseline (no change) */}
      <line x1={padL} x2={padL + plotW} y1={baseY} y2={baseY} stroke={chartInk.axis} strokeWidth={1.5} />
      <text x={padL - 12} y={baseY + 5} textAnchor="end" fill={chartInk.axis} style={{ fontFamily: mono, fontSize: 15 }}>0</text>
      <text x={16} y={baseY + plotH / 2} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 17 }} transform={`rotate(-90 16 ${baseY + plotH / 2})`}>
        enhancer closure (&#8722;&#916; access.)
      </text>

      {data.map((row, i) => {
        const grow = spring({ frame: frame - startFrame - i * stagger, fps, config: { damping: 200, stiffness: 100 } });
        const cx = padL + barSlot * (i + 0.5);
        const mag = Math.abs(row.delta) / maxMag; // 0..1
        const h = plotH * mag * grow;
        const c = roleColor(row.role);
        const dim = row.ns ? 0.5 : 1;
        return (
          <g key={row.tf}>
            {/* bar hangs down from baseline */}
            <rect x={cx - bw / 2} y={baseY} width={bw} height={h} fill={c} opacity={dim} rx={3} />
            {/* TF name above baseline */}
            <text x={cx} y={baseY - 40} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 26, fontWeight: 700 }}>{row.tf}</text>
            {/* significance / n.s. just under the TF name */}
            <text x={cx} y={baseY - 14} textAnchor="middle" fill={row.ns ? chartInk.axis : c} style={{ fontFamily: mono, fontSize: 18 }}>{row.sig}</text>
            {/* target label below the plot */}
            {row.target.split(" ").map((w, k) => (
              <text key={k} x={cx} y={baseY + plotH + 26 + k * 20} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 16 }}>{w}</text>
            ))}
          </g>
        );
      })}

      {/* role annotations */}
      <text x={padL + barSlot * 0.5} y={height - 8} textAnchor="middle" fill={roleColor("accelerator")} style={{ fontFamily: mono, fontSize: 16 }}>activator</text>
      <text x={padL + barSlot * 1.5} y={height - 8} textAnchor="middle" fill={chartInk.axis} style={{ fontFamily: mono, fontSize: 16 }}>repressor (no closure)</text>
    </svg>
  );
};

export default SwitchAblationChart;
