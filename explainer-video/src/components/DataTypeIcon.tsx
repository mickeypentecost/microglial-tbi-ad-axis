import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color, inter, mono } from "../theme";

// Small H / M species markers.
const SpeciesTag: React.FC<{ human?: boolean; mouse?: boolean }> = ({ human, mouse }) => {
  const pill = (letter: string, label: string) => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px 4px 6px",
        borderRadius: 999,
        border: `1px solid ${color.hairline}`,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          background: color.hub,
          color: color.bgBase,
          fontFamily: mono,
          fontWeight: 600,
          fontSize: 14,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {letter}
      </span>
      <span style={{ fontFamily: mono, fontSize: 15, color: color.textSecondary }}>{label}</span>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {human ? pill("H", "human") : null}
      {mouse ? pill("M", "mouse") : null}
    </div>
  );
};

// A labeled data-type card that "snaps" in (spring overshoot).
export const DataTypeIcon: React.FC<{
  title: string;
  sub: string;
  human?: boolean;
  mouse?: boolean;
  accent: string;
  delay?: number;
  children: React.ReactNode; // 56x56 glyph
}> = ({ title, sub, human, mouse, accent, delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 13, mass: 0.7 } });
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(enter, [0, 1], [0.8, 1]);
  const y = interpolate(enter, [0, 1], [26, 0]);

  return (
    <div
      style={{
        width: 340,
        padding: "34px 24px 28px",
        borderRadius: 18,
        border: `1px solid ${color.hairline}`,
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
      }}
    >
      {/* Glyph in a tinted rounded square */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 22,
          background: `${accent}1A`,
          border: `1px solid ${accent}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>

      <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 27, color: color.text }}>{title}</div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 16,
          color: color.textSecondary,
          textAlign: "center",
          lineHeight: 1.4,
          minHeight: 44,
        }}
      >
        {sub}
      </div>
      <SpeciesTag human={human} mouse={mouse} />
    </div>
  );
};
