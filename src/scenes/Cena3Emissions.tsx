import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";
import { CENA3_VIDEO } from "../config/timeline";

/**
 * Cena 3 - Investigação (Emissões)
 * O gráfico de emissões ocupa a tela inteira e um card glassmorphism entra no
 * canto inferior esquerdo com o resumo do painel analítico.
 */
export const Cena3Emissions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 1.2);

  return (
    <SceneShell sceneKey="cena3">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/emissions/history"
        title="EcoPulse • Emissions Analytics"
      >
        <SafeVideo
          src={CENA3_VIDEO.src}
          trimBefore={Math.round(CENA3_VIDEO.trimStartSeconds * fps)}
          label="05 - Gráficos de Emissões & Séries Temporais"
          className="w-full h-full"
        />

        {/* Card Glassmorphism no canto inferior esquerdo */}
        <div
          className="absolute bottom-6 left-6 z-30 flex items-center gap-4 px-5 py-3 rounded-2xl border border-emerald-500/35"
          style={{
            backgroundColor: THEME.colors.surfaceGlass,
            boxShadow: THEME.shadows.card,
            opacity: cardSpring,
            translate: `0px ${interpolate(cardSpring, [0, 1], [30, 0])}px`,
          }}
        >
          <div
            className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34D399]"
            style={{ scale: 0.9 + pulse * 0.25 }}
          />

          <div className="flex flex-col">
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Painel Analítico
            </div>
            <div className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span>Histórico Completo</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-300">Picos</span>
              <span className="text-slate-500">•</span>
              <span>Visão Acumulada</span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-emerald-500/25 mx-1" />

          <div className="px-3 py-1 rounded bg-[#08130F]/80 border border-emerald-500/25 text-xs font-mono text-slate-300">
            Resolução de 1 Minuto
          </div>
        </div>
      </BrowserFrame>
    </SceneShell>
  );
};
