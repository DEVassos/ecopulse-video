import React from "react";
import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { getSceneDurationInFrames } from "./config/timeline";
import { THEME } from "./config/theme";
import { SafeAudio } from "./components/SafeAudio";

import { Cena1Hook } from "./scenes/Cena1Hook";
import { Cena2Map } from "./scenes/Cena2Map";
import { Cena3Emissions } from "./scenes/Cena3Emissions";
import { Cena4Compare } from "./scenes/Cena4Compare";
import { Cena5Report } from "./scenes/Cena5Report";
import { Cena6Help } from "./scenes/Cena6Help";
import { Cena7Outro } from "./scenes/Cena7Outro";

/**
 * EcoPulse Main Composition
 * Encadeia as 7 cenas usando <Series> e <Series.Sequence>,
 * convertendo os segundos de src/config/timeline.ts em frames.
 * Inclui trilha sonora global em loop com volume atenuado.
 */
export const EcoPulseComposition: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.bg }}>
      {/* Trilha Sonora Global em Loop com Volume 0.12 */}
      <SafeAudio src="audio/bg_music.mp3" volume={0.12} loop />

      {/* Sequência Contínua das 7 Cenas */}
      <Series>
        {/* Cena 1: O Gancho */}
        <Series.Sequence
          name="Cena 1 - O Gancho"
          durationInFrames={getSceneDurationInFrames("cena1", fps)}
        >
          <Cena1Hook />
        </Series.Sequence>

        {/* Cena 2: O Mapa e Simulação */}
        <Series.Sequence
          name="Cena 2 - O Mapa e Simulação"
          durationInFrames={getSceneDurationInFrames("cena2", fps)}
        >
          <Cena2Map />
        </Series.Sequence>

        {/* Cena 3: Investigação */}
        <Series.Sequence
          name="Cena 3 - Investigação"
          durationInFrames={getSceneDurationInFrames("cena3", fps)}
        >
          <Cena3Emissions />
        </Series.Sequence>

        {/* Cena 4: Comparação e Causa Raiz */}
        <Series.Sequence
          name="Cena 4 - Comparação e Causa Raiz"
          durationInFrames={getSceneDurationInFrames("cena4", fps)}
        >
          <Cena4Compare />
        </Series.Sequence>

        {/* Cena 5: Relatórios e PDF */}
        <Series.Sequence
          name="Cena 5 - Relatórios e PDF"
          durationInFrames={getSceneDurationInFrames("cena5", fps)}
        >
          <Cena5Report />
        </Series.Sequence>

        {/* Cena 6: Maturidade e Transparência */}
        <Series.Sequence
          name="Cena 6 - Maturidade e Transparência"
          durationInFrames={getSceneDurationInFrames("cena6", fps)}
        >
          <Cena6Help />
        </Series.Sequence>

        {/* Cena 7: Fechamento */}
        <Series.Sequence
          name="Cena 7 - Fechamento"
          durationInFrames={getSceneDurationInFrames("cena7", fps)}
        >
          <Cena7Outro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
