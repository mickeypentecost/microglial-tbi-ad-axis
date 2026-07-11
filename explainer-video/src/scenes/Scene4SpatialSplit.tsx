import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SpatialField, HotSpot } from "../components/SpatialField";
import { Kicker } from "../components/Kicker";
import { SplitStage } from "../components/SplitStage";
import { SpatialGradient } from "../charts/SpatialGradient";
import { color, mono } from "../theme";

/**
 * WORKED EXAMPLE — split-stage spatial beat.
 *
 * Left: the SpatialField ignition (the tissue lighting up at the damage).
 * Right: the real localization gradient — accelerator score climbing toward the
 * damage (paper Fig 2c/2f), redrawn in the film's grammar.
 *
 * This variant shows the LESION (TBI) pairing. For the PLAQUE (AD) variant,
 * swap the SpatialField `spots` to `type: "plaque"` and set
 * <SpatialGradient mode="plaque" />. Both gradients read damage→far left-to-
 * right, so a plaque panel and a lesion panel line up when shown in sequence.
 *
 * NEW file — does not touch Scene4Convergence.tsx.
 */

const LESION_SPOTS: HotSpot[] = [
  { x: 300, y: 210, radius: 150, strength: 1, delay: 0, type: "lesion" },
];

export const Scene4SpatialSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const field = (
    <svg width={560} height={460} style={{ overflow: "visible" }}>
      <SpatialField x={20} y={20} w={520} h={420} spots={LESION_SPOTS} t={frame} appear={appear} />
      <text x={300} y={392} textAnchor="middle" fill={color.warmGlow} opacity={appear} style={{ fontFamily: mono, fontSize: 20, letterSpacing: "1px" }}>
        injury lesion
      </text>
    </svg>
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 72 }}>
        <Kicker tone="secondary" delay={8}>Concentrated where the damage is</Kicker>
      </AbsoluteFill>

      <SplitStage
        left={field}
        right={<SpatialGradient mode="lesion" width={600} height={450} startFrame={44} />}
        rightLabel="accelerator score rises toward the lesion"
        ratio={0.46}
        shiftFrame={30}
        revealFrame={44}
      />

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 84 }}>
        <div style={{ fontFamily: "inherit", fontSize: 30, fontWeight: 600, color: color.text, opacity: interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          the closer to the damage, the higher the accelerator
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
