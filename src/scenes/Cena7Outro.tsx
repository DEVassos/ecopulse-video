import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { SceneShell } from "../components/SceneShell";
import { SafeImage } from "../components/SafeImage";

/**
 * Cena 7 - Fechamento
 * Retoma o clima da Cena 1: frase de impacto, convite ao estande e assinatura
 * com o logo, terminando em fade para preto.
 */
export const Cena7Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const badgeSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 13, stiffness: 85 },
  });

  const logoSpring = spring({
    frame: frame - 110,
    fps,
    config: { damping: 14, stiffness: 75 },
  });

  const finalFadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <SceneShell sceneKey="cena7" showHeader={false} overlay={
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "#000", opacity: 1 - finalFadeOut }}
      />
    }>
      <div className="w-full flex flex-col items-center text-center max-w-5xl">
        <h1
          className="text-7xl font-black text-slate-100 tracking-tight leading-tight mb-8"
          style={{
            opacity: titleSpring,
            scale: interpolate(titleSpring, [0, 1], [0.88, 1]),
            translate: `0px ${interpolate(titleSpring, [0, 1], [30, 0])}px`,
          }}
        >
          Visão geral, investigação{" "}
          <span className="text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.55)]">
            e decisão.
          </span>
        </h1>

        <div
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-emerald-400/40 bg-[#0F1F19]/90 mb-14"
          style={{
            opacity: badgeSpring,
            scale: interpolate(badgeSpring, [0, 1], [0.8, 1]),
            translate: `0px ${interpolate(badgeSpring, [0, 1], [30, 0])}px`,
            boxShadow: THEME.shadows.floatBadge,
          }}
        >
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span
              className="absolute h-full w-full rounded-full bg-emerald-400"
              style={{ opacity: 0.15 + pulse * 0.35, scale: 1 + pulse * 0.6 }}
            />
            <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
          </span>

          <span className="text-lg font-bold text-slate-200">
            Conheça o projeto no estande
          </span>

          <div className="h-4 w-[1px] bg-emerald-500/30 mx-1" />

          <span className="text-sm font-mono uppercase tracking-wider text-emerald-400 font-bold">
            Equipe DEVassos
          </span>
        </div>

        <div
          className="flex flex-col items-center gap-4"
          style={{
            opacity: logoSpring,
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
    </SceneShell>
  );
};
