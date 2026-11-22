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
 * Cena 2 - O Mapa e Simulação
 * Divide o tempo da cena em 3 momentos sequenciais:
 *  1) 01_globe_rotation.mp4 com zoom-in suave (scale de 1.0 para 1.12)
 *  2) 02_globe_zoom.mp4
 *  3) 03_simulation_reveal.mp4 acompanhado de badge flutuante em verde esmeralda:
 *     "Alternativa Limpa • Redução de 86,44%"
 */
export const Cena2Map: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subclips = TIMELINE_CONFIG.scenes.cena2.subclips;
  const f1End = Math.round(subclips.globeRotationSec * fps);
  const f2End = f1End + Math.round(subclips.globeZoomSec * fps);

  // Momento 1: Zoom-in suave de 1.0 a 1.12
  const moment1Scale = interpolate(frame, [0, f1End], [1.0, 1.12], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Momento 3: Badge flutuante de redução com animação spring()
  const badgeStartFrame = f2End + 15;
  const badgeSpring = spring({
    frame: frame - badgeStartFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const isMoment1 = frame < f1End;
  const isMoment2 = frame >= f1End && frame < f2End;
  const isMoment3 = frame >= f2End;

  return (
    <AbsoluteFill
      className="relative flex flex-col items-center justify-center p-12 overflow-hidden select-none"
      style={{ backgroundColor: THEME.colors.bg }}
    >
      {/* Áudio da Cena 2 */}
      <SafeAudio src="audio/cena2.mp3" />

      {/* Título de Contexto no Topo */}
      <div className="absolute top-8 left-16 z-20 flex items-center gap-3">
        <div className="px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase">
          Visão Global
        </div>
        <h2 className="text-xl font-bold text-slate-200">
          Mapeamento Geográfico de Emissões & Simulação
        </h2>
      </div>

      {/* Moldura de Navegador macOS */}
      <div className="relative w-full max-w-[1720px] h-[860px] mt-8">
        <BrowserFrame
          url="app.ecopulse.greenops.io/dashboard/map"
          title="EcoPulse • Global Carbon Mesh"
          className="w-full h-full"
        >
          {/* Momento 1: Rotação do Globo com Zoom Suave */}
          {isMoment1 && (
            <div className="w-full h-full relative">
              <SafeVideo
                src="videos/01_globe_rotation.mp4"
                fallbackImage="images/dashboard 1.png"
                label="01 - Rotação do Globo 3D"
                scale={moment1Scale}
              />
              <div className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 backdrop-blur-md text-xs font-mono text-emerald-300">
                ● Telemetria Multirregional Ativa (AWS, GCP, Azure)
              </div>
            </div>
          )}

          {/* Momento 2: Zoom nos Datacenters */}
          {isMoment2 && (
            <div className="w-full h-full relative">
              <SafeVideo
                src="videos/02_globe_zoom.mp4"
                fallbackImage="images/dashboard 3.png"
                label="02 - Foco em Datacenter Regional"
                scale={1.0}
              />
              <div className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 backdrop-blur-md text-xs font-mono text-emerald-300">
                ● Análise de Carga & Intensidade de Carbono da Rede Elétrica
              </div>
            </div>
          )}

          {/* Momento 3: Revelação da Simulação e Alternativa Limpa */}
          {isMoment3 && (
            <div className="w-full h-full relative">
              <SafeVideo
                src="videos/03_simulation_reveal.mp4"
                fallbackImage="images/dashboard 4.png"
                label="03 - Painel de Simulação"
                scale={1.0}
              />

              {/* Badge Flutuante Esmeralda em Destaque */}
              <div
                className="absolute bottom-10 right-10 z-30 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#08130F]/95 border-2 border-emerald-400/80 backdrop-blur-xl shadow-2xl"
                style={{
                  opacity: interpolate(badgeSpring, [0, 1], [0, 1]),
                  scale: interpolate(badgeSpring, [0, 1], [0.8, 1]),
                  translate: `0px ${interpolate(badgeSpring, [0, 1], [40, 0])}px`,
                  boxShadow: THEME.shadows.glow,
                }}
              >
                {/* Ícone de Raio / Eficiência */}
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>

                {/* Conteúdo do Badge */}
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                    Recomendação Inteligente
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-slate-100">
                      Alternativa Limpa
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-2xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                      Redução de 86,44%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </BrowserFrame>
      </div>
    </AbsoluteFill>
  );
};
