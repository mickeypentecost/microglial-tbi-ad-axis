import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GenomeShrink } from "../components/GenomeShrink";
import { StatCallout } from "../components/StatCallout";
import { GeneChip } from "../components/GeneChip";
import { Kicker } from "../components/Kicker";
import { color, inter, mono } from "../theme";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const BEAT_B = 300;
const BEAT_C = 630;

// Beat B target boxes
const AX = 300, AY = 452, AW = 640, AH = 292;
const BX = 1000, BY = 452, BW = 560, BH = 292;

const ACCEL_GENES = ["APOE", "TREM2", "ITGAX", "C3", "GPNMB", "SPP1", "CD68", "CLEC7A"];
const BRAKE_GENES = ["TSG-6", "HAS2", "ANXA1", "IL10"];

export const Scene5Genetics: React.FC = () => {
  const frame = useCurrentFrame();

  const beatA = interpolate(frame, [0, 12, 285, 315], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beatB = interpolate(frame, [BEAT_B, BEAT_B + 34, BEAT_C - 12, BEAT_C + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beatC = interpolate(frame, [BEAT_C, BEAT_C + 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <BeatA opacity={beatA} frame={frame} />
      <BeatB opacity={beatB} tb={frame - BEAT_B} />
      <BeatC opacity={beatC} tc={frame - BEAT_C} />
    </AbsoluteFill>
  );
};

// ── Beat A: genome → 31% / 21× ───────────────────────────────────────────────
const BeatA: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  const progress = interpolate(frame, [20, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic });
  const connect = interpolate(frame, [150, 205], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic });

  const cx = 960;
  const genomeY = 250;
  const statTop = 470;
  const sliverBottom = genomeY + 22 + 14;

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <Kicker tone="hub" delay={8}>Then the genetics gave direction</Kicker>
      </AbsoluteFill>

      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <GenomeShrink cx={cx} y={genomeY} width={1300} progress={progress} />
        {/* Inflation connectors from the sliver out to the stat block */}
        <g opacity={connect}>
          <line x1={cx - 6} y1={sliverBottom} x2={cx - 340} y2={statTop} stroke={color.warmGlow} strokeWidth={1.5} opacity={0.5} strokeDasharray="4 5" />
          <line x1={cx + 6} y1={sliverBottom} x2={cx + 340} y2={statTop} stroke={color.warmGlow} strokeWidth={1.5} opacity={0.5} strokeDasharray="4 5" />
        </g>
      </svg>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: statTop + 20 }}>
        <div style={{ display: "flex", gap: 200, alignItems: "flex-start" }}>
          <StatCallout value={31} suffix="%" label="of inherited AD risk" tone="warm" delay={135} size={128} />
          <StatCallout value={21} suffix="×" label="enrichment" tone="hub" delay={165} size={128} />
        </div>
        <div style={{ marginTop: 30, fontFamily: mono, fontSize: 24, color: color.hubBright, letterSpacing: "0.04em", opacity: connect }}>
          S-LDSC · P = 1.1×10⁻⁵
        </div>
        <div style={{ marginTop: 26, fontFamily: inter, fontSize: 30, color: color.textSecondary, opacity: connect }}>
          concentrated in microglial regulatory DNA
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Beat B: variants load on accelerator, avoid brake ─────────────────────────
const BeatB: React.FC<{ opacity: number; tb: number }> = ({ opacity, tb }) => {
  // Raining variants onto the accelerator box
  const variants = Array.from({ length: 16 }, (_, i) => {
    const tx = AX + 46 + rand(i * 2 + 1) * (AW - 92);
    const ty = AY + 76 + rand(i * 2 + 2) * (AH - 120);
    const delay = 24 + i * 9;
    return { tx, ty, delay };
  });
  // Deflected variants over the brake box
  const deflect = Array.from({ length: 3 }, (_, i) => ({
    x: BX + 120 + i * 150,
    delay: 60 + i * 34,
  }));

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <Kicker tone="secondary" delay={4}>Risk variants load on the accelerator — and avoid the brake</Kicker>
      </AbsoluteFill>

      {/* Boxes with chips */}
      <ArmBox x={AX} y={AY} w={AW} h={AH} tone="warm" title="ACCELERATOR" genes={ACCEL_GENES} from="left" />
      <ArmBox x={BX} y={BY} w={BW} h={BH} tone="cool" title="BRAKE" genes={BRAKE_GENES} from="right" dim />

      {/* Rain overlay */}
      <svg width={1920} height={1080} style={{ position: "absolute", pointerEvents: "none" }}>
        {/* brake "closed" boundary */}
        <line x1={BX + 20} y1={BY} x2={BX + BW - 20} y2={BY} stroke={color.cool} strokeWidth={2} strokeDasharray="6 8" opacity={0.5} />
        <text x={BX + BW / 2} y={BY + BH + 40} textAnchor="middle" fill={color.textMuted} style={{ fontFamily: mono, fontSize: 20 }}>
          ✕ variants avoid the brake
        </text>
        <text x={AX + AW / 2} y={AY + AH + 40} textAnchor="middle" fill={color.warmGlow} style={{ fontFamily: mono, fontSize: 20 }}>
          ✓ loaded onto the accelerator
        </text>

        {variants.map((v, i) => {
          const p = clamp01((tb - v.delay) / 26);
          const ep = p * p; // ease-in drop
          const startY = AY - 150;
          const cy = startY + (v.ty - startY) * ep;
          const land = Math.exp(-Math.pow((tb - v.delay - 26) / 9, 2));
          return (
            <g key={i}>
              {p > 0 ? (
                <rect x={v.tx - 6} y={cy - 6} width={12} height={12} fill={color.warm} opacity={0.85} transform={`rotate(45 ${v.tx} ${cy})`} />
              ) : null}
              {p >= 1 ? <circle cx={v.tx} cy={v.ty} r={10 * land} fill={color.warmGlow} opacity={0.6 * land} /> : null}
            </g>
          );
        })}

        {deflect.map((d, i) => {
          const p = clamp01((tb - d.delay) / 30);
          const startY = BY - 150;
          const yy = startY + (BY - 10 - startY) * Math.min(1, p * 1.4);
          const xoff = interpolate(p, [0.5, 1], [0, (i % 2 === 0 ? 60 : -60)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const op = interpolate(p, [0, 0.5, 1], [0, 0.8, 0]);
          return <rect key={i} x={d.x + xoff - 5} y={yy - 5} width={10} height={10} fill={color.textSecondary} opacity={op} transform={`rotate(45 ${d.x + xoff} ${yy})`} />;
        })}
      </svg>

      {/* Enrichment statistic */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 74 }}>
        <div style={{ textAlign: "center", opacity: clamp01((tb - 200) / 36) }}>
          <div style={{ fontFamily: mono, fontSize: 22, color: color.hubBright, letterSpacing: "0.03em" }}>
            accelerator enhancers · 1.56× excess of GWAS variants · P = 0.0022
          </div>
          <div style={{ fontFamily: mono, fontSize: 17, color: color.textMuted, marginTop: 6 }}>
            persists without APOE · P = 9.5×10⁻³
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ArmBox: React.FC<{
  x: number; y: number; w: number; h: number;
  tone: "warm" | "cool"; title: string; genes: string[]; from: "left" | "right"; dim?: boolean;
}> = ({ x, y, w, h, tone, title, genes, from, dim }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, border: `1px solid ${tone === "warm" ? color.warm + "66" : color.hairline}`, background: tone === "warm" ? `${color.warm}0A` : "rgba(255,255,255,0.015)", opacity: dim ? 0.7 : 1, padding: 22 }}>
    <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 26, color: tone === "warm" ? color.warm : color.cool, marginBottom: 16 }}>{title}</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {genes.map((g, i) => <GeneChip key={g} label={g} arm={tone} from={from} compact delay={10 + i * 4} />)}
    </div>
  </div>
);

