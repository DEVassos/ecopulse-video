import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import { CENA6_FORMULA } from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";

/**
 * Cena 6 - Maturidade e Transparência
 * A central de ajuda fica ao fundo e um card translúcido digita a fórmula de
 * estimativa de potência usada pelo produto.
 */
export const Cena6Help: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const startTypeFrame = 35;
  const charsPerFrame = 14 / fps;
  const charsToShow = Math.min(
    CENA6_FORMULA.length,
    Math.floor(Math.max(0, frame - startTypeFrame) * charsPerFrame)
  );
  const currentFormula = CENA6_FORMULA.slice(0, charsToShow);
  const isTyping = charsToShow < CENA6_FORMULA.length;
  const cursorBlink = Math.floor(frame / 18) % 2 === 0;
  const pulseOpacity = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 1.4);

  return (
    <SceneShell sceneKey="cena6">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/help/methodology"
        title="EcoPulse • Scientific Methodology & Formulas"
      >
        <SafeVideo
          src="videos/08_help_formulas.mp4"
          label="08 - Central de Ajuda & Fórmulas"
          className="w-full h-full"
        />

        <div
          className="absolute bottom-6 left-1/2 z-30 w-full max-w-3xl px-8 py-4 rounded-2xl border-2 border-emerald-500/40 flex flex-col items-center text-center"
          style={{
            backgroundColor: THEME.colors.surfaceGlass,
            boxShadow: THEME.shadows.browser,
            opacity: cardSpring,
            translate: `-50% ${interpolate(cardSpring, [0, 1], [50, 0])}px`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{ opacity: pulseOpacity }}
            />
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
              Modelagem Energética Dinâmica
            </span>
          </div>

          <div className="flex items-center justify-center font-mono text-3xl font-black text-slate-100 tracking-wide my-1 h-12">
            <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">
              {currentFormula}
            </span>
            {isTyping || cursorBlink ? (
              <span className="inline-block w-3 h-8 ml-1 bg-emerald-400 shadow-[0_0_10px_#10B981]" />
            ) : null}
          </div>

          <div className="mt-2 flex items-center justify-center gap-4 text-xs font-mono text-slate-300">
            <span className="px-3 py-1 rounded bg-[#08130F]/90 border border-emerald-500/25">
              <strong className="text-emerald-400">P:</strong> Potência Total (W)
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
    </SceneShell>
  );
};
