import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DataTypeIcon } from "../components/DataTypeIcon";
import { Kicker } from "../components/Kicker";
import { CountUp } from "../components/CountUp";
import { color, inter, mono } from "../theme";

// ── Glyphs (56×56) ──────────────────────────────────────────────────────────
const SnRnaGlyph: React.FC<{ c: string }> = ({ c }) => (
  <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="21" stroke={c} strokeWidth="2" opacity="0.5" />
    <path d="M18 34c4-3 4-9 8-12s8 0 12-3" stroke={c} strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="20" cy="22" r="2.4" fill={c} />
    <circle cx="30" cy="30" r="2.4" fill={c} />
    <circle cx="38" cy="20" r="2.4" fill={c} />
    <circle cx="24" cy="38" r="2.4" fill={c} />
  </svg>
);

const BulkRnaGlyph: React.FC<{ c: string }> = ({ c }) => (
  <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
    <rect x="14" y="12" width="28" height="32" rx="4" stroke={c} strokeWidth="2" opacity="0.5" />
    <rect x="14" y="30" width="28" height="14" rx="0" fill={c} opacity="0.28" />
    <line x1="20" y1="20" x2="36" y2="20" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="20" y1="25" x2="32" y2="25" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M14 36c4 0 4 3 8 3s4-3 8-3 4 3 8 3" stroke={c} strokeWidth="2" fill="none" opacity="0.8" />
  </svg>
);

const SpatialGlyph: React.FC<{ c: string }> = ({ c }) => {
  const dots = [];
  for (let r = 0; r < 5; r++)
    for (let col = 0; col < 5; col++) {
      const x = 12 + col * 8;
      const y = 12 + r * 8;
      const hot = r >= 2 && r <= 3 && col >= 2 && col <= 3;
      dots.push(<circle key={`${r}-${col}`} cx={x} cy={y} r={hot ? 2.6 : 1.6} fill={c} opacity={hot ? 1 : 0.4} />);
    }
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
      <circle cx="30" cy="28" r="10" stroke={c} strokeWidth="1.6" opacity="0.6" />
      {dots}
    </svg>
  );
};

const ProteomicsGlyph: React.FC<{ c: string }> = ({ c }) => {
  const bars = [10, 22, 14, 34, 18, 28, 12];
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
      <line x1="10" y1="44" x2="46" y2="44" stroke={c} strokeWidth="1.6" opacity="0.5" />
      {bars.map((h, i) => (
        <line key={i} x1={12 + i * 5.6} y1={44} x2={12 + i * 5.6} y2={44 - h} stroke={c} strokeWidth="2.6" strokeLinecap="round" />
      ))}
    </svg>
  );
};

// ── Data types ──────────────────────────────────────────────────────────────
// Species tags per the study. Confirm/adjust the human/mouse flags for Bulk RNA
// and Proteomics if the datasets differ.
const TYPES = [
  {
    title: "snRNA-seq",
    sub: "AD microglia + injured mouse",
    human: true,
    mouse: true,
    accent: color.hub,
    glyph: (c: string) => <SnRnaGlyph c={c} />,
  },
  {
    title: "Bulk RNA",
    sub: "sorted astrocytes",
    human: true,
    mouse: true,
    accent: color.cool,
    glyph: (c: string) => <BulkRnaGlyph c={c} />,
  },
  {
    title: "Spatial",
    sub: "around plaques + lesion",
    human: true,
    mouse: true,
    accent: color.coolSecondary,
    glyph: (c: string) => <SpatialGlyph c={c} />,
  },
  {
    title: "Proteomics",
    sub: "brain tissue",
    human: true,
    mouse: false,
    accent: color.hubBright,
    glyph: (c: string) => <ProteomicsGlyph c={c} />,
  },
];

const iconStart = 46;
const iconStep = 78;
const badgeDelay = iconStart + TYPES.length * iconStep + 20;

export const Scene3Data: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeEnter = spring({ frame: frame - badgeDelay, fps, config: { damping: 16 } });
  const badgeOpacity = interpolate(badgeEnter, [0, 1], [0, 1]);
  const badgeY = interpolate(badgeEnter, [0, 1], [18, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Kicker */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 96 }}>
        <Kicker tone="secondary" delay={12}>
          Checked four ways · human + mouse
        </Kicker>
      </AbsoluteFill>

      {/* Four data-type cards */}
      <div style={{ display: "flex", gap: 44, marginTop: 24 }}>
        {TYPES.map((t, i) => (
          <DataTypeIcon
            key={t.title}
            title={t.title}
            sub={t.sub}
            human={t.human}
            mouse={t.mouse}
            accent={t.accent}
            delay={iconStart + i * iconStep}
          >
            {t.glyph(t.accent)}
          </DataTypeIcon>
        ))}
      </div>

      {/* 9-analyses badge */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          opacity: badgeOpacity,
          transform: `translateY(${badgeY}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 30px",
            borderRadius: 999,
            border: `1.5px solid ${color.hub}`,
            background: `${color.hub}14`,
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 22, color: color.textSecondary, letterSpacing: "0.04em" }}>
            HUMAN + MOUSE
          </span>
          <span style={{ color: color.textMuted, fontSize: 20 }}>·</span>
          <span style={{ fontFamily: inter, fontWeight: 700, fontSize: 30, color: color.hubBright }}>
            <CountUp to={9} startFrame={badgeDelay + 4} durationInFrames={34} />
          </span>
          <span style={{ fontFamily: inter, fontSize: 26, color: color.text }}>analyses</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
