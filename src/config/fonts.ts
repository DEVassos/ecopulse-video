/**
 * EcoPulse - Fontes embarcadas
 *
 * As fontes são servidas de public/fonts (auto-hospedadas, sem rede no render).
 * `loadFont` bloqueia o frame via delayRender até o arquivo estar decodificado,
 * então o primeiro frame já sai com a tipografia correta — sem fallback
 * sintetizado pelo sistema operacional.
 */

import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT_SANS = "Inter";
export const FONT_MONO = "JetBrains Mono";

// Variáveis: um único arquivo cobre todos os pesos usados (100..900).
loadFont({
  family: FONT_SANS,
  url: staticFile("fonts/Inter-variable.woff2"),
  weight: "100 900",
  format: "woff2",
  display: "block",
}).catch((error) => {
  throw new Error(`Falha ao carregar a fonte ${FONT_SANS}: ${String(error)}`);
});

loadFont({
  family: FONT_MONO,
  url: staticFile("fonts/JetBrainsMono-variable.woff2"),
  weight: "400 800",
  format: "woff2",
  display: "block",
}).catch((error) => {
  throw new Error(`Falha ao carregar a fonte ${FONT_MONO}: ${String(error)}`);
});
