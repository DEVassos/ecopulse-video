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
import { Cena7Access } from "./scenes/Cena7Access";
import { CenaMobile } from "./scenes/CenaMobile";
import { Cena8Outro } from "./scenes/Cena8Outro";

const SCENE_COMPONENTS = {
  cena1: Cena1Hook,
  cena2: Cena2Map,
  cena3: Cena3Emissions,
  cena4: Cena4Compare,
  cena5: Cena5Report,
  cena6: Cena6Help,
  cena7: Cena7Access,
  mobile: CenaMobile,
  cena8: Cena8Outro,
} as const;

/**
 * `audio/musica_de_fundo.mp3` é uma masterização quente (RMS ~-11,6 dBFS,
 * ~10 dB acima da narração). Os volumes abaixo são relativos a isso: 0,26 dá
 * ~-23 dBFS de leito (audível sem competir com a voz) e 0,10 deixa a trilha
 * ~-32 dBFS durante a locução.
 */
const MUSIC_FILE = "audio/musica_de_fundo.mp3";
const MUSIC_BASE_VOLUME = 0.26;
/** Pico da trilha nas janelas sem locução (respiro entre uma cena e a próxima). */
const MUSIC_LIFT_VOLUME = 0.44;
const MUSIC_DUCKED_VOLUME = 0.1;
const MUSIC_DUCK_RAMP_FRAMES = 14;
/** Rampa de subida da trilha no respiro entre cenas (nominal, ver `lift`). */
const MUSIC_LIFT_RAMP_IN_FRAMES = 18;
/** Ponto mais alto do respiro, contado do fim da locução (nominal). */
const MUSIC_LIFT_PEAK_FRAMES = 60;
/** Rampa de descida da trilha no respiro entre cenas (nominal, ver `lift`). */
const MUSIC_LIFT_RAMP_OUT_FRAMES = 24;
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
      // Cena sem narração (mobile): nada para abaixar, e os marcos do
      // `interpolate` deixariam de ser crescentes.
      if (slot.narrationInFrames === 0) {
        return highest;
      }
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

    // Respiro: entre o fim da locução e a próxima cena a trilha sobe e desce,
    // marcando a virada sem precisar de efeito sonoro.
    const lift = slots.reduce((highest, slot) => {
      const gapStart = slot.startFrame + slot.narrationInFrames;
      const gapEnd =
        slot.startFrame + slot.durationInFrames - TIMELINE_CONFIG.transitionInFrames;
      const gapFrames = gapEnd - gapStart;

      if (gapFrames < 40) {
        return highest;
      }

      // `interpolate` exige marcos estritamente crescentes. O formato nominal usa
      // os marcos [+18, +60, -24] e o último cai antes do anterior quando a pausa
      // fica entre 40 e 84 frames; nesse caso o respiro vira um triângulo
      // proporcional à pausa.
      const nominalFits =
        gapEnd - MUSIC_LIFT_RAMP_OUT_FRAMES > gapStart + MUSIC_LIFT_PEAK_FRAMES;
      const inputRange = nominalFits
        ? [
            gapStart + MUSIC_LIFT_RAMP_IN_FRAMES,
            gapStart + MUSIC_LIFT_PEAK_FRAMES,
            gapEnd - MUSIC_LIFT_RAMP_OUT_FRAMES,
            gapEnd,
          ]
        : [
            gapStart + Math.round(gapFrames * 0.22),
            gapStart + Math.round(gapFrames * 0.72),
            gapEnd,
          ];

      const ramp = interpolate(
        frame,
        inputRange,
        nominalFits ? [0, 1, 1, 0] : [0, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );

      return Math.max(highest, ramp);
    }, 0);

    const bed = MUSIC_BASE_VOLUME + duck * (MUSIC_DUCKED_VOLUME - MUSIC_BASE_VOLUME);

    return bed + lift * (MUSIC_LIFT_VOLUME - bed);
  };

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.bg }}>
      <SafeAudio
        src={MUSIC_FILE}
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
                  // Crossfade de verdade: a cena que sai também esmaece. Sem
                  // isso ela fica com opacidade 1 por cima até ser desmontada,
                  // e o que não tem saída própria (carimbo da cena 4, varredura
                  // da cena 5) some de uma vez no último frame da transição.
                  presentation={fade({ shouldFadeOutExitingScene: true })}
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
