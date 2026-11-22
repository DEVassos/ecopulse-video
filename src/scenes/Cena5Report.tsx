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
import { SafeImage } from "../components/SafeImage";

/**
 * Cena 5 - Relatórios e PDF
 * Exibe videos/07_report_pareto.mp4 ao fundo.
 * A partir de 55% da duração da cena, a imagem images/pdf_export.jpg
 * entra deslizando e flutuando com sombra forte no lado direito,
 * acompanhada de um selo animado "Tema Claro • Economia de Tinta".
 */
export const Cena5Report: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneDurationInFrames = Math.round(
    TIMELINE_CONFIG.scenes.cena5.durationInSeconds * fps
  );
  const pdfStartFrame = Math.round(
    sceneDurationInFrames * TIMELINE_CONFIG.scenes.cena5.pdfRevealPercent
  );

  // Animação de entrada do PDF a partir de 55% da duração
  const pdfSpring = spring({
    frame: frame - pdfStartFrame,
    fps,
    config: { damping: 13, stiffness: 85, mass: 1 },
  });

  // Movimento de flutuação suave contínua após a entrada
  const floatY = interpolate(
    Math.sin(((frame - pdfStartFrame) / fps) * Math.PI * 1.5),
    [-1, 1],
    [-8, 8]
  );

  const pdfTranslateX = interpolate(pdfSpring, [0, 1], [400, 0]);
  const pdfOpacity = interpolate(pdfSpring, [0, 1], [0, 1]);
  const pdfRotate = interpolate(pdfSpring, [0, 1], [6, -2]);

  // Entrada do selo animado logo após o PDF
  const sealSpring = spring({
    frame: frame - (pdfStartFrame + 20),
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      className="relative flex flex-col items-center justify-center p-12 overflow-hidden select-none"
      style={{ backgroundColor: THEME.colors.bg }}
    >
      {/* Áudio da Cena 5 */}
      <SafeAudio src="audio/cena5.mp3" />

      {/* Header da Cena */}
      <div className="absolute top-8 left-16 z-20 flex items-center gap-3">
        <div className="px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase">
          Prestação de Contas
        </div>
        <h2 className="text-xl font-bold text-slate-200">
          Relatórios Executivos & Exportação Otimizada
        </h2>
      </div>

      {/* Navegador Principal ao Fundo com Pareto */}
      <div className="relative w-full max-w-[1720px] h-[860px] mt-8">
        <BrowserFrame
          url="app.ecopulse.greenops.io/reports/pareto"
          title="EcoPulse • Curva de Pareto & Conformidade ESG"
          className="w-full h-full"
        >
          <SafeVideo
            src="videos/07_report_pareto.mp4"
            fallbackImage="images/realtorio 1.png"
            label="07 - Relatório Pareto & Auditoria"
            className="w-full h-full"
          />
        </BrowserFrame>

        {/* PDF Deslizando e Flutuando no Lado Direito */}
        {frame >= pdfStartFrame && (
          <div
            className="absolute top-8 right-12 z-30 w-[520px] h-[740px] rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
            style={{
              opacity: pdfOpacity,
              translate: `${pdfTranslateX}px ${floatY}px`,
              rotate: `${pdfRotate}deg`,
              boxShadow: "0 35px 70px -15px rgba(0,0,0,0.9), 0 0 30px rgba(16,185,129,0.3)",
            }}
          >
            {/* Imagem do PDF / Relatório Otimizado */}
            <div className="relative w-full h-full bg-white">
              <SafeImage
                src="images/pdf_export.jpg"
                alt="Relatório PDF Exportado"
                className="w-full h-full object-cover object-top"
              />

              {/* Barra superior de documento minimalista */}
              <div className="absolute top-0 left-0 right-0 h-8 px-4 bg-slate-900/90 backdrop-blur-md flex items-center justify-between border-b border-emerald-500/30">
                <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  EcoPulse_Relatorio_Executivo.pdf
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  EXPORTADO
                </span>
              </div>
            </div>

            {/* Selo Animado: "Tema Claro • Economia de Tinta" */}
            <div
              className="absolute -bottom-2 -left-3 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#08130F]/95 border-2 border-emerald-400 backdrop-blur-xl shadow-2xl"
              style={{
                scale: interpolate(sealSpring, [0, 1], [0.6, 1]),
                opacity: interpolate(sealSpring, [0, 1], [0, 1]),
                boxShadow: THEME.shadows.glow,
              }}
            >
              {/* Ícone de Folha / Economia Sustentável */}
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                  Sustentabilidade Real
                </span>
                <span className="text-sm font-extrabold text-slate-100 tracking-tight whitespace-nowrap">
                  Tema Claro • Economia de Tinta
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
