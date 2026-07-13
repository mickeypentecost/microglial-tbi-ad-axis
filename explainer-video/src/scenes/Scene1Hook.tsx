import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { SceneTitle } from "../components/SceneTitle";
import { color, inter, mono, layout } from "../theme";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const CRASH = 26; // frame at which the injury lands

// ── Warm side: an impact that zooms in and crashes ONCE, then holds still.
// A single shockwave ring + spoke-burst fires at the crash; no looping.
const ImpactMotif: React.FC<{ cx: number; cy: number; scale: number }> = ({ cx, cy, scale }) => {
  const frame = useCurrentFrame();
  const t = frame - CRASH;
  const spokes = Array.from({ length: 14 }, (_, i) => (i * 360) / 14);

  const ringOn = t >= 0 && t <= 38;
  const ringR = interpolate(t, [0, 38], [20, 160], clampBoth);
  const ringO = interpolate(t, [0, 38], [0.85, 0], clampBoth);
  const stretch = 18 * Math.exp(-Math.pow(t / 6, 2)); // spoke burst on impact
  const flash = Math.exp(-Math.pow(t / 5, 2)); // core flash on impact

  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      {ringOn ? (
        <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={color.warmGlow} strokeWidth={2.5} opacity={ringO} />
      ) : null}

      {spokes.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const inner = 30;
        const outer = inner + 52 + stretch;
        return (
          <line
            key={deg}
            x1={cx + inner * Math.cos(rad)}
            y1={cy + inner * Math.sin(rad)}
            x2={cx + outer * Math.cos(rad)}
            y2={cy + outer * Math.sin(rad)}
            stroke={i % 2 === 0 ? color.warm : color.warmSecondary}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.9}
          />
        );
      })}

      {/* Hot core */}
      <circle cx={cx} cy={cy} r={30} fill={color.warm} opacity={0.18 + 0.3 * flash} />
      <circle cx={cx} cy={cy} r={17 * (1 + 0.4 * flash)} fill={color.warmGlow} />
      <circle cx={cx} cy={cy} r={8} fill="#FFE3D6" />
    </g>
  );
};

// ── Cool side: a DNA double helix that zooms in and rotates to a STOP.
const DnaHelix: React.FC<{ cx: number; cy: number; scale: number; height?: number }> = ({
  cx,
  cy,
  scale,
  height = 205,
}) => {
  const frame = useCurrentFrame();
  const amp = 44;
  const steps = 22;
  // Rotate into place, then ease to a full stop (asymptote — stays still).
  const phase = 3.2 * (1 - Math.exp(-frame / 18));
  const top = cy - height / 2;

  const strandA: [number, number][] = [];
  const strandB: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const tt = i / steps;
    const y = top + tt * height;
    const a = phase + tt * Math.PI * 3;
    strandA.push([cx + amp * Math.sin(a), y]);
    strandB.push([cx + amp * Math.sin(a + Math.PI), y]);
  }
  const toPath = (pts: [number, number][]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");

  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      {strandA.map((p, i) => {
        if (i % 2 !== 0) return null;
        const q = strandB[i];
        const depth = (p[0] - cx) / amp;
        return (
          <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={depth > 0 ? color.coolSecondary : color.cool} strokeWidth={2} opacity={0.35 + 0.25 * Math.abs(depth)} />
        );
      })}
      <path d={toPath(strandA)} fill="none" stroke={color.cool} strokeWidth={4} strokeLinecap="round" />
      <path d={toPath(strandB)} fill="none" stroke={color.coolSecondary} strokeWidth={4} strokeLinecap="round" />
      {strandA.map((p, i) => (
        <circle key={`a${i}`} cx={p[0]} cy={p[1]} r={3.4} fill={color.cool} />
      ))}
      {strandB.map((p, i) => (
        <circle key={`b${i}`} cx={p[0]} cy={p[1]} r={3.4} fill={color.coolSecondary} />
      ))}
    </g>
  );
};

