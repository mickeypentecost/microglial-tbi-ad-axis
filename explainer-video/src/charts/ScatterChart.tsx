import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { SCATTER, ScatterPoint } from "./chartData";
import { roleColor, chartInk } from "./chartTheme";
import { inter } from "../theme";

/**
 * "Up in BOTH" scatter (paper Fig 1C), in the film's grammar.
 * x = delta in Alzheimer's (logFC), y = delta in brain injury (logFC).
 * Points pop in with a spring, staggered; genes up in both = warm, else muted.
 * Upper-right quadrant is the convergence zone.
 */
export const ScatterChart: React.FC<{
  width?: number;
  height?: number;
  data?: ScatterPoint[];
  startFrame?: number;
  stagger?: number;
  labelGenes?: string[];
}> = ({
  width = 620,
  height = 560,
  data = SCATTER,
  startFrame = 0,
  stagger = 2,
  labelGenes = ["SPP1", "APOE", "TNF", "TLR2", "TREM2"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padL = 82, padR = 30, padT = 30, padB = 68;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMin = -0.3, xMax = 1.35, yMin = -0.6, yMax = 1.0;
  const xS = (v: number) => padL + ((v - xMin) / (xMax - xMin)) * plotW;
  const yS = (v: number) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <line x1={xS(0)} x2={xS(0)} y1={padT} y2={padT + plotH} stroke={chartInk.grid} strokeWidth={1} />
      <line x1={padL} x2={padL + plotW} y1={yS(0)} y2={yS(0)} stroke={chartInk.grid} strokeWidth={1} />
      <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={chartInk.axis} />
      <line x1={padL} x2={padL + plotW} y1={padT + plotH} y2={padT + plotH} stroke={chartInk.axis} />
      {[-0.25, 0, 0.5, 1.0].map((t) => (
        <text key={`x${t}`} x={xS(t)} y={padT + plotH + 26} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 17 }}>{t}</text>
      ))}
      {[-0.4, 0, 0.4, 0.8].map((t) => (
        <text key={`y${t}`} x={padL - 12} y={yS(t) + 5} textAnchor="end" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 17 }}>{t}</text>
      ))}
      <text x={padL + plotW / 2} y={height - 12} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 20 }}>
        &#916; in Alzheimer&apos;s (logFC)
      </text>
      <text x={26} y={padT + plotH / 2} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 20 }} transform={`rotate(-90 26 ${padT + plotH / 2})`}>
        &#916; in brain injury (logFC)
      </text>

      {data.map((p, i) => {
        const enter = spring({ frame: frame - startFrame - i * stagger, fps, config: { damping: 14, stiffness: 140, mass: 0.6 } });
        const c = p.upBoth ? roleColor("accelerator") : roleColor("neutral");
        const cx = xS(p.ad), cy = yS(p.tbi);
        return (
          <g key={p.gene} opacity={enter}>
            <circle cx={cx} cy={cy} r={8 * enter} fill={c} stroke={chartInk.fg} strokeWidth={1} />
            {labelGenes.includes(p.gene) && (
              <text x={cx + 12} y={cy + 4} fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 17, fontStyle: "italic" }}>{p.gene}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default ScatterChart;
