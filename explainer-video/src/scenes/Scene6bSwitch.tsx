import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Kicker } from "../components/Kicker";
import { SplitStage } from "../components/SplitStage";
import { SwitchAblationChart } from "../charts/SwitchAblationChart";
import { color, inter, mono } from "../theme";

/**
 * Scene 6b — the regulatory switch (NEW, sits between Scene6Hub and Scene7Why).
 *
 * Left: a simple two-lever switch animation in the film's grammar — NF-κB
 * throws the accelerator ON (warm), MEF2C holds it OFF (cool). Right: the real
 * in-silico ablation bars (Fig 4b/c) — NF-κB closes the accelerator specifically
 * (P = 1.9e-5), MEF2 does NOT close the brake (n.s.), the visual proof that
 * MEF2C is a repressor, not an identity factor.
 *
 * Pure theme tokens; no PNG assets. New file — nothing existing is touched.
 */
export const Scene6bSwitch: React.FC = () => {
  const frame = useCurrentFrame();

  // NF-κB throws ON (accelerator rises); MEF2C clamp eases in and holds
  const on = interpolate(frame, [40, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const clampReveal = interpolate(frame, [70, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const SwitchDiagram = (
    <svg width={560} height={520} style={{ overflow: "visible" }}>
      {/* the accelerator lever — a bar that swings UP (on) around a pivot */}
      <line x1={120} y1={380} x2={120} y2={200} stroke={color.hairline} strokeWidth={2} />
      <circle cx={120} cy={380} r={8} fill={color.textMuted} />
      {/* lever arm rotates from horizontal (off) toward up (on) */}
      <g transform={`rotate(${-70 * on} 120 380)`}>
        <line x1={120} y1={380} x2={300} y2={380} stroke={color.warm} strokeWidth={10} strokeLinecap="round" />
        <circle cx={300} cy={380} r={13} fill={color.warm} />
      </g>
      <text x={120} y={430} textAnchor="middle" fill={color.warm} style={{ fontFamily: inter, fontSize: 22, fontWeight: 700 }}>ACCELERATOR</text>

      {/* NF-κB pushes the lever ON — arrow from left */}
      <g opacity={on}>
        <text x={70} y={150} textAnchor="middle" fill={color.warm} style={{ fontFamily: inter, fontSize: 26, fontWeight: 700 }}>NF-\u03baB</text>
        <text x={70} y={178} textAnchor="middle" fill={color.textMuted} style={{ fontFamily: mono, fontSize: 15 }}>activator</text>
        <line x1={70} y1={196} x2={110} y2={300} stroke={color.warm} strokeWidth={3} markerEnd="url(#arrOn)" />
      </g>

      {/* MEF2C clamps it OFF — a cool bracket holding the lever down */}
      <g opacity={clampReveal}>
        <text x={430} y={150} textAnchor="middle" fill={color.cool} style={{ fontFamily: inter, fontSize: 26, fontWeight: 700 }}>MEF2C</text>
        <text x={430} y={178} textAnchor="middle" fill={color.textMuted} style={{ fontFamily: mono, fontSize: 15 }}>repressor</text>
        <line x1={430} y1={196} x2={330} y2={330} stroke={color.cool} strokeWidth={3} strokeDasharray="6 5" markerEnd="url(#arrOff)" />
        <text x={430} y={420} textAnchor="middle" fill={color.cool} style={{ fontFamily: mono, fontSize: 16 }}>holds it off</text>
      </g>

      <defs>
        <marker id="arrOn" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={color.warm} /></marker>
        <marker id="arrOff" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={color.cool} /></marker>
      </defs>
    </svg>
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 72 }}>
        <Kicker tone="secondary" delay={8}>Two levers operate the accelerator</Kicker>
      </AbsoluteFill>

      <SplitStage
        left={SwitchDiagram}
        right={<SwitchAblationChart width={540} height={460} startFrame={44} stagger={14} />}
        rightLabel={`in-silico motif ablation \u00b7 NF-\u03baB closes accelerator, P = 1.9\u00d710\u207b\u2075`}
        ratio={0.46}
        shiftFrame={30}
        revealFrame={44}
      />

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 84 }}>
        <div style={{ fontFamily: inter, fontSize: 30, fontWeight: 600, color: color.text, opacity: interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          arm-specific levers — <span style={{ color: color.warm }}>NF-\u03baB on</span>, <span style={{ color: color.cool }}>MEF2C off</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
