import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Wraps a scene so it fades up at the start and out at the end, giving a quick
// crossfade through the shared background between scenes. Keeps absolute frame
// ranges intact (unlike TransitionSeries, which overlaps durations).
export const SceneFrame: React.FC<{
  children: React.ReactNode;
  fade?: number;
}> = ({ children, fade = 12 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
