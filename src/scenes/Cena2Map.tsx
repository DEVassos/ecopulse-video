import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import {
  CENA2_CLIPS,
  CENA2_OVERLAYS,
  Cena2Clip,
  clipSeconds,
} from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";
import {
  CrossPanel,
  InstantSeal,
  SatelliteBadge,
  SimulationBadge,
} from "./Cena2Overlays";

/** Frames de varredura verde em cada corte entre um trecho e o próximo. */
const CUT_FLASH_FRAMES = 12;

const ClipLayer: React.FC<{ clip: Cena2Clip }> = ({ clip }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <SafeVideo
        src={clip.src}
        label={clip.legend}
        trimBefore={Math.round(clip.startSeconds * fps)}
        playbackRate={1}
        volume={0}
        kenBurns={false}
        className="w-full h-full"
      />
    </AbsoluteFill>
  );
};

/** Varredura de luz verde marcando a troca de trecho (mesma linguagem da cena 1). */
const CutFlash: React.FC<{ atFrame: number }> = ({ atFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - atFrame;

  if (local < 0 || local > CUT_FLASH_FRAMES) return null;

  const progress = local / CUT_FLASH_FRAMES;

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        opacity: interpolate(progress, [0, 0.25, 1], [0, 0.55, 0]),
        background:
          "linear-gradient(105deg, transparent 30%, #d8fff0 48%, #34d399 52%, transparent 70%)",
        translate: `${interpolate(progress, [0, 1], [-30, 30])}% 0px`,
        scale: 1.1,
      }}
    />
  );
};

/**
 * Cena 2 - O Mapa e a Simulação.
 * Os três trechos são encaixados pelo plano em segundos absolutos definido em
 * `CENA2_CLIPS`, cortando nas pausas reais da narração.
 */
export const Cena2Map: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const toFrame = (seconds: number) => Math.round(seconds * fps);

  const bounds = CENA2_CLIPS.map((clip) => ({
    start: Math.round(clip.atSeconds * fps),
    length: Math.round(clipSeconds(clip) * fps),
  }));

  const activeIndex = CENA2_CLIPS.reduce(
    (current, _clip, index) => (frame >= bounds[index].start ? index : current),
    0
  );

  // Respiro final: o plano já entregou o resultado, a cena apenas fecha.
  const outro = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <SceneShell sceneKey="cena2">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/dashboard/map"
        title="EcoPulse • Global Carbon Mesh"
      >
        {CENA2_CLIPS.map((clip, index) => (
          <Sequence
            key={clip.src}
            from={bounds[index].start}
            durationInFrames={bounds[index].length}
          >
            <ClipLayer clip={clip} />
          </Sequence>
        ))}

        {bounds.slice(1).map((bound) => (
          <CutFlash key={`flash-${bound.start}`} atFrame={bound.start} />
        ))}

        <div
          className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 text-xs font-mono text-emerald-300"
          style={{ opacity: interpolate(outro, [0, 1], [1, 0]) }}
        >
          {CENA2_CLIPS[activeIndex].legend}
        </div>

        {/* Janelas de overlay, alinhadas às pausas da narração */}
        <Sequence from={toFrame(CENA2_OVERLAYS.satellite.inSeconds)} durationInFrames={toFrame(CENA2_OVERLAYS.satellite.outSeconds - CENA2_OVERLAYS.satellite.inSeconds)} layout="none">
          <SatelliteBadge />
        </Sequence>

        <Sequence from={toFrame(CENA2_OVERLAYS.cross.inSeconds)} durationInFrames={toFrame(CENA2_OVERLAYS.cross.outSeconds - CENA2_OVERLAYS.cross.inSeconds)} layout="none">
          <CrossPanel />
        </Sequence>

        <Sequence from={toFrame(CENA2_OVERLAYS.seal.inSeconds)} durationInFrames={toFrame(CENA2_OVERLAYS.seal.outSeconds - CENA2_OVERLAYS.seal.inSeconds)} layout="none">
          <InstantSeal />
        </Sequence>

        <Sequence
          from={toFrame(CENA2_OVERLAYS.badge.inSeconds)}
          durationInFrames={durationInFrames - toFrame(CENA2_OVERLAYS.badge.inSeconds)}
          layout="none"
        >
          <SimulationBadge />
        </Sequence>
      </BrowserFrame>
    </SceneShell>
  );
};
