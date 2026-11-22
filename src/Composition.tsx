import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import {
  type SceneKey,
  TIMELINE_CONFIG,
  getSceneDurationInFrames,
  getSceneSlots,
} from "./config/timeline";
import { THEME } from "./config/theme";
import { SafeAudio } from "./components/SafeAudio";

import { Cena1Hook } from "./scenes/Cena1Hook";
import { Cena2Map } from "./scenes/Cena2Map";
import { Cena3Emissions } from "./scenes/Cena3Emissions";
import { Cena4Compare } from "./scenes/Cena4Compare";
import { Cena5Report } from "./scenes/Cena5Report";
import { Cena6Help } from "./scenes/Cena6Help";
import { Cena7Outro } from "./scenes/Cena7Outro";

const SCENE_COMPONENTS = {
  cena1: Cena1Hook,
  cena2: Cena2Map,
  cena3: Cena3Emissions,
  cena4: Cena4Compare,
  cena5: Cena5Report,
  cena6: Cena6Help,
  cena7: Cena7Outro,
} as const;

const MUSIC_BASE_VOLUME = 0.1;
const MUSIC_DUCKED_VOLUME = 0.035;
const MUSIC_DUCK_RAMP_FRAMES = 14;
const MUSIC_FADE_IN_SECONDS = 1.2;
const MUSIC_FADE_OUT_SECONDS = 2;

/**
 * EcoPulse - Composição principal
 *
 * As cenas são encadeadas por <TransitionSeries> com crossfade curto. A trilha
 * fica fora da série (é contínua) e abaixa sozinha enquanto há narração, o que
 * evita disputar atenção com a locução.
 */
export interface EcoPulseCompositionProps {
  /** Subconjunto de cenas a renderizar (usado pela versão curta de estande). */
  scenes: readonly SceneKey[];
}

export const EcoPulseComposition: React.FC<EcoPulseCompositionProps> = ({
  scenes,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const slots = getSceneSlots(scenes, fps);

  const musicVolume = (frame: number): number => {
    const duck = slots.reduce((highest, slot) => {
      const start = slot.startFrame;
      const end = start + slot.narrationInFrames;
      const ramp = interpolate(
        frame,
        [
          start,
          start + MUSIC_DUCK_RAMP_FRAMES,
          end - MUSIC_DUCK_RAMP_FRAMES,
          end,
        ],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      return Math.max(highest, ramp);
    }, 0);

    return (
      MUSIC_BASE_VOLUME +
      duck * (MUSIC_DUCKED_VOLUME - MUSIC_BASE_VOLUME)
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.bg }}>
      <SafeAudio
        src="audio/bg_music.mp3"
        volume={musicVolume}
        loop
        fadeInSeconds={MUSIC_FADE_IN_SECONDS}
        fadeOutSeconds={MUSIC_FADE_OUT_SECONDS}
        durationInFrames={durationInFrames}
      />

      <TransitionSeries>
        {scenes.map((key, index) => {
          const SceneComponent = SCENE_COMPONENTS[key];
          return (
            <React.Fragment key={key}>
              <TransitionSeries.Sequence
                name={TIMELINE_CONFIG.scenes[key].label}
                durationInFrames={getSceneDurationInFrames(key, fps)}
              >
                <SceneComponent />
              </TransitionSeries.Sequence>
              {index < scenes.length - 1 ? (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({
                    durationInFrames: TIMELINE_CONFIG.transitionInFrames,
                  })}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
