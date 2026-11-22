/**
 * EcoPulse - Overlays de prévia
 *
 * Enquanto os vídeos não foram gravados, cada tela mostra um selo "PRÉVIA" e o
 * caminho do arquivo esperado. Esses selos NÃO podem aparecer no vídeo final,
 * então são controlados por input props:
 *
 *   Preview no Studio            -> selos visíveis (padrão)
 *   npm run render               -> --props='{"showPlaceholders":false}'
 */

import { getInputProps } from "remotion";

const readShowPlaceholders = (): boolean => {
  try {
    const props = getInputProps() as { showPlaceholders?: unknown } | null;
    return props?.showPlaceholders !== false;
  } catch {
    // Fora de um contexto Remotion (ex.: type-check isolado): assume prévia.
    return true;
  }
};

export const isPlaceholderOverlayEnabled = (): boolean =>
  readShowPlaceholders();
