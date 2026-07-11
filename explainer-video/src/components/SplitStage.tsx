import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { layout, color, mono } from "../theme";

/**
 * One shared dark stage, split into a concept side (the hero animation) and a
 * data side (a theme-matched chart). NOT a split screen — both halves share the
 * film's background and palette so it reads as a single composition.
 *
 * The `left` content shifts in from center to the left half; the `right`
 * content fades/rises in slightly later. A hairline divider (optional) sits
 * between them at very low opacity.
 *
 * Typical use inside a scene:
 *   <SplitStage
 *     left={<Gauge ... />}
 *     right={<ForestChart startFrame={0} />}
 *     rightLabel="reproduces across independent datasets"
 *     shiftFrame={0} revealFrame={18}
 *   />
 */
export const SplitStage: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  /** caption under the data side, in mono (your section-label type) */
  rightLabel?: string;
  /** left/right split fraction (0..1) for the left column; default 0.5 */
  ratio?: number;
  /** frame at which the left content finishes shifting from center */
  shiftFrame?: number;
  /** frame at which the right (data) side reveals */
  revealFrame?: number;
  /** show the faint vertical divider */
  divider?: boolean;
}> = ({
  left,
  right,
  rightLabel,
  ratio = 0.5,
  shiftFrame = 0,
  revealFrame = 18,
  divider = true,
}) => {
  const frame = useCurrentFrame();

  // Left content eases from center (screen-centered) to its half.
  const shift = interpolate(frame, [shiftFrame, shiftFrame + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Right side reveals a beat later.
  const reveal = interpolate(frame, [revealFrame, revealFrame + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(reveal, [0, 1], [24, 0]);

  const pad = layout.sidePadding;
  const usableW = layout.width - pad * 2;
  const leftW = usableW * ratio;
  const rightW = usableW * (1 - ratio);
  const midX = pad + leftW;

  // How far right of center the left column would sit if fully centered (px).
  // At shift=0 the left content is centered on the whole stage; at shift=1 it
  // is centered on its own column.
  const leftCenterFinal = pad + leftW / 2;
  const leftCenterStart = layout.width / 2;
  const leftX = leftCenterStart + (leftCenterFinal - leftCenterStart) * shift;

  return (
    <AbsoluteFill>
      {/* LEFT — hero animation, centered in its column, shifted from center */}
      <div
        style={{
          position: "absolute",
          left: leftX,
          top: layout.height / 2,
          transform: "translate(-50%, -50%)",
          width: leftW,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {left}
      </div>

      {/* Divider — hairline, appears with the reveal */}
      {divider && (
        <div
          style={{
            position: "absolute",
            left: midX,
            top: layout.height * 0.2,
            height: layout.height * 0.6,
            width: 1,
            background: color.hairline,
            opacity: 0.5 * reveal,
          }}
        />
      )}

      {/* RIGHT — data side, revealed a beat later */}
      <div
        style={{
          position: "absolute",
          left: midX,
          top: layout.height / 2,
          transform: `translate(0, calc(-50% + ${rise}px))`,
          width: rightW,
          opacity: reveal,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 40,
          paddingRight: 20,
          boxSizing: "border-box",
        }}
      >
        {right}
        {rightLabel && (
          <div
            style={{
              marginTop: 22,
              fontFamily: mono,
              fontSize: 22,
              letterSpacing: layout.tracking,
              textTransform: "uppercase",
              color: color.textMuted,
              textAlign: "center",
              maxWidth: rightW - 80,
            }}
          >
            {rightLabel}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
