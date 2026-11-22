import React from "react";
import { Composition, Folder } from "remotion";
import "./index.css";
import { EcoPulseComposition } from "./Composition";
import {
  TIMELINE_CONFIG,
  getTotalDurationInFrames,
  getSceneDurationInFrames,
} from "./config/timeline";

import { Cena1Hook } from "./scenes/Cena1Hook";
import { Cena2Map } from "./scenes/Cena2Map";
import { Cena3Emissions } from "./scenes/Cena3Emissions";
import { Cena4Compare } from "./scenes/Cena4Compare";
import { Cena5Report } from "./scenes/Cena5Report";
import { Cena6Help } from "./scenes/Cena6Help";
import { Cena7Outro } from "./scenes/Cena7Outro";

export const RemotionRoot: React.FC = () => {
  const fps = TIMELINE_CONFIG.fps;
  const width = TIMELINE_CONFIG.width;
  const height = TIMELINE_CONFIG.height;
  const totalFrames = getTotalDurationInFrames(fps);

  return (
    <>
      {/* Composição Principal Completa (Full Video) */}
      <Composition
        id="EcoPulseMain"
        component={EcoPulseComposition}
        durationInFrames={totalFrames}
        fps={fps}
        width={width}
        height={height}
      />

      {/* Pasta com Cenas Individuais para Prévia e Edição Isolada no Studio */}
      <Folder name="Cenas">
        <Composition
          id="Cena1-Hook"
          component={Cena1Hook}
          durationInFrames={getSceneDurationInFrames("cena1", fps)}
          fps={fps}
          width={width}
          height={height}
        />
        <Composition
          id="Cena2-Map"
          component={Cena2Map}
          durationInFrames={getSceneDurationInFrames("cena2", fps)}
          fps={fps}
          width={width}
          height={height}
        />
        <Composition
          id="Cena3-Emissions"
          component={Cena3Emissions}
          durationInFrames={getSceneDurationInFrames("cena3", fps)}
          fps={fps}
          width={width}
          height={height}
        />
        <Composition
          id="Cena4-Compare"
          component={Cena4Compare}
          durationInFrames={getSceneDurationInFrames("cena4", fps)}
          fps={fps}
          width={width}
          height={height}
        />
        <Composition
          id="Cena5-Report"
          component={Cena5Report}
          durationInFrames={getSceneDurationInFrames("cena5", fps)}
          fps={fps}
          width={width}
          height={height}
        />
        <Composition
          id="Cena6-Help"
          component={Cena6Help}
          durationInFrames={getSceneDurationInFrames("cena6", fps)}
          fps={fps}
          width={width}
          height={height}
        />
        <Composition
          id="Cena7-Outro"
          component={Cena7Outro}
          durationInFrames={getSceneDurationInFrames("cena7", fps)}
          fps={fps}
          width={width}
          height={height}
        />
      </Folder>
    </>
  );
};
