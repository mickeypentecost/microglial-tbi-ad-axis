import { color, mono } from "../theme";

const rand = (n: number) => {
  const x = Math.sin(n * 91.3 + 47.1) * 43758.5453;
  return x - Math.floor(x);
};

// A single star-shaped astrocyte (soma + radiating processes).
const Astrocyte: React.FC<{ x: number; y: number; size: number; seed: number; t: number }> = ({ x, y, size, seed, t }) => {
  const spokes = 7;
  const breathe = 1 + 0.05 * Math.sin(t / 16 + seed);
  return (
    <g opacity={0.85}>
      {Array.from({ length: spokes }, (_, i) => {
        const ang = (i / spokes) * Math.PI * 2 + rand(seed + i) * 0.6;
        const len = size * (0.9 + rand(seed * 2 + i) * 0.5) * breathe;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x + Math.cos(ang) * len}
            y2={y + Math.sin(ang) * len}
            stroke={color.coolSecondary}
            strokeWidth={1.6}
            strokeLinecap="round"
            opacity={0.7}
          />
        );
      })}
      <circle cx={x} cy={y} r={size * 0.32} fill={color.cool} opacity={0.5} />
      <circle cx={x} cy={y} r={size * 0.18} fill={color.coolSecondary} />
    </g>
  );
};

// A plaque ringed by astrocytes. Renders as an SVG <g>.
export const AstrocyteRing: React.FC<{
  cx: number;
  cy: number;
  ringR: number;
  count?: number;
  t: number;
  label?: string;
}> = ({ cx, cy, ringR, count = 7, t, label }) => {
  return (
    <g>
      {/* Amyloid plaque core (warm concentric rings) */}
      <circle cx={cx} cy={cy} r={ringR * 0.42} fill={color.warm} opacity={0.14} />
      <circle cx={cx} cy={cy} r={ringR * 0.42} fill="none" stroke={color.warmGlow} strokeWidth={2} opacity={0.7} />
      <circle cx={cx} cy={cy} r={ringR * 0.26} fill="none" stroke={color.warmSecondary} strokeWidth={1.6} opacity={0.7} />
      <circle cx={cx} cy={cy} r={ringR * 0.1} fill={color.warmGlow} opacity={0.8} />

      {/* Astrocytes around it */}
      {Array.from({ length: count }, (_, i) => {
        const ang = (i / count) * Math.PI * 2 - Math.PI / 2;
        const ax = cx + Math.cos(ang) * ringR;
        const ay = cy + Math.sin(ang) * ringR;
        return <Astrocyte key={i} x={ax} y={ay} size={22} seed={i * 3 + 1} t={t} />;
      })}

      {label ? (
        <text x={cx} y={cy - ringR - 24} textAnchor="middle" fill={color.textSecondary} style={{ fontFamily: mono, fontSize: 18, letterSpacing: "1px" }}>
          {label}
        </text>
      ) : null}
    </g>
  );
};
