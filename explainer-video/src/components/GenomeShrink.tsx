import { interpolate } from "remotion";
import { color, mono } from "../theme";

// A genome track that collapses attention onto a tiny 1.5% sliver.
// `progress` 0..1: 0 = full neutral bar; 1 = sliver highlighted warm with a
// labelled bracket beneath. Renders as an SVG <g>; place inside a scene <svg>.
export const GenomeShrink: React.FC<{
  cx: number;
  y: number;
  width: number;
  progress: number;
}> = ({ cx, y, width, progress }) => {
  const W = width;
  const x0 = cx - W / 2;
  const barH = 22;
  const sliverFrac = 0.5;
  const sliverW = Math.max(4, W * 0.015);
  const sliverX = x0 + W * sliverFrac;

  const segs = 44;
  const dim = interpolate(progress, [0, 1], [0.5, 0.12]);
  const sliverGrow = interpolate(progress, [0, 1], [1, 1.5]);
  const bracketOn = interpolate(progress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g>
      {/* Track */}
      <rect x={x0} y={y} width={W} height={barH} rx={6} fill={color.hairline} opacity={dim + 0.06} />
      {/* Chromosome-like banding */}
      {Array.from({ length: segs }, (_, i) => {
        const bx = x0 + (i / segs) * W;
        return <line key={i} x1={bx} y1={y + 3} x2={bx} y2={y + barH - 3} stroke={color.bgBase} strokeWidth={1.5} opacity={dim} />;
      })}
      {/* Sliver */}
      <rect
        x={sliverX}
        y={y + barH / 2 - (barH * sliverGrow) / 2}
        width={sliverW}
        height={barH * sliverGrow}
        rx={2}
        fill={color.warm}
      />
      <rect
        x={sliverX - 4}
        y={y + barH / 2 - (barH * sliverGrow) / 2 - 4}
        width={sliverW + 8}
        height={barH * sliverGrow + 8}
        rx={4}
        fill="none"
        stroke={color.warmGlow}
        strokeWidth={1.5}
        opacity={0.5 * progress}
      />
      {/* Bracket + label */}
      <g opacity={bracketOn}>
        <line x1={sliverX - 6} y1={y + barH + 14} x2={sliverX + sliverW + 6} y2={y + barH + 14} stroke={color.warmGlow} strokeWidth={1.5} />
        <line x1={sliverX - 6} y1={y + barH + 10} x2={sliverX - 6} y2={y + barH + 14} stroke={color.warmGlow} strokeWidth={1.5} />
        <line x1={sliverX + sliverW + 6} y1={y + barH + 10} x2={sliverX + sliverW + 6} y2={y + barH + 14} stroke={color.warmGlow} strokeWidth={1.5} />
        <text x={sliverX + sliverW / 2} y={y + barH + 40} textAnchor="middle" fill={color.warmGlow} style={{ fontFamily: mono, fontSize: 20 }}>
          1.5% of the genome
        </text>
      </g>
      {/* End caps label */}
      <text x={x0} y={y - 14} fill={color.textMuted} style={{ fontFamily: mono, fontSize: 17, letterSpacing: "1px" }} opacity={dim + 0.2}>
        GENOME
      </text>
    </g>
  );
};
