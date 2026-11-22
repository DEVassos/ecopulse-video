import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { SafeAudio } from "../components/SafeAudio";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";

/**
 * Cena 3 - Investigação (Emissões)
 * Exibe videos/04_emissions_chart.mp4 dentro do <BrowserFrame>,
 * com um card glassmorphism discreto no canto inferior esquerdo exibindo:
 * "Histórico Completo • Picos • Visão Acumulada".
 */
export const Cena3Emissions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animação de entrada do card glassmorphism
  const cardSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardTranslateY = interpolate(cardSpring, [0, 1], [30, 0]);

  // Pulso discreto do indicador de status
  const pulseScale = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.9, 1.25]
  );

  return (
    <AbsoluteFill
      className="relative flex flex-col items-center justify-center p-12 overflow-hidden select-none"
      style={{ backgroundColor: THEME.colors.bg }}
    >
      {/* Áudio da Cena 3 */}
      <SafeAudio src="audio/cena3.mp3" />

      {/* Header da Cena */}
      <div className="absolute top-8 left-16 z-20 flex items-center gap-3">
        <div className="px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase">
          Diagnóstico Granular
        </div>
        <h2 className="text-xl font-bold text-slate-200">
          Investigação Contínua de Emissões & Métricas Acumuladas
        </h2>
      </div>

      {/* Moldura de Navegador */}
      <div className="relative w-full max-w-[1720px] h-[860px] mt-8">
        <BrowserFrame
          url="app.ecopulse.greenops.io/emissions/history"
          title="EcoPulse • Emissions Analytics"
          className="w-full h-full"
        >
          {/* Vídeo / Print do Gráfico de Emissões */}
          <SafeVideo
            src="videos/04_emissions_chart.mp4"
            fallbackImage="images/emissoes 1.png"
            label="04 - Gráficos de Emissões & Séries Temporais"
            className="w-full h-full"
          />

          {/* Card Glassmorphism no canto inferior esquerdo */}
          <div
            className="absolute bottom-8 left-8 z-30 flex items-center gap-4 px-6 py-4 rounded-2xl border border-emerald-500/35 backdrop-blur-xl shadow-2xl"
            style={{
              backgroundColor: THEME.colors.surfaceGlass,
              boxShadow: THEME.shadows.card,
              opacity: cardOpacity,
              translate: `0px ${cardTranslateY}px`,
            }}
          >
            {/* Indicador de Status com Pulso */}
            <div className="relative flex items-center justify-center">
              <div
                className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34D399]"
                style={{ scale: pulseScale }}
              />
            </div>

            {/* Texto do Card */}
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

            <div className="h-6 w-[1px] bg-emerald-500/25 mx-2" />

            {/* Selo de Frequência de Leitura */}
            <div className="px-3 py-1 rounded bg-[#08130F]/80 border border-emerald-500/25 text-xs font-mono text-slate-300">
              Resolução de 1 Minuto
            </div>
          </div>
        </BrowserFrame>
      </div>
    </AbsoluteFill>
  );
};
