import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color, mono, layout } from "../theme";

// An ink-stamp mark: a padlock glyph + caption that stamps down (overshoot
// scale + slight rotation settle) to assert the a priori commitment.
export const LockStamp: React.FC<{
  delay?: number;
  text?: string;
}> = ({ delay = 0, text = "fixed a priori · public data only" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.7 },
  });
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(enter, [0, 1], [1.35, 1]);
  const rot = interpolate(enter, [0, 1], [-5, 0]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 26px",
        borderRadius: 10,
        border: `2px solid ${color.textMuted}`,
        opacity,
        transform: `scale(${scale}) rotate(${rot}deg)`,
      }}
    >
      <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
        <rect x="4" y="10.5" width="16" height="11" rx="2.5" stroke={color.textSecondary} strokeWidth="1.8" />
        <path d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5" stroke={color.textSecondary} strokeWidth="1.8" />
        <circle cx="12" cy="15.5" r="1.7" fill={color.textSecondary} />
      </svg>
      <span
        style={{
          fontFamily: mono,
          fontSize: 24,
          letterSpacing: layout.tracking,
          textTransform: "uppercase",
          color: color.textSecondary,
        }}
      >
        {text}
      </span>
    </div>
  );
};
