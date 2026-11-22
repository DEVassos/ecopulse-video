import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import { CENA5_PDF_REVEAL } from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";
import { SafeImage } from "../components/SafeImage";

/**
 * Cena 5 - Relatórios e PDF
 * O relatório Pareto fica ao fundo e, na segunda metade da cena, a página do
 * PDF exportado entra deslizando pela direita e flutua sobre a tela.
 */
export const Cena5Report: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const pdfStart = Math.round(durationInFrames * CENA5_PDF_REVEAL);

  const pdfSpring = spring({
    frame: frame - pdfStart,
    fps,
    config: { damping: 13, stiffness: 85 },
  });

  const sealSpring = spring({
    frame: frame - (pdfStart + 20),
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const floatY = interpolate(
    Math.sin(((frame - pdfStart) / fps) * Math.PI * 1.5),
    [-1, 1],
    [-8, 8]
  );

  return (
    <SceneShell sceneKey="cena5">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/reports/pareto"
        title="EcoPulse • Curva de Pareto & Conformidade ESG"
      >
        <SafeVideo
          src="videos/07_report_pareto.mp4"
          label="07 - Relatório Pareto & Auditoria"
          className="w-full h-full"
        />
      </BrowserFrame>

      {frame >= pdfStart ? (
        <div
          className="absolute z-30 rounded-2xl overflow-hidden border-2 border-emerald-400/50"
          style={{
            width: 420,
            height: 594,
            right: 40,
            top: "50%",
            marginTop: -297 + floatY,
            opacity: pdfSpring,
            rotate: `${interpolate(pdfSpring, [0, 1], [6, -2])}deg`,
            translate: `${interpolate(pdfSpring, [0, 1], [400, 0])}px 0px`,
            boxShadow:
              "0 35px 70px -15px rgba(0,0,0,0.9), 0 0 30px rgba(16,185,129,0.3)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-8 px-4 bg-slate-900/95 flex items-center justify-between border-b border-emerald-500/30 z-10">
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              EcoPulse_Relatorio_Executivo.pdf
            </span>
            <span className="text-[10px] font-mono text-slate-400">PDF</span>
          </div>

          <div className="w-full h-full pt-8 bg-white">
            <SafeImage
              src="images/relatorio-pdf-1.png"
              alt="Relatório executivo exportado em PDF"
              className="w-full h-full object-contain object-top"
            />
          </div>

          {/* Selo: Tema Claro • Economia de Tinta */}
          <div
            className="absolute bottom-4 left-4 z-40 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#08130F]/95 border-2 border-emerald-400"
            style={{
              scale: interpolate(sealSpring, [0, 1], [0.6, 1]),
              opacity: sealSpring,
              boxShadow: THEME.shadows.glow,
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                Sustentabilidade Real
              </span>
              <span className="text-sm font-extrabold text-slate-100 tracking-tight whitespace-nowrap">
                Tema Claro • Economia de Tinta
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </SceneShell>
  );
};
