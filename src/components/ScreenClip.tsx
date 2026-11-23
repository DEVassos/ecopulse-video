import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SafeVideo } from "./SafeVideo";

/** Frames de varredura verde em cada corte entre um trecho e o próximo. */
export const CUT_FLASH_FRAMES = 12;

/**
 * Um trecho de gravação de tela posicionado dentro de um plano. Sem zoom: a
 * imagem fica parada e quem dá movimento é o corte, os overlays e a legenda.
 */
export const ScreenClipLayer: React.FC<{
  src: string;
  startSeconds: number;
  label?: string;
}> = ({ src, startSeconds, label }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <SafeVideo
        src={src}
        label={label}
        trimBefore={Math.round(startSeconds * fps)}
        playbackRate={1}
        volume={0}
        kenBurns={false}
        className="w-full h-full"
      />
    </AbsoluteFill>
  );
};

/** Varredura de luz verde marcando a troca de trecho (mesma linguagem da cena 1). */
export const CutFlash: React.FC<{ atFrame: number }> = ({ atFrame }) => {
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
