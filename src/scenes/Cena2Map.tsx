import React from "react";
import { Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import { CENA2_CLIPS, CENA2_OVERLAYS, clipSeconds } from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { CutFlash, ScreenClipLayer } from "../components/ScreenClip";
import {
  CrossPanel,
  InstantSeal,
  SatelliteBadge,
  SimulationBadge,
} from "./Cena2Overlays";

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
            <ScreenClipLayer
              src={clip.src}
              startSeconds={clip.startSeconds}
              label={clip.legend}
            />
          </Sequence>
        ))}

        {bounds.slice(1).map((bound) => (
          <CutFlash key={`flash-${bound.start}`} atFrame={bound.start} />
        ))}

        <div
          className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 text-[14px] font-mono text-emerald-300"
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
