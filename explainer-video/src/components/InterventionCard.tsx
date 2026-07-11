import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color, inter, mono } from "../theme";

// A ranked intervention card. `verdict` "accept" (cool ✓) or "reject" (warm ✗
// with an animated strike-through). Slides in from the right.
export const InterventionCard: React.FC<{
  title: string;
  desc: string;
  verdict: "accept" | "reject";
  delay?: number;
  strikeAt?: number; // frame at which the reject strike animates
  width?: number;
}> = ({ title, desc, verdict, delay = 0, strikeAt = 0, width = 640 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accept = verdict === "accept";
  const c = accept ? color.cool : color.warm;

  const enter = spring({ frame: frame - delay, fps, config: { damping: 18 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const dx = interpolate(enter, [0, 1], [40, 0]);

  const strike = interpolate(frame, [strikeAt, strikeAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dim = verdict === "reject" ? interpolate(strike, [0, 1], [1, 0.55]) : 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        width,
        padding: "22px 26px",
        borderRadius: 16,
        border: `1.5px solid ${accept ? c + "88" : color.hairline}`,
        background: accept ? `${c}12` : "rgba(255,255,255,0.015)",
        opacity: opacity * dim,
        transform: `translateX(${dx}px)`,
      }}
    >
      {/* Icon badge */}
      <div
        style={{
          flexShrink: 0,
          width: 46,
          height: 46,
          borderRadius: 999,
          border: `2px solid ${c}`,
          background: `${c}22`,
          color: c,
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {accept ? "✓" : "✕"}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 27, color: color.text }}>{title}</div>
          {verdict === "reject" ? (
            <div
              style={{
                position: "absolute",
                top: "52%",
                left: 0,
                height: 2.5,
                width: `${strike * 100}%`,
                background: color.warm,
              }}
            />
          ) : null}
        </div>
        <div style={{ fontFamily: mono, fontSize: 18, color: color.textSecondary, marginTop: 6 }}>{desc}</div>
      </div>
    </div>
  );
};
