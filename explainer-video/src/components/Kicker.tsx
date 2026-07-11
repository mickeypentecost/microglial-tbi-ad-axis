import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color, mono, layout } from "../theme";

// Uppercase section label with wide tracking. Springs in.
export const Kicker: React.FC<{
  children: React.ReactNode;
  delay?: number;
  tone?: keyof typeof toneColor;
  align?: "left" | "center";
}> = ({ children, delay = 0, tone = "muted", align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [12, 0]);

  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: 24,
        letterSpacing: layout.tracking,
        textTransform: "uppercase",
        color: toneColor[tone],
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: align,
      }}
    >
      {children}
    </div>
  );
};

const toneColor = {
  muted: color.textMuted,
  secondary: color.textSecondary,
  warm: color.warm,
  cool: color.cool,
  hub: color.hubBright,
} as const;
