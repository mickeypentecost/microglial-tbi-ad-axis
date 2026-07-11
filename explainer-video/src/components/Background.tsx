import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, layout } from "../theme";

// Slow-drifting dot grid + gradient + vignette. Low opacity, sits behind content.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const spacing = 64;
  const drift = (frame * 0.15) % spacing; // gentle diagonal creep

  return (
    <AbsoluteFill>
      {/* Base gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 120% at 50% 40%, ${color.bgGradient} 0%, ${color.bgBase} 70%)`,
        }}
      />

      {/* Drifting dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${color.hairline} 1.4px, transparent 1.4px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
          backgroundPosition: `${drift}px ${drift * 0.6}px`,
          opacity: 0.5,
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)`,
        }}
      />

      {/* Faint frame hairline for the "lab instrument" feel */}
      <AbsoluteFill
        style={{
          margin: layout.sidePadding * 0.4,
          border: `1px solid ${color.hairline}`,
          borderRadius: 6,
          opacity: 0.35,
        }}
      />
    </AbsoluteFill>
  );
};
