import React from "react";
import { Composition, Folder } from "remotion";
import "./index.css";
// Carrega Inter + JetBrains Mono antes do primeiro frame (ver src/config/fonts.ts)
import "./config/fonts";

import { EcoPulseComposition } from "./Composition";
import {
  SCENE_KEYS,
  SHORT_SCENE_KEYS,
  TIMELINE_CONFIG,
  type SceneKey,
  getSceneDurationInFrames,
  getSequenceDurationInFrames,
  getTotalDurationInFrames,
} from "./config/timeline";

import { Cena1Hook } from "./scenes/Cena1Hook";
import { Cena2Map } from "./scenes/Cena2Map";
import { Cena3Emissions } from "./scenes/Cena3Emissions";
import { Cena4Compare } from "./scenes/Cena4Compare";
import { Cena5Report } from "./scenes/Cena5Report";
import { Cena6Help } from "./scenes/Cena6Help";
import { Cena7Outro } from "./scenes/Cena7Outro";

const PREVIEW_PROPS = { showPlaceholders: true };

/** Vídeo completo: as 7 cenas em sequência. */
const EcoPulseMain: React.FC = () => (
  <EcoPulseComposition scenes={SCENE_KEYS} />
);

/** Versão curta para loop de estande / redes sociais. */
const EcoPulseShort: React.FC = () => (
  <EcoPulseComposition scenes={SHORT_SCENE_KEYS} />
);

const ISOLATED_SCENES: ReadonlyArray<{
  key: SceneKey;
  id: string;
  component: React.FC;
}> = [
  { key: "cena1", id: "Cena1-Hook", component: Cena1Hook },
  { key: "cena2", id: "Cena2-Map", component: Cena2Map },
  { key: "cena3", id: "Cena3-Emissions", component: Cena3Emissions },
  { key: "cena4", id: "Cena4-Compare", component: Cena4Compare },
  { key: "cena5", id: "Cena5-Report", component: Cena5Report },
  { key: "cena6", id: "Cena6-Help", component: Cena6Help },
  { key: "cena7", id: "Cena7-Outro", component: Cena7Outro },
];

export const RemotionRoot: React.FC = () => {
  const { fps, width, height } = TIMELINE_CONFIG;

  return (
    <>
      {/* Vídeo completo para o estande */}
      <Composition
        id="EcoPulseMain"
        component={EcoPulseMain}
        durationInFrames={getTotalDurationInFrames(fps)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={PREVIEW_PROPS}
      />

      {/* Versão curta (loop de estande / redes sociais) */}
      <Composition
        id="EcoPulseShort"
        component={EcoPulseShort}
        durationInFrames={getSequenceDurationInFrames(SHORT_SCENE_KEYS, fps)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={PREVIEW_PROPS}
      />

      {/* Cenas isoladas para revisão rápida no Studio */}
      <Folder name="Cenas">
        {ISOLATED_SCENES.map(({ key, id, component }) => (
          <Composition
            key={id}
            id={id}
            component={component}
            durationInFrames={getSceneDurationInFrames(key, fps)}
            fps={fps}
            width={width}
            height={height}
            defaultProps={PREVIEW_PROPS}
          />
        ))}
      </Folder>
    </>
  );
};
