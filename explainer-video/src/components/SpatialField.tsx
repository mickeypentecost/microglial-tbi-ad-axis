import { color } from "../theme";

export type HotSpot = {
  x: number;
  y: number;
  radius: number;
  strength: number;
  delay: number; // frames after ignition start
  type: "lesion" | "plaque";
  label?: string;
  labelAt?: [number, number];
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// A tissue field of dots that ignite warm as a function of distance from each
// hot spot, with an expanding shock ring per spot. `t` = frames since ignition;
// `appear` = overall fade-in (0..1).
export const SpatialField: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  spots: HotSpot[];
  t: number;
  appear: number;
  spacing?: number;
}> = ({ x, y, w, h, spots, t, appear, spacing = 26 }) => {
  const dots: React.ReactNode[] = [];

  const cols = Math.floor(w / spacing);
  const rows = Math.floor(h / spacing);
  const ox = x + (w - cols * spacing) / 2;
  const oy = y + (h - rows * spacing) / 2;

  for (let r = 0; r <= rows; r++) {
    for (let col = 0; col <= cols; col++) {
      const px = ox + col * spacing;
      const py = oy + r * spacing;

      let intensity = 0;
      for (const s of spots) {
        const dt = t - s.delay;
        if (dt <= 0) continue;
        const d = Math.hypot(px - s.x, py - s.y);
        const igniteProg = clamp01(dt / 45);
        const base = s.strength * Math.exp(-Math.pow(d / s.radius, 2)) * igniteProg;
        const waveR = dt * 4;
        const ring =
          s.strength * 0.5 * Math.exp(-Math.pow((d - waveR) / 16, 2)) * clamp01(1 - dt / 70);
        intensity += base + ring;
      }
      intensity = clamp01(intensity) * appear;

      const key = `${r}-${col}`;
      // Base neutral dot
      dots.push(<circle key={`b${key}`} cx={px} cy={py} r={1.5} fill={color.hairline} opacity={0.4 * appear} />);
      if (intensity > 0.03) {
        dots.push(
          <circle
            key={`w${key}`}
            cx={px}
            cy={py}
            r={1.8 + intensity * 3.4}
            fill={intensity > 0.6 ? color.warmGlow : color.warm}
            opacity={intensity}
          />,
        );
      }
    }
  }

  return (
    <g>
      {dots}
      {/* Hot-spot markers */}
      {spots.map((s, i) => {
        const on = clamp01((t - s.delay) / 30) * appear;
        if (s.type === "lesion") {
          return (
            <g key={i} opacity={on}>
              <ellipse
                cx={s.x}
                cy={s.y}
                rx={s.radius * 0.7}
                ry={s.radius * 0.52}
                fill="none"
                stroke={color.warmGlow}
                strokeWidth={2}
                strokeDasharray="6 7"
                opacity={0.8}
              />
            </g>
          );
        }
        return (
          <g key={i} opacity={on}>
            <circle cx={s.x} cy={s.y} r={13} fill="none" stroke={color.warmGlow} strokeWidth={2} />
            <circle cx={s.x} cy={s.y} r={7} fill="none" stroke={color.warmSecondary} strokeWidth={1.6} opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
};
