import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { CD44_FOUR, CD44Row } from "./chartData";
import { roleColor, chartInk } from "./chartTheme";
import { inter } from "../theme";

/**
 * CD44 four-modality convergence bars (paper Fig 5C), in the film's grammar.
 * Horizontal bars grow from the left, staggered; each row keeps its role color
 * and significance mark. Values are log2FC or delta in disease/injury.
 */
export const CD44Chart: React.FC<{
  width?: number;
  height?: number;
  data?: CD44Row[];
  startFrame?: number;
  stagger?: number;
}> = ({ width = 840, height = 470, data = CD44_FOUR, startFrame = 0, stagger = 8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padL = 320, padR = 70, padT = 28, padB = 66;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 1.2;
  const xS = (v: number) => (v / xMax) * plotW;
  const rowH = plotH / data.length;
  const ticks = [0, 0.3, 0.6, 0.9, 1.2];

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={chartInk.axis} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL + xS(t)} x2={padL + xS(t)} y1={padT + plotH} y2={padT + plotH + 6} stroke={chartInk.axis} />
          <text x={padL + xS(t)} y={padT + plotH + 26} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 17 }}>{t}</text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={height - 10} textAnchor="middle" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 19 }}>
        CD44 up in disease/injury (log2FC or &#916;)
      </text>

      {data.map((row, i) => {
        const grow = spring({ frame: frame - startFrame - i * stagger, fps, config: { damping: 200, stiffness: 100 } });
        const y = padT + i * rowH + rowH / 2;
        const full = xS(row.value);
        const w = full * grow;
        const c = roleColor(row.role);
        return (
          <g key={row.label}>
            {wrapLabel(row.label).map((ln, k, arr) => (
              <text key={k} x={padL - 16} y={y + 5 - (arr.length - 1) * 10 + k * 20} textAnchor="end" fill={chartInk.fg} style={{ fontFamily: inter, fontSize: 17 }}>{ln}</text>
            ))}
            <rect x={padL} y={y - rowH * 0.3} width={w} height={rowH * 0.6} fill={c} rx={3} />
            <text x={padL + full + 12} y={y + 6} fill={chartInk.fg} opacity={grow} style={{ fontFamily: inter, fontSize: 20 }}>{row.sig}</text>
          </g>
        );
      })}
    </svg>
  );
};

function wrapLabel(s: string): string[] {
  const words = s.split(" ");
  if (words.length <= 2) return [s];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export default CD44Chart;
