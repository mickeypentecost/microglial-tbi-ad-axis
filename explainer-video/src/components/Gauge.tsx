import { useCurrentFrame } from "remotion";
import { color, inter, mono } from "../theme";

// Polar point on a gauge centered at (cx,cy). Angle in degrees, standard math
// convention (0 = right, 90 = up); SVG y is flipped so up is negative.
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
};

const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = pt(cx, cy, r, a0);
  const [x1, y1] = pt(cx, cy, r, a1);
  const large = Math.abs(a0 - a1) > 180 ? 1 : 0;
  // a0 > a1 (angle decreasing left→right over the top) → sweep 1
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
};

// A 180° needle/fill gauge. value 0..1 maps left→right over the top.
export const Gauge: React.FC<{
  value: number;
  tone: "warm" | "cool";
  label: string;
  state: string;
  dim?: boolean;
  size?: number;
}> = ({ value, tone, label, state, dim = false, size = 200 }) => {
  const frame = useCurrentFrame();
  const R = size;
  const cx = R + 16;
  const cy = R + 16;

  const c = tone === "warm" ? color.warm : color.cool;
  const glow = tone === "warm" ? color.warmGlow : color.coolSecondary;

  // "Floored" quiver when pinned near max.
  const jitter = value > 0.95 ? Math.sin(frame / 2.5) * 1.4 : 0;
  const v = Math.max(0, Math.min(1, value));
  const needleDeg = 180 * (1 - v) + jitter;

  const ticks = Array.from({ length: 11 }, (_, i) => 180 - (i / 10) * 180);
  const [nx, ny] = pt(cx, cy, R * 0.82, needleDeg);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: dim ? 0.62 : 1 }}>
      <svg width={(R + 16) * 2} height={R + 40} style={{ overflow: "visible" }}>
        {/* Track */}
        <path d={arcPath(cx, cy, R, 180, 0)} fill="none" stroke={color.hairline} strokeWidth={14} strokeLinecap="round" />
        {/* Fill */}
        {v > 0.001 ? (
          <path
            d={arcPath(cx, cy, R, 180, needleDeg)}
            fill="none"
            stroke={c}
            strokeWidth={14}
            strokeLinecap="round"
            opacity={dim ? 0.7 : 1}
          />
        ) : null}
        {/* Ticks */}
        {ticks.map((deg, i) => {
          const [t0x, t0y] = pt(cx, cy, R + 12, deg);
          const [t1x, t1y] = pt(cx, cy, R + 22, deg);
          return <line key={i} x1={t0x} y1={t0y} x2={t1x} y2={t1y} stroke={color.textMuted} strokeWidth={2} opacity={0.5} />;
        })}
        {/* Max marker */}
        <circle cx={pt(cx, cy, R, 0)[0]} cy={pt(cx, cy, R, 0)[1]} r={6} fill={tone === "warm" ? c : color.textMuted} opacity={tone === "warm" ? 1 : 0.5} />
        {/* Needle + hub */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={dim ? color.textSecondary : glow} strokeWidth={5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={12} fill={color.bgGradient} stroke={c} strokeWidth={2.5} />
      </svg>

      <div style={{ marginTop: -6, textAlign: "center" }}>
        <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.08em", color: color.textSecondary }}>{label}</div>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: "0.02em",
            color: dim ? color.textMuted : c,
            marginTop: 6,
          }}
        >
          {state}
        </div>
      </div>
    </div>
  );
};
