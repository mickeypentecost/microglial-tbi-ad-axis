import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color, inter } from "../theme";

// Animated heading. Two modes:
//   - default: springs up + fades in as a whole.
//   - typewriter: reveals character by character with a blinking caret.
export const SceneTitle: React.FC<{
  children: string;
  delay?: number;
  fontSize?: number;
  typewriter?: boolean;
  charsPerFrame?: number;
  align?: "left" | "center";
}> = ({
  children,
  delay = 0,
  fontSize = 96,
  typewriter = false,
  charsPerFrame = 0.6,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const base: React.CSSProperties = {
    fontFamily: inter,
    fontWeight: 700,
    fontSize,
    lineHeight: 1.05,
    color: color.text,
    textAlign: align,
    letterSpacing: "-0.01em",
  };

  if (typewriter) {
    const started = local >= 0;
    const shown = started
      ? Math.min(children.length, Math.floor(local * charsPerFrame))
      : 0;
    const done = shown >= children.length;
    const caretOn = Math.floor(frame / 8) % 2 === 0;
    // Caret only exists once typing begins; blinks after the line completes.
    const showCaret = started && (!done || caretOn);
    return (
      <h1 style={base}>
        {started ? children.slice(0, shown) : " "}
        {showCaret ? (
          <span style={{ color: color.warmGlow, fontWeight: 400 }}>|</span>
        ) : null}
      </h1>
    );
  }

  const enter = spring({ frame: local, fps, config: { damping: 200 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [24, 0]);

  return (
    <h1 style={{ ...base, opacity, transform: `translateY(${y}px)` }}>
      {children}
    </h1>
  );
};