const Reveal: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 22], [0, 1], clampBoth);
  const y = interpolate(frame, [delay, delay + 22], [16, 0], { ...clampBoth, easing: easeOutCubic });
  return <div style={{ opacity: o, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const cx = width / 2;
  const motifY = 296;
  const warmX = interpolate(frame, [0, CRASH], [640, 724], { ...clampBoth, easing: easeOutCubic });
  const coolX = interpolate(frame, [0, 32], [1280, 1196], { ...clampBoth, easing: easeOutCubic });

  // Warm zoom-in slam: 0.4 → 1.12 → 1.0 (impact + recoil). Cool: smooth arrival.
  const warmScale =
    interpolate(frame, [0, CRASH], [0.4, 1.12], { ...clampBoth, easing: easeOutCubic }) +
    interpolate(frame, [CRASH, CRASH + 16], [0, -0.12], { ...clampBoth, easing: easeOutCubic });
  const coolScale = interpolate(frame, [0, 32], [0.4, 1], { ...clampBoth, easing: easeOutCubic });

  // Recoil shake of the whole motif cluster right after impact.
  const shakeAmp = interpolate(frame, [CRASH, CRASH + 14], [7, 0], clampBoth);
  const shake = shakeAmp * Math.sin((frame - CRASH) * 2.2);

  // The crash ignites the central destination hub.
  const hub = interpolate(frame, [CRASH + 2, CRASH + 28], [0, 1], { ...clampBoth, easing: easeOutCubic });
  const hubPulse = 1 + 0.06 * Math.sin(frame / 18);
  const hubR = hub * hubPulse;

  // Footer credit — appears, holds, then fades out (lower-third style).
  const footerOp = interpolate(frame, [216, 240, 590, 615], [0, 1, 1, 0], clampBoth);
  const footerY = interpolate(frame, [216, 240], [16, 0], { ...clampBoth, easing: easeOutCubic });

  return (
    <AbsoluteFill>
      <Background />

      {/* Motif layer */}
      <AbsoluteFill>
        <svg width={width} height={layout.height} style={{ position: "absolute" }}>
          <g transform={`translate(${shake} ${shake * 0.4})`}>
            {/* Energy feeding the destination hub, drawn after the crash */}
            <line x1={warmX} y1={motifY} x2={coolX} y2={motifY} stroke={color.hub} strokeWidth={2} strokeDasharray="4 9" opacity={0.24 * hub} />

            <ImpactMotif cx={warmX} cy={motifY} scale={warmScale} />
            <DnaHelix cx={coolX} cy={motifY} scale={coolScale} />

            {/* Destination hub — the payoff, ignited by the crash */}
            <circle cx={cx} cy={motifY} r={54 * hubR} fill={color.hub} opacity={0.2 * hub} />
            <circle cx={cx} cy={motifY} r={30 * hub} fill={color.hub} opacity={0.16} />
            <circle cx={cx} cy={motifY} r={26 * hub} fill="none" stroke={color.hubBright} strokeWidth={2} opacity={0.7 * hub} />
            <circle cx={cx} cy={motifY} r={13 * hubR} fill={color.hubBright} opacity={0.95 * hub} />
          </g>
        </svg>
      </AbsoluteFill>

      {/* Text layer */}
      <AbsoluteFill style={{ padding: layout.sidePadding, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ marginTop: 176 }}>
          <SceneTitle delay={52} fontSize={104}>
            Injury meets inheritance
          </SceneTitle>

          <Reveal delay={112} style={{ marginTop: 24 }}>
            <p style={{ fontFamily: inter, fontSize: 38, fontWeight: 400, color: color.textSecondary, maxWidth: 1280, margin: "0 auto", lineHeight: 1.4 }}>
              A shared microglial resolution-failure axis linking traumatic brain
              injury to Alzheimer's disease
            </p>
          </Reveal>

          <Reveal delay={172} style={{ marginTop: 44 }}>
            <span style={{ fontFamily: mono, fontSize: 26, letterSpacing: layout.tracking, textTransform: "uppercase", color: color.text }}>
              <span style={{ color: color.warm }}>Two roads.</span>{" "}
              <span style={{ color: color.cool }}>One destination.</span>
            </span>
          </Reveal>
        </div>
      </AbsoluteFill>

      {/* Footer credit — appears then disappears */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 58 }}>
        <div style={{ textAlign: "center", opacity: footerOp, transform: `translateY(${footerY}px)` }}>
          <div style={{ fontFamily: mono, fontSize: 28, color: color.textSecondary, letterSpacing: "0.04em" }}>
            Mickey Pentecost, PhD
          </div>
          <div style={{ fontFamily: mono, fontSize: 18, color: color.textMuted, letterSpacing: "0.03em", marginTop: 8 }}>
            Built with Claude: Life Sciences, a global virtual hackathon in partnership with Gladstone Institutes
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
