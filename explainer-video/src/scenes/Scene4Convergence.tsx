import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Gauge } from "../components/Gauge";
import { SpatialField, HotSpot } from "../components/SpatialField";
import { Kicker } from "../components/Kicker";
import { color, inter, mono } from "../theme";

const BEAT_B = 300;

const SPOTS: HotSpot[] = [
  { x: 720, y: 560, radius: 170, strength: 1, delay: 0, type: "lesion" },
  { x: 1180, y: 440, radius: 78, strength: 0.95, delay: 22, type: "plaque" },
  { x: 1330, y: 600, radius: 78, strength: 0.95, delay: 40, type: "plaque" },
  { x: 1140, y: 660, radius: 66, strength: 0.85, delay: 56, type: "plaque" },
];

export const Scene4Convergence: React.FC = () => {
  const frame = useCurrentFrame();

  const beatA = interpolate(frame, [0, 12, 288, 318], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beatB = interpolate(frame, [BEAT_B, BEAT_B + 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Beat A — gauges
  const accel = interpolate(frame, [30, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const brake = 0.07 + 0.015 * Math.sin(frame / 9);

  // Beat B — spatial ignition
  const t = frame - BEAT_B;

  return (
    <AbsoluteFill>
      {/* ── Beat A: gauges ── */}
      <AbsoluteFill style={{ opacity: beatA, alignItems: "center", justifyContent: "center" }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
          <Kicker tone="secondary" delay={8}>
            Convergence — in both injury and Alzheimer's
          </Kicker>
        </AbsoluteFill>
        <div style={{ display: "flex", gap: 150, alignItems: "flex-start", marginTop: 40 }}>
          <Gauge value={accel} tone="warm" label="ACCELERATOR" state="FLOORED" />
          <Gauge value={brake} tone="cool" label="BRAKE" state="FAILS TO ENGAGE" dim />
        </div>
      </AbsoluteFill>

      {/* ── Beat B: spatial field ── */}
      <AbsoluteFill style={{ opacity: beatB }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
          <Kicker tone="warm" delay={BEAT_B + 6}>
            It concentrates where the damage is
          </Kicker>
        </AbsoluteFill>

        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <SpatialField x={360} y={300} w={1200} h={440} spots={SPOTS} t={t} appear={beatB} />
          {/* Markers labels */}
          <line x1={720} y1={390} x2={720} y2={430} stroke={color.warmGlow} strokeWidth={1.5} opacity={0.7 * beatB} />
          <text x={720} y={378} textAnchor="middle" fill={color.warmGlow} opacity={beatB}
            style={{ fontFamily: mono, fontSize: 22, letterSpacing: "1px" }}>
            injury lesion
          </text>
          <line x1={1230} y1={718} x2={1230} y2={690} stroke={color.warmSecondary} strokeWidth={1.5} opacity={0.7 * beatB} />
          <text x={1230} y={742} textAnchor="middle" fill={color.warmSecondary} opacity={beatB}
            style={{ fontFamily: mono, fontSize: 22, letterSpacing: "1px" }}>
            amyloid plaques
          </text>
        </svg>

        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}>
          <div style={{ opacity: beatB, fontFamily: inter, fontSize: 34, fontWeight: 600, color: color.text }}>
            at the lesion <span style={{ color: color.textMuted }}>and</span> beside the plaques
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