// ── Beat C: threshold (upstream) vs trigger (downstream) ──────────────────────
const BeatC: React.FC<{ opacity: number; tc: number }> = ({ opacity, tc }) => {
  const upGlow = 0.55 + 0.45 * Math.sin(tc / 12);
  // Injury/disease pulses install SPP1
  const arrivals = [120, 235];
  const spp1 = arrivals.reduce((acc, a) => acc + Math.exp(-Math.pow((tc - a) / 16, 2)), 0);
  const spp1Glow = Math.min(1, spp1);
  const coloOp = clamp01((tc - 48) / 32);

  // Traveling pulse dot on the trigger arrow (from injury node down to SPP1)
  const triggerY0 = 322, triggerY1 = 470, triggerX = 1330;
  const pulse = arrivals.map((a) => {
    const p = clamp01((tc - (a - 34)) / 34);
    return p > 0 && p < 1 ? p : -1;
  }).find((p) => p >= 0);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 88 }}>
        <Kicker tone="hub" delay={BEAT_C_LOCAL}>Threshold ≠ trigger</Kicker>
      </AbsoluteFill>

      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* Arm connector upstream → downstream */}
        <line x1={640} y1={500} x2={1180} y2={500} stroke={color.warm} strokeWidth={2.5} opacity={0.6} />
        <polygon points="1180,500 1166,493 1166,507" fill={color.warm} opacity={0.7} />

        {/* Upstream glow */}
        <circle cx={470} cy={500} r={120} fill={color.warmGlow} opacity={0.10 * upGlow} />
        {/* Trigger arrow (injury/disease → SPP1) */}
        <line x1={triggerX} y1={triggerY0} x2={triggerX} y2={triggerY1} stroke={color.warmSecondary} strokeWidth={2} strokeDasharray="5 6" opacity={0.7} />
        <polygon points={`${triggerX},${triggerY1} ${triggerX - 7},${triggerY1 - 12} ${triggerX + 7},${triggerY1 - 12}`} fill={color.warmSecondary} opacity={0.8} />
        {pulse !== undefined && pulse >= 0 ? (
          <circle cx={triggerX} cy={triggerY0 + (triggerY1 - triggerY0) * pulse} r={7} fill={color.warmSecondary} />
        ) : null}
        {/* SPP1 flare */}
        <circle cx={1330} cy={540} r={70 * spp1Glow} fill={color.warmGlow} opacity={0.22 * spp1Glow} />
      </svg>

      {/* Labels + chips */}
      <Labeled x={470} y={410} align="center">
        <div style={{ fontFamily: mono, fontSize: 20, color: color.warm, letterSpacing: "0.06em" }}>UPSTREAM · THRESHOLD</div>
        <div style={{ fontFamily: mono, fontSize: 16, color: color.textMuted, marginTop: 2 }}>inherited</div>
      </Labeled>
      <ChipAt x={410} y={500}><GeneChip label="APOE" arm="warm" delay={BEAT_C_LOCAL + 6} /></ChipAt>
      <ChipAt x={540} y={500}><GeneChip label="TREM2" arm="warm" delay={BEAT_C_LOCAL + 12} /></ChipAt>
      <Labeled x={475} y={566}>
        <div style={{ fontFamily: mono, fontSize: 17, color: color.warmGlow, letterSpacing: "0.03em", opacity: coloOp }}>colocalizes with AD risk</div>
        <div style={{ fontFamily: mono, fontSize: 16, color: color.textMuted, marginTop: 3, opacity: coloOp }}>APOE −log₁₀P = 320 · TREM2 = 26.9</div>
      </Labeled>

      <Labeled x={1330} y={286} align="center">
        <div style={{ fontFamily: mono, fontSize: 20, color: color.warmSecondary, letterSpacing: "0.06em" }}>INJURY / DISEASE</div>
      </Labeled>

      <Labeled x={1330} y={606} align="center">
        <div style={{ fontFamily: mono, fontSize: 20, color: color.warm, letterSpacing: "0.06em" }}>DOWNSTREAM · TRIGGER</div>
        <div style={{ fontFamily: mono, fontSize: 16, color: color.textMuted, marginTop: 2 }}>installed by injury / disease</div>
      </Labeled>
      <ChipAt x={1330} y={540}>
        <div style={{ transform: `scale(${1 + 0.06 * spp1Glow})`, filter: spp1Glow > 0.1 ? `drop-shadow(0 0 ${10 * spp1Glow}px ${color.warmGlow})` : undefined, opacity: 0.5 + 0.5 * spp1Glow }}>
          <GeneChip label="SPP1" arm="warm" delay={BEAT_C_LOCAL + 18} />
        </div>
      </ChipAt>
      <Labeled x={1330} y={672}>
        <div style={{ fontFamily: mono, fontSize: 17, color: color.textSecondary, letterSpacing: "0.03em", opacity: coloOp }}>no colocalization</div>
        <div style={{ fontFamily: mono, fontSize: 16, color: color.textMuted, marginTop: 3, opacity: coloOp }}>max PP4 = 0.009</div>
      </Labeled>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 96 }}>
        <div style={{ fontFamily: inter, fontSize: 32, fontWeight: 600, color: color.text }}>
          the two-hit model, <span style={{ color: color.hubBright }}>made molecular</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BEAT_C_LOCAL = 6;

const Labeled: React.FC<{ x: number; y: number; align?: "center" | "left"; children: React.ReactNode }> = ({ x, y, children }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", textAlign: "center" }}>{children}</div>
);
const ChipAt: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>{children}</div>
);
