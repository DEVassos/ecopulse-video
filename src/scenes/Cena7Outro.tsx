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
import { SafeImage } from "../components/SafeImage";

/**
 * Cena 7 - Fechamento (Outro)
 * Retorno visual ao tema escuro da Cena 1:
 *  - Frase animada: "Visão geral, investigação e decisão."
 *  - Badge: "Conheça o projeto no estande • Equipe DEVassos"
 *  - Fade final revelando images/logo.png
 */
export const Cena7Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = Math.round(
    TIMELINE_CONFIG.scenes.cena7.durationInSeconds * fps
  );

  // Animação de entrada da frase principal
  const titleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Animação do badge da equipe
  const badgeSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 13, stiffness: 85 },
  });

  // Fade do logo final
  const logoSpring = spring({
    frame: frame - 110,
    fps,
    config: { damping: 14, stiffness: 75 },
  });

  // Fade out final para preto elegante
  const finalFadeOut = interpolate(
    frame,
    [totalFrames - 30, totalFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      className="relative flex flex-col items-center justify-center p-12 overflow-hidden select-none"
      style={{
        backgroundColor: THEME.colors.bg,
        opacity: finalFadeOut,
      }}
    >
      {/* Áudio da Cena 7 */}
      <SafeAudio src="audio/cena7.mp3" />

      {/* Grid Animado Sutil em Sincronia com Cena 1 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: `center ${frame * 0.2}px`,
        }}
      />

      {/* Halo de Luz Esmeralda */}
      <div
        className="absolute w-[800px] h-[500px] rounded-full pointer-events-none blur-[150px] opacity-25"
        style={{
          background: `radial-gradient(circle, ${THEME.colors.highlight} 0%, transparent 70%)`,
        }}
      />

      {/* Container de Conteúdo Central */}
      <div className="relative z-10 max-w-4xl flex flex-col items-center text-center">
        {/* Frase Principal de Impacto */}
        <h1
          className="text-6xl font-black text-slate-100 tracking-tight leading-tight mb-8"
          style={{
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            scale: interpolate(titleSpring, [0, 1], [0.85, 1]),
            translate: `0px ${interpolate(titleSpring, [0, 1], [30, 0])}px`,
          }}
        >
          Visão geral, investigação{" "}
          <span className="text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.55)]">
            e decisão.
          </span>
        </h1>

        {/* Badge: Equipe DEVassos */}
        <div
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-emerald-400/40 bg-[#0F1F19]/90 backdrop-blur-xl shadow-2xl mb-12"
          style={{
            opacity: interpolate(badgeSpring, [0, 1], [0, 1]),
            scale: interpolate(badgeSpring, [0, 1], [0.8, 1]),
            translate: `0px ${interpolate(badgeSpring, [0, 1], [30, 0])}px`,
            boxShadow: THEME.shadows.floatBadge,
          }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_#10B981]" />
          </span>

          <span className="text-lg font-bold text-slate-200">
            Conheça o projeto no estande
          </span>

          <div className="h-4 w-[1px] bg-emerald-500/30 mx-1" />

          <span className="text-sm font-mono uppercase tracking-wider text-emerald-400 font-bold">
            Equipe DEVassos
          </span>
        </div>

        {/* Logo Final com Revelação Suave */}
        <div
          className="flex flex-col items-center gap-4"
          style={{
            opacity: interpolate(logoSpring, [0, 1], [0, 1]),
            scale: interpolate(logoSpring, [0, 1], [0.75, 1]),
            translate: `0px ${interpolate(logoSpring, [0, 1], [25, 0])}px`,
          }}
        >
          <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-emerald-400/50 p-2 bg-[#0F1F19]/90 shadow-[0_0_40px_rgba(16,185,129,0.35)]">
            <SafeImage
              src="images/logo.png"
              alt="Logo EcoPulse"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl font-black tracking-tight text-slate-100">
              EcoPulse
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/90 mt-0.5">
              GreenOps Platform
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
