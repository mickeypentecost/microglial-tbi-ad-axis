import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { GENETICS } from "./chartData";
import { roleColor, chartInk } from "./chartTheme";
import { inter, mono } from "../theme";

/**
 * Genetics heritability bars (paper Fig 1E), in the film's grammar.
 * 1.5% of genome carries 31.4% of AD SNP-heritability. Bars grow from the
 * axis, value labels count up, enrichment/P annotation fades in after.
 * "% of AD risk" bar is hub-colored to tie to the Scene 5 stat callouts.
 */
export const HeritabilityChart: React.FC<{
  width?: number;
  height?: number;
  startFrame?: number;
}> = ({ width = 560, height = 560, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padL = 92, padR = 40, padT = 72, padB = 74;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const yMax = 42;
  const yS = (v: number) => padT + plotH - (v / yMax) * plotH;

  const bars = [
    { label: "% of\ngenome", value: GENETICS.pctGenome, color: roleColor("neutral") },
    { label: "% of\nAD risk", value: GENETICS.pctHeritability, color: roleColor("hub") },
  ];
  const bw = plotW / (bars.length * 2);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={chartInk.axis} />
      {[0, 10, 20, 30, 40].map((t) => (
        <g key={t}>
          <line x1={padL - 6} x2={padL} y1={yS(t)} y2={yS(t)} stroke={chartInk.axis} />
          <text x={padL - 12} y={yS(t) + 6} textAnchor="end" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 17 }}>{t}</text>
        </g>
      ))}
      <text x={24} y={padT + plotH / 2} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 19 }} transform={`rotate(-90 24 ${padT + plotH / 2})`}>
        Percent
      </text>

      {bars.map((b, i) => {
        const grow = spring({ frame: frame - startFrame - i * 6, fps, config: { damping: 200, stiffness: 100 } });
        const cx = padL + (i * 2 + 1) * bw;
        const h = plotH * (b.value / yMax) * grow;
        const shown = (b.value * grow).toFixed(1);
        return (
          <g key={b.label}>
            <rect x={cx - bw / 2} y={padT + plotH - h} width={bw} height={h} fill={b.color} rx={3} />
            <text x={cx} y={padT + plotH - h - 14} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 26, fontWeight: 700 }}>{shown}%</text>
            {b.label.split("\n").map((ln, k) => (
              <text key={k} x={cx} y={padT + plotH + 28 + k * 22} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 18 }}>{ln}</text>
            ))}
          </g>
        );
      })}

      <g opacity={interpolate(frame - startFrame, [26, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <text x={padL + plotW / 2} y={padT - 36} textAnchor="middle" fill={roleColor("hub")} style={{ fontFamily: inter, fontSize: 22, fontWeight: 700 }}>
          {`${GENETICS.enrichment.toFixed(0)}\u00d7 enrichment`}
        </text>
        <text x={padL + plotW / 2} y={padT - 10} textAnchor="middle" fill={chartInk.axis} style={{ fontFamily: mono, fontSize: 18 }}>
          {GENETICS.pText}
        </text>
      </g>
    </svg>
  );
};

export default HeritabilityChart;
