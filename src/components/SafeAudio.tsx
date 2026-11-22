import React from "react";
import { Audio, staticFile, useVideoConfig } from "remotion";

export interface SafeAudioProps {
  /** Caminho relativo a public/ (ex: "audio/cena1.mp3") */
  src: string;
  volume?: number | ((frame: number) => number);
  loop?: boolean;
  startFrom?: number;
  endAt?: number;
  /** Rampa de entrada, em segundos */
  fadeInSeconds?: number;
  /** Rampa de saída, em segundos */
  fadeOutSeconds?: number;
  /** Duração da própria faixa em frames (necessária para calcular o fade-out) */
  durationInFrames?: number;
}

/** Curva suave (smoothstep) — melhor que rampa linear para áudio. */
const smoothstep = (t: number): number => t * t * (3 - 2 * t);

/**
 * Componente de áudio com fades automáticos.
 *
 * `volume` é resolvido por frame: o fator constante recebido é multiplicado
 * pelas rampas de entrada/saída, então um mesmo arquivo pode ser usado tanto
 * como narração seca quanto como trilha com ducking.
 */
export const SafeAudio: React.FC<SafeAudioProps> = ({
  src,
  volume = 1,
  loop = false,
  startFrom,
  endAt,
  fadeInSeconds = 0,
  fadeOutSeconds = 0,
  durationInFrames,
}) => {
  const { fps } = useVideoConfig();
  const hasFade = fadeInSeconds > 0 || fadeOutSeconds > 0;

  const resolvedVolume:
    | number
    | ((frame: number) => number) = hasFade
    ? (frame: number) => {
        const base = typeof volume === "function" ? volume(frame) : volume;

        let factor = 1;

        if (fadeInSeconds > 0) {
          const fadeInFrames = fadeInSeconds * fps;
          factor = Math.min(factor, smoothstep(Math.min(1, frame / fadeInFrames)));
        }

        if (fadeOutSeconds > 0 && durationInFrames) {
          const fadeOutFrames = fadeOutSeconds * fps;
          const remaining = durationInFrames - frame;
          factor = Math.min(
            factor,
            smoothstep(Math.min(1, Math.max(0, remaining / fadeOutFrames)))
          );
        }

        return Math.max(0, Math.min(1, base * factor));
      }
    : volume;

  return (
    <Audio
      src={staticFile(src)}
      volume={resolvedVolume}
      loop={loop}
      {...(startFrom !== undefined ? { startFrom } : {})}
      {...(endAt !== undefined ? { endAt } : {})}
    />
  );
};
