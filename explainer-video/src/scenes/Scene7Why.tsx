import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ConvergenceHub, Ligand } from "../components/ConvergenceHub";
import { InterventionCard } from "../components/InterventionCard";
import { Kicker } from "../components/Kicker";
import { color, inter, mono } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const HUB_X = 560;
const HUB_Y = 560;
const HUB_R = 84;

export const Scene7Why: React.FC = () => {
  const frame = useCurrentFrame();

  // "Block CD44" moment: both ligands cut → lose the brake too.
  const block = interpolate(frame, [78, 108, 150, 182], [0, 1, 1, 0], clamp);

  // Rebalance: SPP1 eases from floored; TSG-6 is restored by the interventions.
  const warmEng = interpolate(frame, [285, 370], [1, 0.7], clamp) * (1 - 0.85 * block);
  const coolEng = interpolate(frame, [290, 400], [0.2, 0.82], clamp) * (1 - 0.85 * block);

  const ligands: Ligand[] = [
    { angleDeg: 210, dist: 190, tone: "warm", label: "SPP1", sub: block > 0.3 ? "cut" : "accelerator", engaged: warmEng },
    { angleDeg: 330, dist: 190, tone: "cool", label: "TSG-6", sub: block > 0.3 ? "cut" : coolEng > 0.5 ? "restored" : "brake", engaged: coolEng },
  ];

  const resolved = interpolate(frame, [300, 400], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 66 }}>
        <Kicker tone="hub" delay={8}>A circuit with named parts + testable predictions</Kicker>
      </AbsoluteFill>

      {/* Hub (left) */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <ConvergenceHub cx={HUB_X} cy={HUB_Y} r={HUB_R} ligands={ligands} t={frame} />

        {/* Block CD44 → red X over hub */}
        <g opacity={block}>
          <line x1={HUB_X - 60} y1={HUB_Y - 60} x2={HUB_X + 60} y2={HUB_Y + 60} stroke={color.warm} strokeWidth={5} strokeLinecap="round" />
          <line x1={HUB_X + 60} y1={HUB_Y - 60} x2={HUB_X - 60} y2={HUB_Y + 60} stroke={color.warm} strokeWidth={5} strokeLinecap="round" />
        </g>

        {/* Resolution halo as it rebalances */}
        <circle cx={HUB_X} cy={HUB_Y} r={HUB_R * 2.3} fill="none" stroke={color.cool} strokeWidth={2} opacity={0.4 * resolved} strokeDasharray="3 9" />
      </svg>

      {/* Hub state label */}
      <div style={{ position: "absolute", left: HUB_X, top: HUB_Y + HUB_R + 150, transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ position: "relative", height: 30 }}>
          <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontFamily: mono, fontSize: 22, letterSpacing: "0.06em", color: color.warm, opacity: 1 - resolved }}>
            IMBALANCED
          </span>
          <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontFamily: mono, fontSize: 22, letterSpacing: "0.06em", color: color.cool, opacity: resolved }}>
            BIASED TO RESOLUTION
          </span>
        </div>
      </div>

      {/* Intervention cards (right) */}
      <div style={{ position: "absolute", left: 1010, top: 320, display: "flex", flexDirection: "column", gap: 26 }}>
        <InterventionCard
          verdict="reject"
          title="Block the receptor entirely"
          desc="antibody or antagonist — silences both ligands"
          delay={30}
          strikeAt={150}
        />
        <InterventionCard
          verdict="accept"
          title="Block the inflammatory ligand"
          desc="antagonize SPP1 — remove the accelerator push"
          delay={200}
        />
        <InterventionCard
          verdict="accept"
          title="Provide TSG-6 in trans"
          desc="exogenous TSG-6 — restore the missing brake"
          delay={266}
        />
      </div>

      {/* Footnote */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 }}>
        <div style={{ fontFamily: inter, fontSize: 26, color: color.textMuted, opacity: interpolate(frame, [330, 380], [0, 1], clamp) }}>
          don't block the receptor — <span style={{ color: color.cool }}>rebalance the circuit</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
