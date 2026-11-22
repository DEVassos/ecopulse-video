import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { SceneShell } from "../components/SceneShell";

const WORDS = [
  { text: "Quanto", highlight: false },
  { text: "sua", highlight: false },
  { text: "infraestrutura", highlight: false },
  { text: "de", highlight: false },
  { text: "TI", highlight: false },
  { text: "custa", highlight: false },
  { text: "em", highlight: false },
  { text: "carbono?", highlight: true },
];

const PILLARS = [
  "Telemetria em Tempo Real",
  "Cálculo Baseado em PUE & CO₂e",
  "Otimização Inteligente de Custos",
];

/**
 * Cena 1 - O Gancho
 * Tipografia cinética revelando a pergunta palavra por palavra, seguida da
 * assinatura do produto e dos três pilares.
 */
export const Cena1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const statsOpacity = interpolate(frame, [110, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <SceneShell sceneKey="cena1" showHeader={false}>
      <div className="w-full flex flex-col items-center text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 mb-10 w-[1152px]">
          {WORDS.map((word, index) => {
            const progress = spring({
              frame: frame - (12 + index * 6),
              fps,
              config: { damping: 12, stiffness: 110, mass: 0.8 },
            });

            return (
              <span
                key={word.text}
                className={`text-7xl font-extrabold tracking-tight ${
                  word.highlight
                    ? "text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.55)]"
                    : "text-slate-100"
                }`}
                style={{
                  opacity: progress,
                  translate: `0px ${interpolate(progress, [0, 1], [40, 0])}px`,
                  scale: interpolate(progress, [0, 1], [0.88, 1]),
                  display: "inline-block",
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>

        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-emerald-400/40 bg-[#0F1F19]/90"
          style={{
            opacity: badgeSpring,
            scale: interpolate(badgeSpring, [0, 1], [0.8, 1]),
            translate: `0px ${interpolate(badgeSpring, [0, 1], [30, 0])}px`,
            boxShadow: THEME.shadows.floatBadge,
          }}
        >
          <span className="relative flex h-3.5 w-3.5 items-center justify-center">
            <span
              className="absolute h-full w-full rounded-full bg-emerald-400"
              style={{ opacity: 0.15 + pulse * 0.35, scale: 1 + pulse * 0.6 }}
            />
            <span className="relative h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_#10B981]" />
          </span>

          <span className="text-xl font-bold tracking-wide text-emerald-300">
            GreenOps na Prática
          </span>

          <div className="h-4 w-[1px] bg-emerald-500/30 mx-1" />

          <span className="text-sm font-mono uppercase tracking-wider text-slate-400">
            EcoPulse Platform
          </span>
        </div>

        <div
          className="mt-8 flex items-center justify-center gap-6 text-sm font-mono text-slate-400"
          style={{ opacity: statsOpacity }}
        >
          {PILLARS.map((pillar, index) => (
            <React.Fragment key={pillar}>
              {index > 0 ? (
                <span className="text-emerald-500/40">•</span>
              ) : null}
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {pillar}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </SceneShell>
  );
};
