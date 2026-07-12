import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Background } from "./components/Background";
import { SceneFrame } from "./components/SceneFrame";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Cell } from "./scenes/Scene2Cell";
import { Scene3Data } from "./scenes/Scene3Data";
import { Scene4ConvergenceSplit } from "./scenes/Scene4ConvergenceSplit";
import { Scene5Genetics } from "./scenes/Scene5Genetics";
import { Scene6HubSplit } from "./scenes/Scene6HubSplit";
import { Scene7Why } from "./scenes/Scene7Why";
import { Scene8Close } from "./scenes/Scene8Close";
import { scenes, dur, TOTAL_FRAMES, layout } from "./theme";
import { Composition } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VO_LEAD = 8; // frames before a scene's narration starts (~0.27s)

// A scene = its Sequence + optional narration + the scene, wrapped in SceneFrame
// for the crossfade. The film renders SILENT as-is; scene durations (theme.ts)
// are fit to a ~145 wpm read of VIDEO_SCRIPT.md. To add a voice-over, drop
// per-scene audio in public/vo/ (s1.wav … s8.wav) and pass vo="s1.wav".
const Scene: React.FC<{
  range: { start: number; end: number };
  vo?: string;
  children: React.ReactNode;
}> = ({ range, vo, children }) => (
  <Sequence from={range.start} durationInFrames={dur(range)}>
    {vo ? (
      <Sequence from={VO_LEAD}>
        <Audio src={staticFile(`vo/${vo}`)} />
      </Sequence>
    ) : null}
    <SceneFrame>{children}</SceneFrame>
  </Sequence>
);

// Final fade to black over the last ~1.3s of the film.
const FadeToBlack: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [TOTAL_FRAMES - 45, TOTAL_FRAMES - 6], [0, 1], clamp);
  return <AbsoluteFill style={{ backgroundColor: "#000000", opacity, pointerEvents: "none" }} />;
};

const Explainer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0E1A" }}>
    <Background />

    {/* Frames 0–29 hold on the background as a 1s intro before Scene 1. */}
    <Scene range={scenes.hook}><Scene1Hook /></Scene>
    <Scene range={scenes.cellAndBuilt}><Scene2Cell /></Scene>
    <Scene range={scenes.data}><Scene3Data /></Scene>
    <Scene range={scenes.convergence}><Scene4ConvergenceSplit /></Scene>
    <Scene range={scenes.genetics}><Scene5Genetics /></Scene>
    <Scene range={scenes.cd44Hub}><Scene6HubSplit /></Scene>
    <Scene range={scenes.whyItMatters}><Scene7Why /></Scene>
    <Scene range={scenes.close}><Scene8Close /></Scene>

    <FadeToBlack />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Explainer"
    component={Explainer}
    durationInFrames={TOTAL_FRAMES}
    fps={layout.fps}
    width={layout.width}
    height={layout.height}
  />
);
