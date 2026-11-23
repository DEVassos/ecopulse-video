import React from "react";
import {
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../config/theme";

/** Opacidade de entrada/saída dentro da janela da sequência. */
const useWindowOpacity = (inFrames = 16, outFrames = 14) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return interpolate(
    frame,
    [0, inFrames, durationInFrames - outFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
};

const IconSwap: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16V4m0 0L3 8m4-4 4 4m6 4v12m0 0 4-4m-4 4-4-4"
    />
  </svg>
);

/**
 * Card da "discrepância": entra na pausa depois de "mais energia que o Audit
 * Stream" e ganha a linha de fecho quando a narração explica a causa raiz.
 */
export const DiscrepancyCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = useWindowOpacity();

  // Segunda parte do card: entra junto com "separa o que é peso da carga..."
  const tail = interpolate(frame, [26, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      className="absolute bottom-6 right-6 z-20"
      style={{
        opacity,
        translate: `0px ${interpolate(opacity, [0, 1], [18, 0])}px`,
        width: 372,
      }}
    >
      <div
        className="rounded-xl border border-emerald-400/45 bg-[#08130F]/95 backdrop-blur-sm p-4"
        style={{ boxShadow: THEME.shadows.glow }}
      >
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-400">
          <IconSwap className="w-3.5 h-3.5" />
          Discrepância
        </div>

        <div className="mt-2 text-[19px] font-semibold leading-tight text-emerald-50">
          Carga não é emissão
        </div>

        <div className="mt-1.5 text-[13px] leading-snug text-emerald-100/70">
          Consumo maior pode significar pegada de carbono menor.
        </div>

        <div
          className="mt-3 pt-3 border-t border-emerald-400/20 flex items-start gap-2"
          style={{
            opacity: tail,
            translate: `0px ${interpolate(tail, [0, 1], [8, 0])}px`,
          }}
        >
          <span className="mt-[3px] block w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
          <span className="text-[12px] leading-snug font-mono text-emerald-300">
            A matriz elétrica local decide.
          </span>
        </div>
      </div>
    </div>
  );
};
