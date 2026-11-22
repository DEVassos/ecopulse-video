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

/**
 * Cena 1 - O Gancho (Hook)
 * Kinetic typography animada com spring() revelando palavra por palavra:
 * "Quanto sua infraestrutura de TI custa em carbono?"
 * seguido pelo badge "GreenOps na Prática".
 */
export const Cena1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "Quanto", highlight: false },
    { text: "sua", highlight: false },
    { text: "infraestrutura", highlight: false },
    { text: "de", highlight: false },
    { text: "TI", highlight: false },
    { text: "custa", highlight: false },
    { text: "em", highlight: false },
    { text: "carbono?", highlight: true },
  ];

  // Grid animado sutil de fundo
  const gridOpacity = interpolate(frame, [0, 60], [0, 0.22], {
    extrapolateRight: "clamp",
  });

  const ambientPulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.5),
    [-1, 1],
    [0.18, 0.32]
  );

  // Animação de entrada do Badge "GreenOps na Prática"
  const badgeSpring = spring({
    frame: frame - 65, // Aparece após as palavras
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Fade in sutil da barra de estatística
  const statsOpacity = interpolate(frame, [110, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="relative flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: THEME.colors.bg }}
    >
      {/* Áudio da Cena 1 */}
      <SafeAudio src="audio/cena1.mp3" />

      {/* Grid Tecnológico com movimento suave */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: `center ${frame * 0.25}px`,
        }}
      />

      {/* Luz Radial Esmeralda no Centro */}
      <div
        className="absolute w-[900px] h-[600px] rounded-full pointer-events-none blur-[140px]"
        style={{
          background: `radial-gradient(circle, ${THEME.colors.primary} 0%, transparent 70%)`,
          opacity: ambientPulse,
        }}
      />

      {/* Container Central de Conteúdo */}
      <div className="relative z-10 max-w-5xl px-12 flex flex-col items-center text-center">
        {/* Kinetic Typography - Revelação Palavra por Palavra */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 mb-10">
          {words.map((item, index) => {
            const wordDelay = 12 + index * 6; // Entrada escalonada rítmica
            const wordSpring = spring({
              frame: frame - wordDelay,
              fps,
              config: { damping: 12, stiffness: 110, mass: 0.8 },
            });

            const translateY = interpolate(wordSpring, [0, 1], [40, 0]);
            const opacity = interpolate(wordSpring, [0, 1], [0, 1]);
            const scale = interpolate(wordSpring, [0, 1], [0.85, 1]);

            return (
              <span
                key={index}
                className={`text-6xl md:text-7xl font-extrabold tracking-tight ${
                  item.highlight
                    ? "text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.55)]"
                    : "text-slate-100"
                }`}
                style={{
                  opacity,
                  translate: `0px ${translateY}px`,
                  scale,
                  display: "inline-block",
                }}
              >
                {item.text}
              </span>
            );
          })}
        </div>

        {/* Badge: "GreenOps na Prática" */}
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-emerald-400/40 bg-[#0F1F19]/90 backdrop-blur-xl shadow-2xl"
          style={{
            opacity: interpolate(badgeSpring, [0, 1], [0, 1]),
            scale: interpolate(badgeSpring, [0, 1], [0.8, 1]),
            translate: `0px ${interpolate(badgeSpring, [0, 1], [30, 0])}px`,
            boxShadow: THEME.shadows.floatBadge,
          }}
        >
          {/* Ícone de Pulso Verde */}
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-[0_0_12px_#10B981]" />
          </span>

          <span className="text-xl font-bold tracking-wide text-emerald-300">
            GreenOps na Prática
          </span>

          <div className="h-4 w-[1px] bg-emerald-500/30 mx-1" />

          <span className="text-sm font-mono uppercase tracking-wider text-slate-400">
            EcoPulse Platform
          </span>
        </div>

        {/* Subtítulo Tecnológico de Apoio */}
        <div
          className="mt-8 flex items-center justify-center gap-6 text-sm font-mono text-slate-400"
          style={{ opacity: statsOpacity }}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Telemetria em Tempo Real
          </span>
          <span className="text-emerald-500/40">•</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Cálculo Baseado em PUE & CO₂e
          </span>
          <span className="text-emerald-500/40">•</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Otimização Inteligente de Custos
          </span>
        </div>
      </div>

      {/* Faixa Decorativa Superior & Inferior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </AbsoluteFill>
  );
};
