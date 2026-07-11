import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Gauge } from "../components/Gauge";
import { Kicker } from "../components/Kicker";
import { SplitStage } from "../components/SplitStage";
import { SpatialField, HotSpot } from "../components/SpatialField";
import { ForestChart } from "../charts/ForestChart";
import { ScatterChart } from "../charts/ScatterChart";
import { SpatialGradient } from "../charts/SpatialGradient";
import { color, inter, mono } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const MiniTitle: React.FC<{ tone: string; children: React.ReactNode }> = ({ tone, children }) => (
  <div style={{ fontFamily: mono, fontSize: 16, color: tone, letterSpacing: "0.05em", textAlign: "center", marginBottom: 2 }}>
    {children}
  </div>
);

// Beat B1 (AD plaques) and B2 (TBI lesion) each get their own spatial field.
const B1_IGNITE = 300;
const B2_IGNITE = 452;

const PLAQUE_SPOTS: HotSpot[] = [
  { x: 205, y: 150, radius: 80, strength: 0.95, delay: 0, type: "plaque" },
  { x: 430, y: 120, radius: 80, strength: 0.95, delay: 16, type: "plaque" },
  { x: 540, y: 300, radius: 78, strength: 0.9, delay: 32, type: "plaque" },
  { x: 300, y: 350, radius: 72, strength: 0.85, delay: 48, type: "plaque" },
  { x: 150, y: 320, radius: 66, strength: 0.8, delay: 62, type: "plaque" },
];
const LESION_SPOTS: HotSpot[] = [
  { x: 350, y: 220, radius: 165, strength: 1, delay: 0, type: "lesion" },
];

/**
 * Split-stage Convergence — three beats, each with room to read:
 *   A: gauges + convergence receipts (ForestChart reproducibility + ScatterChart "up in both").
 *   B1: AD plaque field + plaque localization gradient.
 *   B2: TBI lesion field + lesion localization gradient.
 */
export const Scene4ConvergenceSplit: React.FC = () => {
  const frame = useCurrentFrame();

  const beatA = interpolate(frame, [0, 14, 280, 306], [0, 1, 1, 0], clamp);
  const beatB1 = interpolate(frame, [294, 330, 434, 462], [0, 1, 1, 0], clamp);
  const beatB2 = interpolate(frame, [448, 486], [0, 1], clamp);

  // Within beat A the right side sequences: scatter appears then disappears,
  // then the forest appears (flows with the narration).
  const scatterOp = interpolate(frame, [40, 64, 130, 156], [0, 1, 1, 0], clamp);
  const forestOp = interpolate(frame, [162, 188], [0, 1], clamp);

  // Beat A gauges
  const accel = interpolate(frame, [30, 140], [0, 1], { ...clamp, easing: easeOutCubic });
  const brake = 0.07 + 0.015 * Math.sin(frame / 9);
  const gauges = (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
      <Gauge value={accel} tone="warm" label="ACCELERATOR" state="FLOORED" size={130} />
      <Gauge value={brake} tone="cool" label="BRAKE" state="FAILS TO ENGAGE" dim size={130} />
    </div>
  );

  const plaqueField = (
    <svg width={700} height={480} style={{ overflow: "visible" }}>
      <SpatialField x={0} y={0} w={700} h={430} spots={PLAQUE_SPOTS} t={frame - B1_IGNITE} appear={beatB1} />
      <text x={350} y={464} textAnchor="middle" fill={color.warmSecondary} opacity={beatB1} style={{ fontFamily: mono, fontSize: 22, letterSpacing: "1px" }}>
        amyloid plaques
      </text>
    </svg>
  );

  const lesionField = (
    <svg width={700} height={480} style={{ overflow: "visible" }}>
      <SpatialField x={0} y={0} w={700} h={430} spots={LESION_SPOTS} t={frame - B2_IGNITE} appear={beatB2} />
      <text x={350} y={464} textAnchor="middle" fill={color.warmGlow} opacity={beatB2} style={{ fontFamily: mono, fontSize: 22, letterSpacing: "1px" }}>
        injury lesion
      </text>
    </svg>
  );

  return (
    <AbsoluteFill>
      {/* ── Beat A — convergence ── */}
      <AbsoluteFill style={{ opacity: beatA }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 84 }}>
          <Kicker tone="secondary" delay={8}>Convergence — in both injury and Alzheimer's</Kicker>
        </AbsoluteFill>
        <SplitStage
          left={gauges}
          right={
            <div style={{ position: "relative", width: 740, height: 470 }}>
              {/* Scatter — appears first, then disappears */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: scatterOp }}>
                <MiniTitle tone={color.warmSecondary}>up in both — injury &amp; Alzheimer's</MiniTitle>
                <ScatterChart width={480} height={420} startFrame={46} stagger={2} />
              </div>
              {/* Forest — appears after the scatter clears */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: forestOp }}>
                <MiniTitle tone={color.warm}>reproduces across independent datasets</MiniTitle>
                <ForestChart width={720} height={300} startFrame={168} stagger={9} />
              </div>
            </div>
          }
          ratio={0.4}
          shiftFrame={30}
          revealFrame={44}
        />
        <BottomCaption opacity={interpolate(frame, [60, 92], [0, 1], clamp)}>
          the same accelerator — up in disease <span style={{ color: color.textMuted }}>and</span> in injury
        </BottomCaption>
      </AbsoluteFill>

      {/* ── Beat B1 — AD plaques ── */}
      <AbsoluteFill style={{ opacity: beatB1 }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 84 }}>
          <Kicker tone="warm" delay={300}>It concentrates around the amyloid plaques</Kicker>
        </AbsoluteFill>
        <SplitStage
          left={plaqueField}
          right={<SpatialGradient mode="plaque" width={650} height={460} startFrame={344} />}
          rightLabel="accelerator score rises toward the plaque"
          ratio={0.5}
          shiftFrame={300}
          revealFrame={316}
        />
        <BottomCaption opacity={interpolate(frame, [350, 384], [0, 1], clamp)}>
          the closer to the plaque, the higher the accelerator
        </BottomCaption>
      </AbsoluteFill>

      {/* ── Beat B2 — TBI lesion ── */}
      <AbsoluteFill style={{ opacity: beatB2 }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 84 }}>
          <Kicker tone="warm" delay={452}>And at the injury lesion</Kicker>
        </AbsoluteFill>
        <SplitStage
          left={lesionField}
          right={<SpatialGradient mode="lesion" width={650} height={460} startFrame={500} />}
          rightLabel="accelerator score rises toward the lesion"
          ratio={0.5}
          shiftFrame={452}
          revealFrame={470}
        />
        <BottomCaption opacity={interpolate(frame, [506, 540], [0, 1], clamp)}>
          the closer to the lesion, the higher the accelerator
        </BottomCaption>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BottomCaption: React.FC<{ opacity: number; children: React.ReactNode }> = ({ opacity, children }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 84 }}>
    <div style={{ fontFamily: inter, fontSize: 32, fontWeight: 600, color: color.text, opacity }}>{children}</div>
  </AbsoluteFill>
);
