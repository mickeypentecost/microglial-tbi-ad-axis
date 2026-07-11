import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Brain } from "../components/Brain";
import { color, inter, mono } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const Scene8Close: React.FC = () => {
  const frame = useCurrentFrame();

  // Pull back: brain forms and settles to stillness.
  const appear = interpolate(frame, [0, 70], [0, 1], { ...clamp, easing: easeOutCubic });
  const brainScale = interpolate(frame, [0, 80], [0.62, 1], { ...clamp, easing: easeOutCubic });

  // Receding receptor echo (the CD44 node we pull back from)
  const echo = interpolate(frame, [0, 45], [1, 0], clamp);

  // Closing line (two parts)
  const line1 = interpolate(frame, [54, 104], [0, 1], clamp);
  const line2 = interpolate(frame, [104, 154], [0, 1], clamp);
  const line1y = interpolate(frame, [54, 104], [14, 0], { ...clamp, easing: easeOutCubic });
  const line2y = interpolate(frame, [104, 154], [14, 0], { ...clamp, easing: easeOutCubic });

  // End card
  const card = interpolate(frame, [196, 246], [0, 1], { ...clamp, easing: easeOutCubic });
  const cardY = interpolate(frame, [196, 246], [16, 0], { ...clamp, easing: easeOutCubic });

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <Brain cx={960} cy={362} scale={brainScale} appear={appear} />
        {/* Receding receptor echo at brain center */}
        <circle cx={960} cy={362} r={16} fill={color.bgGradient} stroke={color.hubBright} strokeWidth={2} opacity={0.8 * echo} />
        <circle cx={960} cy={362} r={40 * echo} fill="none" stroke={color.hub} strokeWidth={1.5} opacity={0.5 * echo} />
      </svg>

      {/* Closing line */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 300 }}>
        <div style={{ textAlign: "center", maxWidth: 1300 }}>
          <div style={{ fontFamily: inter, fontSize: 42, fontWeight: 500, color: color.textSecondary, opacity: line1, transform: `translateY(${line1y}px)` }}>
            Maybe the answer isn't stopping the engine.
          </div>
          <div style={{ fontFamily: inter, fontSize: 48, fontWeight: 700, color: color.text, marginTop: 18, opacity: line2, transform: `translateY(${line2y}px)` }}>
            It's giving the brain back its <span style={{ color: color.cool }}>brakes</span>.
          </div>
        </div>
      </AbsoluteFill>

      {/* End card */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 96 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: card, transform: `translateY(${cardY}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color.clay }} />
            <span style={{ fontFamily: inter, fontWeight: 700, fontSize: 30, color: color.clay, letterSpacing: "0.01em" }}>
              Built with Claude
            </span>
          </div>
          <span style={{ fontFamily: mono, fontSize: 22, color: color.textMuted, letterSpacing: "0.02em" }}>
            github.com/mickeypentecost/microglial-tbi-ad-axis
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
