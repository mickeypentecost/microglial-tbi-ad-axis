import { useCurrentFrame } from "remotion";
import { color } from "../theme";

// Deterministic pseudo-random in [0,1) — seeded by an integer so the cell is
// identical on every render (Math.random would flicker across frame renders).
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Seg = { x1: number; y1: number; x2: number; y2: number; w: number; o: number };

// A ramified microglial cell: soma + branching processes with terminal tips.
// `appear` (0..1) grows the processes outward; the cell also breathes gently.
export const Microglia: React.FC<{
  cx: number;
  cy: number;
  appear?: number;
  scale?: number;
}> = ({ cx, cy, appear = 1, scale = 1 }) => {
  const frame = useCurrentFrame();
  const soma = 26 * scale;
  const primaries = 8;

  const segs: Seg[] = [];
  const tips: { x: number; y: number }[] = [];

  const grow = appear;
  const branch = (
    x: number,
    y: number,
    ang: number,
    len: number,
    depth: number,
    seed: number,
  ) => {
    const breathe = 1 + 0.03 * Math.sin(frame / 20 + seed);
    const nx = x + Math.cos(ang) * len * grow * breathe;
    const ny = y + Math.sin(ang) * len * grow * breathe;
    segs.push({
      x1: x,
      y1: y,
      x2: nx,
      y2: ny,
      w: (depth === 0 ? 3 : depth === 1 ? 2.1 : 1.4) * scale,
      o: 0.72 - depth * 0.16,
    });
    if (depth < 2) {
      const spread = 0.55;
      branch(nx, ny, ang - spread * (0.6 + rand(seed * 3 + 1) * 0.7), len * 0.62, depth + 1, seed * 3 + 1);
      branch(nx, ny, ang + spread * (0.6 + rand(seed * 3 + 2) * 0.7), len * 0.62, depth + 1, seed * 3 + 2);
    } else {
      tips.push({ x: nx, y: ny });
    }
  };

  for (let i = 0; i < primaries; i++) {
    const baseAng = (i / primaries) * Math.PI * 2 + (rand(i) - 0.5) * 0.5;
    const len1 = (66 + rand(i + 10) * 30) * scale;
    const x0 = cx + Math.cos(baseAng) * soma;
    const y0 = cy + Math.sin(baseAng) * soma;
    branch(x0, y0, baseAng, len1, 0, i + 1);
  }

  return (
    <g opacity={appear}>
      {/* Processes */}
      {segs.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={color.textSecondary}
          strokeWidth={s.w}
          strokeLinecap="round"
          opacity={s.o}
        />
      ))}
      {/* Terminal tips */}
      {tips.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.y} r={2.6 * scale} fill={color.textSecondary} opacity={0.6} />
      ))}
      {/* Soma: soft indigo body + nucleus (hints at the CD44 hub to come) */}
      <circle cx={cx} cy={cy} r={soma * 1.5} fill={color.hub} opacity={0.1} />
      <circle cx={cx} cy={cy} r={soma} fill={color.hub} opacity={0.22} />
      <circle cx={cx} cy={cy} r={soma} fill="none" stroke={color.hubBright} strokeWidth={1.5} opacity={0.5} />
      <circle cx={cx} cy={cy} r={soma * 0.42} fill={color.hubBright} opacity={0.5} />
    </g>
  );
};
