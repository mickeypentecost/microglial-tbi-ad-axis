import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Microglia } from "../components/Microglia";
import { GeneChip } from "../components/GeneChip";
import { LockStamp } from "../components/LockStamp";
import { Kicker } from "../components/Kicker";
import { color, inter, mono } from "../theme";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// The study's a priori locked gene programs.
// Accelerator = pro-inflammatory / disease-associated-microglia arm.
// Brake = pro-resolving arm, built on TSG-6 + hyaluronan (HAS/HYAL/HMMR).
const ACCELERATOR = [
  "SPP1", "CD44", "ITGAX", "TREM2", "TYROBP", "C3", "C1QA", "C1QB", "C1QC",
  "CST7", "GPNMB", "LPL", "CLEC7A", "LGALS3", "TLR2", "CD68", "B2M", "APOE",
  "IL1B", "TNF", "CXCL10",
];
const BRAKE = [
  "TSG-6", "HAS1", "HAS2", "HAS3", "HMMR", "ANXA1", "TGFB1", "SOCS3", "IL10",
  "HYAL1", "HYAL2",
];

const Reveal: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [delay, delay + 20], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutCubic,
  });
  return <div style={{ opacity: o, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

const chipStart = 145;
const chipStep = 4;

export const Scene2Cell: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // Zoom into the cell over the first ~70 frames.
  const appear = interpolate(frame, [0, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutCubic,
  });
  const cellScale = interpolate(frame, [0, 70], [0.36, 0.58], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutCubic,
  });

  const headerDelay = 110;
  // Lock stamps after the programs have written out.
  const lockDelay = chipStart + ACCELERATOR.length * chipStep + 60;

  return (
    <AbsoluteFill>
      {/* Kicker */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 46 }}>
        <Reveal delay={14}>
          <Kicker tone="hub">Microglia — the brain's resident immune cell</Kicker>
        </Reveal>
        <Reveal delay={40} style={{ marginTop: 8 }}>
          <span style={{ fontFamily: inter, fontSize: 23, color: color.textMuted }}>
            where Alzheimer's genetic risk concentrates
          </span>
        </Reveal>
      </AbsoluteFill>

      {/* The cell */}
      <AbsoluteFill>
        <svg width={width} height={1080} style={{ position: "absolute" }}>
          <Microglia cx={width / 2} cy={252} appear={appear} scale={cellScale} />
        </svg>
      </AbsoluteFill>

      {/* Two gene-program columns */}
      <AbsoluteFill
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 180,
          paddingTop: 410,
        }}
      >
        <Arm
          title="ACCELERATOR"
          sub="pro-inflammatory"
          tone="warm"
          genes={ACCELERATOR}
          from="left"
          headerDelay={headerDelay}
        />
        <Arm
          title="BRAKE"
          sub="pro-resolving · TSG-6 + hyaluronan"
          tone="cool"
          genes={BRAKE}
          from="right"
          headerDelay={headerDelay}
        />
      </AbsoluteFill>

      {/* Lock stamp */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 44 }}>
        <LockStamp delay={lockDelay} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Arm: React.FC<{
  title: string;
  sub: string;
  tone: "warm" | "cool";
  genes: string[];
  from: "left" | "right";
  headerDelay: number;
}> = ({ title, sub, tone, genes, from, headerDelay }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 560 }}>
    <Reveal delay={headerDelay}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.04em",
            color: tone === "warm" ? color.warm : color.cool,
          }}
        >
          {title}
        </div>
        <div style={{ fontFamily: mono, fontSize: 18, color: color.textMuted, marginTop: 4 }}>{sub}</div>
      </div>
    </Reveal>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
      {genes.map((g, i) => (
        <GeneChip key={g} label={g} arm={tone} from={from} compact delay={chipStart + i * chipStep} />
      ))}
    </div>
  </div>
);
