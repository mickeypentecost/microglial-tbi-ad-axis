import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GenomeShrink } from "../components/GenomeShrink";
import { StatCallout } from "../components/StatCallout";
import { Kicker } from "../components/Kicker";
import { SplitStage } from "../components/SplitStage";
import { HeritabilityChart } from "../charts/HeritabilityChart";
import { color, inter } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Split-stage variant of the Genetics scene.
 * Left: the genome collapsing to its 1.5% sliver (concept). Right: the real
 * S-LDSC heritability bars — 1.5% of genome → 31% of AD risk, 21x, P (data).
 */
export const Scene5GeneticsSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [20, 150], [0, 1], { ...clamp, easing: easeOutCubic });

  const left = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <svg width={560} height={130} style={{ overflow: "visible" }}>
        <GenomeShrink cx={280} y={54} width={500} progress={progress} />
      </svg>
      <StatCallout value={31} suffix="%" label="of inherited AD risk" tone="warm" delay={150} size={118} />
    </div>
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <Kicker tone="hub" delay={8}>Then the genetics gave direction</Kicker>
      </AbsoluteFill>

      <SplitStage
        left={left}
        right={<HeritabilityChart width={540} height={520} startFrame={70} />}
        rightLabel="S-LDSC · microglial regulatory DNA"
        ratio={0.46}
        shiftFrame={44}
        revealFrame={60}
      />

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 92 }}>
        <div style={{ fontFamily: inter, fontSize: 30, fontWeight: 600, color: color.text, opacity: interpolate(frame, [120, 160], [0, 1], clamp) }}>
          inherited risk loads on the accelerator <span style={{ color: color.textMuted }}>—</span> not the brake
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
