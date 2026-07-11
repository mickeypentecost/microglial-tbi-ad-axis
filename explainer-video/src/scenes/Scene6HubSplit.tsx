import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ConvergenceHub, Ligand } from "../components/ConvergenceHub";
import { Kicker } from "../components/Kicker";
import { SplitStage } from "../components/SplitStage";
import { CD44Chart } from "../charts/CD44Chart";
import { color, inter } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Split-stage variant of the CD44 hub scene.
 * Left: the CD44 convergence hub (SPP1 engaged / TSG-6 fading). Right: the real
 * Fig 5C four-modality bars showing CD44 up across independent measurements.
 */
export const Scene6HubSplit: React.FC = () => {
  const frame = useCurrentFrame();

  const ligands: Ligand[] = [
    { angleDeg: 210, dist: 150, tone: "warm", label: "SPP1", sub: "engaged", engaged: interpolate(frame, [40, 110], [0, 1], clamp) },
    { angleDeg: 330, dist: 150, tone: "cool", label: "TSG-6", sub: "falling", engaged: interpolate(frame, [60, 160], [0.6, 0.18], clamp) },
  ];

  const left = (
    <svg width={520} height={440} style={{ overflow: "visible" }}>
      <ConvergenceHub cx={260} cy={220} r={78} ligands={ligands} t={frame} />
    </svg>
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 82 }}>
        <Kicker tone="hub" delay={8}>Both arms read out at one receptor</Kicker>
      </AbsoluteFill>

      <SplitStage
        left={left}
        right={<CD44Chart width={760} height={430} startFrame={54} stagger={9} />}
        rightLabel="CD44 up across four independent modalities"
        ratio={0.42}
        shiftFrame={30}
        revealFrame={46}
      />

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 88 }}>
        <div style={{ fontFamily: inter, fontSize: 32, fontWeight: 600, color: color.text, opacity: interpolate(frame, [70, 100], [0, 1], clamp) }}>
          one receptor decides the outcome
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
