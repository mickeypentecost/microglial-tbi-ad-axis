import { color, inter, mono } from "../theme";

export type Ligand = {
  angleDeg: number; // 0 = right, 90 = up
  dist: number; // gap from node edge to arrow start
  tone: "warm" | "cool";
  label: string;
  sub?: string;
  engaged: number; // 0 = disengaged/fading, 1 = engaged/pressing in
};

const dir = (deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a), -Math.sin(a)];
};

const toneOf = (t: "warm" | "cool") =>
  t === "warm" ? { line: color.warm, glow: color.warmGlow } : { line: color.cool, glow: color.coolSecondary };

// Central indigo CD44 node with inbound ligand arrows. Renders as an SVG <g>;
// place inside a scene <svg>. `t` drives the engaged pulse + node breathing.
export const ConvergenceHub: React.FC<{
  cx: number;
  cy: number;
  r: number;
  ligands: Ligand[];
  label?: string;
  t: number;
}> = ({ cx, cy, r, ligands, label = "CD44", t }) => {
  const breathe = 1 + 0.03 * Math.sin(t / 14);

  return (
    <g>
      {/* Ligand arrows */}
      {ligands.map((lg, i) => {
        const [dx, dy] = dir(lg.angleDeg);
        const sx = cx + (r + lg.dist) * dx;
        const sy = cy + (r + lg.dist) * dy;
        // engaged arrows press right up to the node; disengaged pull back
        const gap = 14 + (1 - lg.engaged) * 40;
        const ex = cx + (r + gap) * dx;
        const ey = cy + (r + gap) * dy;
        const c = toneOf(lg.tone);

        // arrowhead
        const ah = 12;
        const baseAng = Math.atan2(ey - sy, ex - sx);
        const p1 = [ex - ah * Math.cos(baseAng - 0.4), ey - ah * Math.sin(baseAng - 0.4)];
        const p2 = [ex - ah * Math.cos(baseAng + 0.4), ey - ah * Math.sin(baseAng + 0.4)];

        const op = 0.35 + 0.65 * lg.engaged;
        const pulsePhase = ((t / 34) + i * 0.3) % 1;
        const px = sx + (ex - sx) * pulsePhase;
        const py = sy + (ey - sy) * pulsePhase;

        return (
          <g key={i} opacity={op}>
            <line
              x1={sx}
              y1={sy}
              x2={ex}
              y2={ey}
              stroke={c.line}
              strokeWidth={lg.engaged > 0.5 ? 3.5 : 2}
              strokeDasharray={lg.engaged > 0.5 ? undefined : "6 8"}
              strokeLinecap="round"
            />
            <polygon points={`${ex},${ey} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill={c.line} />
            {lg.engaged > 0.5 ? <circle cx={px} cy={py} r={5} fill={c.glow} /> : null}
            {/* Label near start */}
            <text
              x={sx + dx * 14}
              y={sy + dy * 14}
              textAnchor={dx > 0.3 ? "start" : dx < -0.3 ? "end" : "middle"}
              fill={c.line}
              style={{ fontFamily: mono, fontSize: 22, fontWeight: 500 }}
            >
              {lg.label}
            </text>
            {lg.sub ? (
              <text
                x={sx + dx * 14}
                y={sy + dy * 14 + 26}
                textAnchor={dx > 0.3 ? "start" : dx < -0.3 ? "end" : "middle"}
                fill={color.textMuted}
                style={{ fontFamily: mono, fontSize: 16 }}
              >
                {lg.sub}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Node */}
      <circle cx={cx} cy={cy} r={r * 2 * breathe} fill={color.hub} opacity={0.08} />
      <circle cx={cx} cy={cy} r={r * 1.35 * breathe} fill={color.hub} opacity={0.14} />
      <circle cx={cx} cy={cy} r={r} fill={color.bgGradient} stroke={color.hubBright} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={r * 0.82} fill="none" stroke={color.hub} strokeWidth={1.5} opacity={0.6} />
      <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle" fill={color.hubBright} style={{ fontFamily: inter, fontWeight: 700, fontSize: r * 0.5 }}>
        {label}
      </text>
    </g>
  );
};
