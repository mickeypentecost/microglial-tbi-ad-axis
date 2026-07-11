import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ConvergenceHub, Ligand } from "../components/ConvergenceHub";
import { AstrocyteRing } from "../components/AstrocyteRing";
import { AnimatedBar } from "../components/AnimatedBar";
import { Kicker } from "../components/Kicker";
import { color, inter, mono } from "../theme";

const BEAT_B = 330;

const HUB_X = 960;
const HUB_Y = 566;
const HUB_R = 90;

// CD44 log2 fold-change across four measurements (real values). Heights are
// normalized by NORM so the ~8× span fits one axis; the short 0.13 bar is
// honest — its ** mark shows it's still highly significant.
const NORM = 1.2;
const CD44_BARS = [
  { label: "bulk RNA\nsorted astrocytes", fc: 1.04, sig: "*" },
  { label: "plaque protein\nmouse proteome", fc: 0.72, sig: "†" },
  { label: "AD protein\nhuman brain", fc: 0.26, sig: "**" },
  { label: "snRNA-seq\nmicroglia, injury", fc: 0.13, sig: "**" },
];
const TSG6_BAR = { fc: -0.34, sig: "*" };

export const Scene6Hub: React.FC = () => {
  const frame = useCurrentFrame();

  const beatA = interpolate(frame, [0, 14, 306, 336], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beatB = interpolate(frame, [BEAT_B, BEAT_B + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ligands: Ligand[] = [
    { angleDeg: 215, dist: 210, tone: "warm", label: "SPP1 / osteopontin", sub: "engaged", engaged: interpolate(frame, [40, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) },
    { angleDeg: 325, dist: 210, tone: "cool", label: "TSG-6", sub: "falling", engaged: interpolate(frame, [60, 160], [0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) },
  ];

  // Astrocyte feed pulse (top → hub)
  const feedPulse = ((frame / 40) % 1);
  const fy0 = 366, fy1 = HUB_Y - HUB_R - 8;

  return (
    <AbsoluteFill>
      {/* ── Beat A: the hub ── */}
      <AbsoluteFill style={{ opacity: beatA }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 66 }}>
          <Kicker tone="hub" delay={8}>Both arms read out at one receptor</Kicker>
        </AbsoluteFill>

        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <AstrocyteRing cx={HUB_X} cy={236} ringR={104} count={7} t={frame} label="astrocytes ring the plaque" />
          {/* Astrocyte → hub feed */}
          <line x1={HUB_X} y1={fy0} x2={HUB_X} y2={fy1} stroke={color.hub} strokeWidth={2.5} opacity={0.7} />
          <polygon points={`${HUB_X},${fy1} ${HUB_X - 7},${fy1 - 12} ${HUB_X + 7},${fy1 - 12}`} fill={color.hub} opacity={0.8} />
          <circle cx={HUB_X} cy={fy0 + (fy1 - fy0) * feedPulse} r={5} fill={color.hubBright} />
          <text x={HUB_X + 20} y={(fy0 + fy1) / 2} fill={color.textMuted} style={{ fontFamily: mono, fontSize: 16 }}>
            feed the same receptor
          </text>

          <ConvergenceHub cx={HUB_X} cy={HUB_Y} r={HUB_R} ligands={ligands} t={frame} />
        </svg>
      </AbsoluteFill>

      {/* ── Beat B: bars ── */}
      <AbsoluteFill style={{ opacity: beatB }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
          <Kicker tone="secondary" delay={BEAT_B + 6}>CD44 ↑ across 4 measurements · both species — TSG-6 ↓</Kicker>
        </AbsoluteFill>

        {/* Baseline */}
        <div style={{ position: "absolute", left: 380, right: 380, top: 566, height: 1, background: color.hairline }} />

        {/* CD44 group (rising) */}
        <div style={{ position: "absolute", left: 430, top: 566 - 220, display: "flex", gap: 40, alignItems: "flex-end" }}>
          {CD44_BARS.map((b, i) => (
            <AnimatedBar key={b.label} value={b.fc / NORM} fc={b.fc} sig={b.sig} tone="hub" label={b.label} direction="up" delay={BEAT_B + 30 + i * 12} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 430, top: 566 - 220 - 44, fontFamily: inter, fontWeight: 700, fontSize: 30, color: color.hubBright }}>
          CD44 <span style={{ fontFamily: mono, fontSize: 18, fontWeight: 400, color: color.textMuted }}>↑ receptor</span>
        </div>

        {/* TSG-6 group (falling) */}
        <div style={{ position: "absolute", left: 1180, top: 566 }}>
          <AnimatedBar value={Math.abs(TSG6_BAR.fc) / NORM} fc={TSG6_BAR.fc} sig={TSG6_BAR.sig} tone="cool" label={"TSG-6 ligand\nsorted astrocytes"} direction="down" delay={BEAT_B + 40} />
        </div>
        <div style={{ position: "absolute", left: 1180, top: 566 - 44, fontFamily: inter, fontWeight: 700, fontSize: 30, color: color.cool }}>
          TSG-6 <span style={{ fontFamily: mono, fontSize: 18, fontWeight: 400, color: color.textMuted }}>↓ brake ligand</span>
        </div>

        {/* Significance + axis key */}
        <div style={{ position: "absolute", right: 0, left: 0, bottom: 158, textAlign: "center", fontFamily: mono, fontSize: 16, color: color.textMuted, opacity: interpolate(frame, [BEAT_B + 60, BEAT_B + 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          log₂ fold-change  ·  ** P&lt;0.01 · * P&lt;0.05 · † P&lt;0.1
        </div>

        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 96 }}>
          <div style={{ fontFamily: inter, fontSize: 34, fontWeight: 600, color: color.text, opacity: beatB }}>
            one receptor decides the outcome
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
