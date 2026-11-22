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
 * Coordenadas de conexão vetorial configuráveis no topo do arquivo.
 * Conectam o lado esquerdo (Consumo vs. Emissão) ao lado direito (Carga ou Região).
 */
export const CONNECTOR_COORDS = {
  x1: 910,
  y1: 520,
  x2: 1010,
  y2: 520,
};

/**
 * Cena 4 - Comparação e Causa Raiz
 * Layout Split-Screen (50% / 50%) com gap entre eles:
 *  - Esquerda: videos/05_compare_services.mp4 com tag "Consumo vs. Emissão"
 *  - Direita: videos/06_compare_scatter.mp4 com tag "Carga ou Região?"
 *  - Overlay SVG por cima desenhando linha vetorial verde animada (strokeDashoffset)
 */
export const Cena4Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animação de entrada dos painéis
  const leftSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const rightSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Linha vetorial conectando os dois lados animada via strokeDashoffset
  const lineProgress = interpolate(frame, [45, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineLength = 100; // Distância entre x1 e x2
  const strokeDashoffset = lineLength * (1 - lineProgress);

  return (
    <AbsoluteFill
      className="relative flex flex-col items-center justify-center p-10 overflow-hidden select-none"
      style={{ backgroundColor: THEME.colors.bg }}
    >
      {/* Áudio da Cena 4 */}
      <SafeAudio src="audio/cena4.mp3" />

      {/* Header Central */}
      <div className="absolute top-6 left-14 z-20 flex items-center gap-3">
        <div className="px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase">
          Análise de Causa Raiz
        </div>
        <h2 className="text-xl font-bold text-slate-200">
          Correlação Multivariável entre Consumo Elétrico e Carbono
        </h2>
      </div>

      {/* Layout Split-Screen 50% / 50% */}
      <div className="relative w-full max-w-[1800px] h-[860px] mt-10 grid grid-cols-2 gap-8 items-center">
        {/* Painel Esquerdo: Consumo vs. Emissão */}
        <div
          className="relative w-full h-full flex flex-col"
          style={{
            opacity: interpolate(leftSpring, [0, 1], [0, 1]),
            translate: `${interpolate(leftSpring, [0, 1], [-40, 0])}px 0px`,
          }}
        >
          {/* Tag do Painel Esquerdo */}
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Consumo vs. Emissão
            </span>
            <span className="text-xs font-mono text-slate-400">
              Serviços & Instâncias
            </span>
          </div>

          <BrowserFrame
            url="app.ecopulse.greenops.io/compare/services"
            title="Consumo por Serviço"
            className="w-full flex-1"
          >
            <SafeVideo
              src="videos/05_compare_services.mp4"
              fallbackImage="images/comparação 1.png"
              label="05 - Comparação por Serviços"
              className="w-full h-full"
            />
          </BrowserFrame>
        </div>

        {/* Painel Direito: Carga ou Região? */}
        <div
          className="relative w-full h-full flex flex-col"
          style={{
            opacity: interpolate(rightSpring, [0, 1], [0, 1]),
            translate: `${interpolate(rightSpring, [0, 1], [40, 0])}px 0px`,
          }}
        >
          {/* Tag do Painel Direito */}
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Carga ou Região?
            </span>
            <span className="text-xs font-mono text-slate-400">
              Dispersão Geográfica
            </span>
          </div>

          <BrowserFrame
            url="app.ecopulse.greenops.io/compare/scatter"
            title="Matriz de Dispersão"
            className="w-full flex-1"
          >
            <SafeVideo
              src="videos/06_compare_scatter.mp4"
              fallbackImage="images/comparação 5.png"
              label="06 - Gráfico de Dispersão"
              className="w-full h-full"
            />
          </BrowserFrame>
        </div>
      </div>

      {/* Overlay SVG com Linha Vetorial Conectora Animada */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-40"
        viewBox="0 0 1920 1080"
      >
        <defs>
          <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Linha de conexão animada */}
        <line
          x1={CONNECTOR_COORDS.x1}
          y1={CONNECTOR_COORDS.y1}
          x2={CONNECTOR_COORDS.x2}
          y2={CONNECTOR_COORDS.y2}
          stroke={THEME.colors.primary}
          strokeWidth="3.5"
          strokeDasharray={lineLength}
          strokeDashoffset={strokeDashoffset}
          filter="url(#glow-line)"
        />

        {/* Pontos de conexão nos extremos */}
        {lineProgress > 0.05 && (
          <circle
            cx={CONNECTOR_COORDS.x1}
            cy={CONNECTOR_COORDS.y1}
            r="6"
            fill={THEME.colors.highlight}
            filter="url(#glow-line)"
          />
        )}
        {lineProgress >= 0.95 && (
          <circle
            cx={CONNECTOR_COORDS.x2}
            cy={CONNECTOR_COORDS.y2}
            r="6"
            fill={THEME.colors.highlight}
            filter="url(#glow-line)"
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
