import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { TIMELINE_CONFIG } from "../config/timeline";
import { SafeAudio } from "../components/SafeAudio";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";

/**
 * Cena 6 - Maturidade e Transparência
 * Exibe videos/08_help_formulas.mp4 ao fundo e um card translúcido
 * na base da tela que anima (efeito máquina de escrever) a fórmula matemática:
 * P = CPU% × 1 + RAM × 0.375
 */
export const Cena6Help: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const formula = TIMELINE_CONFIG.scenes.cena6.formulaText;

  // Entrada do card translúcido
  const cardSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const cardTranslateY = interpolate(cardSpring, [0, 1], [50, 0]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Efeito Máquina de Escrever (Typewriter) para a fórmula
  const startTypeFrame = 35;
  const charsPerSecond = 14;
  const charsPerFrame = charsPerSecond / fps;
  const framesSinceStart = Math.max(0, frame - startTypeFrame);
  const charsToShow = Math.min(
    formula.length,
    Math.floor(framesSinceStart * charsPerFrame)
  );
  const currentFormula = formula.substring(0, charsToShow);

  // Cursor piscante
  const isTyping = charsToShow < formula.length;
  const cursorBlink = Math.floor(frame / 18) % 2 === 0;

  return (
    <AbsoluteFill
      className="relative flex flex-col items-center justify-center p-12 overflow-hidden select-none"
      style={{ backgroundColor: THEME.colors.bg }}
    >
      {/* Áudio da Cena 6 */}
      <SafeAudio src="audio/cena6.mp3" />

      {/* Header Superior */}
      <div className="absolute top-8 left-16 z-20 flex items-center gap-3">
        <div className="px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase">
          Rigor Científico
        </div>
        <h2 className="text-xl font-bold text-slate-200">
          Transparência Metodológica & Fórmulas Abertas
        </h2>
      </div>

      {/* BrowserFrame com a documentação / central de ajuda */}
      <div className="relative w-full max-w-[1720px] h-[860px] mt-8">
        <BrowserFrame
          url="app.ecopulse.greenops.io/help/methodology"
          title="EcoPulse • Scientific Methodology & Formulas"
          className="w-full h-full"
        >
          <SafeVideo
            src="videos/08_help_formulas.mp4"
            fallbackImage="images/ajuda 1.png"
            label="08 - Central de Ajuda & Fórmulas"
            className="w-full h-full"
          />

          {/* Card Translúcido na Base da Tela com Efeito Máquina de Escrever */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-8 py-5 rounded-2xl border-2 border-emerald-500/40 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center"
            style={{
              backgroundColor: THEME.colors.surfaceGlass,
              boxShadow: THEME.shadows.browser,
              opacity: cardOpacity,
              translate: `-50% ${cardTranslateY}px`,
            }}
          >
            {/* Top Tag do Card */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                Modelagem Energética Dinâmica
              </span>
            </div>

            {/* A Fórmula com Efeito Typewriter */}
            <div className="flex items-center justify-center font-mono text-3xl font-black text-slate-100 tracking-wide my-1">
              <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">
                {currentFormula}
              </span>
              {(isTyping || cursorBlink) && (
                <span className="inline-block w-3.5 h-8 ml-1 bg-emerald-400 shadow-[0_0_10px_#10B981]" />
              )}
            </div>

            {/* Detalhamento dos Componentes da Fórmula */}
            <div className="mt-3 flex items-center justify-center gap-5 text-xs font-mono text-slate-300">
              <span className="px-3 py-1 rounded bg-[#08130F]/90 border border-emerald-500/25">
                <strong className="text-emerald-400">P:</strong> Potência Total (Watts)
              </span>
              <span className="px-3 py-1 rounded bg-[#08130F]/90 border border-emerald-500/25">
                <strong className="text-emerald-400">CPU%:</strong> Coeficiente Base
              </span>
              <span className="px-3 py-1 rounded bg-[#08130F]/90 border border-emerald-500/25">
                <strong className="text-emerald-400">RAM:</strong> Fator PUE 0.375
              </span>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </AbsoluteFill>
  );
};
