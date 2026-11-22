import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import { CENA2_MOMENTS } from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";

/**
 * Cena 2 - O Mapa e Simulação
 * A cena é dividida em 3 momentos (rotação do globo, zoom regional e
 * revelação da simulação). As fronteiras são frações da duração da cena, então
 * acompanham qualquer mudança na narração.
 */
export const Cena2Map: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const rotationEnd = Math.round(durationInFrames * CENA2_MOMENTS.globeRotation);
  const zoomEnd = rotationEnd + Math.round(durationInFrames * CENA2_MOMENTS.globeZoom);
  const badgeStart = zoomEnd + 12;

  const moment1Scale = interpolate(frame, [0, rotationEnd], [1.0, 1.1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const badgeSpring = spring({
    frame: frame - badgeStart,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const legend =
    frame < rotationEnd
      ? "● Telemetria Multirregional Ativa (AWS, GCP, Azure)"
      : frame < zoomEnd
        ? "● Análise de Carga & Intensidade de Carbono da Rede Elétrica"
        : "● Simulação de Migração para Região Mais Limpa";

  return (
    <SceneShell sceneKey="cena2">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/dashboard/map"
        title="EcoPulse • Global Carbon Mesh"
      >
        {frame < rotationEnd ? (
          <SafeVideo
            src="videos/01_globe_rotation.mp4"
            label="01 - Rotação do Globo 3D"
            scale={moment1Scale}
            kenBurns={false}
            className="w-full h-full"
          />
        ) : frame < zoomEnd ? (
          <SafeVideo
            src="videos/02_globe_zoom.mp4"
            label="02 - Foco em Datacenter Regional"
            className="w-full h-full"
          />
        ) : (
          <SafeVideo
            src="videos/03_simulation_reveal.mp4"
            label="03 - Painel de Simulação"
            className="w-full h-full"
          />
        )}

        {/* Legenda do momento atual */}
        <div className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          {legend}
        </div>

        {/* Badge da recomendação, só na revelação da simulação */}
        {frame >= badgeStart ? (
          <div
            className="absolute bottom-6 right-6 z-30 flex items-center gap-4 px-5 py-3 rounded-2xl bg-[#08130F]/95 border-2 border-emerald-400/80"
            style={{
              opacity: badgeSpring,
              scale: interpolate(badgeSpring, [0, 1], [0.8, 1]),
              translate: `0px ${interpolate(badgeSpring, [0, 1], [40, 0])}px`,
              boxShadow: THEME.shadows.glow,
            }}
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                Recomendação Inteligente
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black tracking-tight text-slate-100">
                  Alternativa Limpa
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  Redução de 86,44%
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </BrowserFrame>
    </SceneShell>
  );
};
