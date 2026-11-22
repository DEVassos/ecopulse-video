import React from "react";
import { Audio, staticFile } from "remotion";

export interface SafeAudioProps {
  src: string; // Caminho relativo a public/ (ex: "audio/cena1.mp3")
  volume?: number | ((frame: number) => number);
  loop?: boolean;
  startFrom?: number;
  endAt?: number;
}

/**
 * Componente de áudio seguro que carrega arquivos de áudio via staticFile()
 * com suporte a volume, repetição e fatiamento temporal.
 */
export const SafeAudio: React.FC<SafeAudioProps> = ({
  src,
  volume = 1,
  loop = false,
  startFrom,
  endAt,
}) => {
  return (
    <Audio
      src={staticFile(src)}
      volume={volume}
      loop={loop}
      startFrom={startFrom}
      endAt={endAt}
    />
  );
};
