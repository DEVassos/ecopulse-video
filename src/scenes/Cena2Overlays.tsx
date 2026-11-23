import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../config/theme";

const PILL =
  "rounded-xl border bg-[#08130F]/95 backdrop-blur-sm px-4 py-2.5 flex items-center gap-3";

/** Opacidade de entrada/saída dentro da janela da sequência. */
const useWindowOpacity = (inFrames = 14, outFrames = 14) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return interpolate(
    frame,
    [0, inFrames, durationInFrames - outFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
};

const IconBolt: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

/** #1 - "o EcoPulse utiliza imagens de satélite reais". */
export const SatelliteBadge: React.FC = () => {
  const opacity = useWindowOpacity();

  return (
    <div
      className="absolute top-6 left-6 z-20"
      style={{
        opacity,
        translate: `0px ${interpolate(opacity, [0, 1], [-18, 0])}px`,
      }}
    >
      <div className={`${PILL} border-emerald-400/45`} style={{ boxShadow: THEME.shadows.glow }}>
        <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1m-8.6 8.6l-2.1 2.1" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono tracking-[0.16em] text-emerald-400/90 font-semibold">
            Fonte de imagem
          </span>
          <span className="text-sm font-bold text-slate-100">Satélite real</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 border-l border-emerald-500/25 pl-3">
          Sentinel-2
          <br />
          Landsat 9
        </span>
      </div>
    </div>
  );
};

const Chip: React.FC<{ kicker: string; value: string; icon: React.ReactNode }> = ({
  kicker,
  value,
  icon,
}) => (
  <div className={`${PILL} border-emerald-500/35 py-2`}>
    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center text-emerald-300">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase font-mono tracking-[0.14em] text-emerald-400/90 font-semibold">
        {kicker}
      </span>
      <span className="text-sm font-bold text-slate-100">{value}</span>
    </div>
  </div>
);

/**
 * #3 - "A plataforma cruza o consumo da sua API com a matriz elétrica local".
 * A linha é desenhada antes do selo de "instantaneamente" entrar.
 */
export const CrossPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = useWindowOpacity(18, 12);
  const draw = interpolate(frame, [14, durationInFrames * 0.62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <div
      className="absolute top-6 left-1/2 z-20 flex items-center gap-4"
      style={{ opacity, translate: "-50% 0px" }}
    >
      <Chip
        kicker="Consumo da API"
        value="12,4 kW"
        icon={<IconBolt className="w-4 h-4" />}
      />

      <div className="relative flex items-center" style={{ width: 190 }}>
        <div
          className="h-[2px] w-full rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(52,211,153,0.15), #34d399)",
            scale: `${draw} 1`,
            transformOrigin: "left center",
            boxShadow: "0 0 12px rgba(52,211,153,0.7)",
          }}
        />
        <div
          className="absolute rounded-full bg-emerald-200"
          style={{
            width: 7,
            height: 7,
            left: `calc(${draw * 100}% - 3px)`,
            opacity: draw > 0.02 ? 1 : 0,
            boxShadow: "0 0 14px #a7f3d0",
          }}
        />
      </div>

      <Chip
        kicker="Matriz elétrica local"
        value="Ontario • 40 g/kWh"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1m-8.6 8.6l-2.1 2.1" />
          </svg>
        }
      />
    </div>
  );
};

/** Selo do "instantaneamente" - entra quando a linha termina de cruzar. */
export const InstantSeal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 140 } });
  const opacity = useWindowOpacity(6, 10) * pop;

  return (
    <div
      className="absolute left-1/2 top-1/2 z-30"
      style={{
        opacity,
        translate: "-50% -50%",
        scale: interpolate(pop, [0, 1], [0.82, 1]),
      }}
    >
      <div
        className="flex items-center gap-3 rounded-2xl border-2 border-emerald-400/80 bg-[#08130F]/95 px-5 py-3"
        style={{ boxShadow: THEME.shadows.glow }}
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
          <IconBolt />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono tracking-[0.16em] text-emerald-400 font-semibold">
            Cruzamento de dados
          </span>
          <span className="text-lg font-black tracking-tight text-slate-100">
            Cálculo instantâneo
          </span>
        </div>
      </div>
    </div>
  );
};

/** #4 - badge da recomendação, agora com o destino e a matriz de origem. */
export const SimulationBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const outro = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute bottom-6 right-6 z-30 flex items-center gap-4 rounded-2xl border-2 border-emerald-400/80 bg-[#08130F]/95 px-5 py-3"
      style={{
        opacity: pop * outro,
        scale: interpolate(pop, [0, 1], [0.8, 1]),
        translate: `0px ${interpolate(pop, [0, 1], [40, 0])}px`,
        boxShadow: THEME.shadows.glow,
      }}
    >
      <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
        <IconBolt className="w-6 h-6" />
      </div>

      <div className="flex flex-col">
        <span className="text-[11px] uppercase font-mono tracking-wider text-emerald-400 font-semibold">
          Recomendação Inteligente
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-slate-400">Migrar para</span>
          <span className="text-xl font-black tracking-tight text-slate-100">Toronto</span>
          <span className="text-slate-500">•</span>
          <span className="text-sm font-mono text-emerald-300">Ontario 40 g/kWh</span>
        </div>
      </div>

      <div className="ml-1 flex flex-col items-end border-l border-emerald-500/30 pl-4">
        <span className="text-[10px] uppercase font-mono tracking-[0.14em] text-slate-400">
          Emissões
        </span>
        <span className="text-2xl font-black tracking-tight text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
          −86,44%
        </span>
      </div>
    </div>
  );
};
