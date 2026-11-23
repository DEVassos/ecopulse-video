import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../config/theme";
import { CENA4_OVERLAYS } from "../config/timeline";

const ACCENT = THEME.colors.highlight;

interface RingProps {
  inSeconds: number;
  outSeconds?: number;
  left: number;
  top: number;
  width: number;
  height: number;
  label?: string;
  labelAlign?: "left" | "right";
}

/**
 * Realce retangular sobre uma área da própria tela do app. As coordenadas
 * foram medidas no frame 1536x864, que é 1:1 com o conteúdo da moldura.
 */
export const Ring: React.FC<RingProps> = ({
  inSeconds,
  outSeconds,
  left,
  top,
  width,
  height,
  label,
  labelAlign = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - inSeconds * fps,
    fps,
    config: { damping: 16, stiffness: 95 },
  });
  const exit =
    outSeconds === undefined
      ? 1
      : interpolate(
          frame,
          [outSeconds * fps, outSeconds * fps + 0.35 * fps],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
  const halo = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 1.2);

  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        left,
        top,
        width,
        height,
        borderRadius: 20,
        border: `2px solid ${ACCENT}`,
        backgroundColor: "rgba(16, 185, 129, 0.07)",
        boxShadow: `inset 0 0 0 1px rgba(6, 78, 59, 0.85), 0 0 ${
          20 + halo * 26
        }px rgba(16, 185, 129, ${0.28 + halo * 0.24})`,
        opacity: enter * exit,
        scale: interpolate(enter, [0, 1], [1.04, 1]),
      }}
    >
      {label ? (
        <span
          className={`absolute -top-4 ${
            labelAlign === "right" ? "right-6" : "left-6"
          } px-3 py-1 rounded-md font-mono text-[17px] font-bold uppercase tracking-[0.16em] whitespace-nowrap`}
          style={{ backgroundColor: THEME.colors.primary, color: "#04150F" }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
};

interface BadgeProps {
  inSeconds: number;
  outSeconds: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}

/** Selo flutuante no canto inferior direito (mesma linguagem da cena 7). */
export const CornerBadge: React.FC<BadgeProps> = ({
  inSeconds,
  outSeconds,
  icon,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - inSeconds * fps,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const exit = interpolate(
    frame,
    [outSeconds * fps, outSeconds * fps + 0.35 * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      className="absolute bottom-6 right-6 z-20 pointer-events-none"
      style={{
        opacity: enter * exit,
        translate: `0px ${interpolate(enter, [0, 1], [22, 0])}px`,
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-sm"
        style={{
          backgroundColor: THEME.colors.surfaceGlass,
          borderColor: THEME.colors.borderStrong,
          boxShadow: THEME.shadows.floatBadge,
        }}
      >
        <span style={{ color: ACCENT }}>{icon}</span>
        <span className="font-mono text-[19px] font-bold uppercase tracking-[0.06em] text-slate-100">
          {children}
        </span>
      </div>
    </div>
  );
};

export const GridIcon: React.FC = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const RankIcon: React.FC = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6h9M4 12h13M4 18h7" />
    <path d="M18 15v6m0 0 3-3m-3 3-3-3" />
  </svg>
);

/**
 * "nós provamos a causa raiz" — a conta que estava escondida no tooltip vira
 * o assunto da tela: os dois extremos da comparação, lado a lado.
 */
export const EquationCallout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const start = CENA4_OVERLAYS.equation.inSeconds;
  const end = CENA4_OVERLAYS.equation.outSeconds;

  const enter = spring({
    frame: frame - start * fps,
    fps,
    config: { damping: 14, stiffness: 105 },
  });
  const exit = interpolate(frame, [end * fps, end * fps + 0.3 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Brilho varrendo a conta, como se a "prova" estivesse sendo destacada.
  const sweep = interpolate(
    frame,
    [(start + 0.15) * fps, (start + 1.1) * fps],
    [-40, 140],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Segunda linha entra depois, fechando o contraste carga x rede.
  const second = interpolate(
    frame,
    [(start + 0.55) * fps, (start + 1.1) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: 226,
        bottom: 34,
        width: 1084,
        opacity: enter * exit,
        translate: `0px ${interpolate(enter, [0, 1], [42, 0])}px`,
        scale: interpolate(enter, [0, 1], [0.96, 1]),
      }}
    >
      <div
        className="relative rounded-2xl border-2 overflow-hidden backdrop-blur-md px-8 py-6"
        style={{
          borderColor: ACCENT,
          backgroundColor: "rgba(6, 26, 20, 0.9)",
          boxShadow: THEME.shadows.glow,
        }}
      >
        <div
          className="absolute inset-y-0 w-[220px] pointer-events-none"
          style={{
            left: `${sweep}%`,
            background:
              "linear-gradient(90deg, transparent, rgba(214,255,240,0.22), transparent)",
          }}
        />

        <div className="flex items-center gap-3 font-mono text-[17px] font-bold uppercase tracking-[0.28em] text-emerald-300">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-300" />
          Carga × Intensidade = Emissão
        </div>

        <div className="mt-4 flex items-baseline gap-4 font-mono text-[30px] font-bold text-slate-50">
          <span className="w-[92px] shrink-0 text-[16px] uppercase tracking-[0.14em] text-emerald-200/80">
            Limpa
          </span>
          <span>0,42006 kWh</span>
          <span style={{ color: ACCENT }}>×</span>
          <span>85,00 g/kWh</span>
          <span style={{ color: ACCENT }}>=</span>
          <span className="text-[34px] text-emerald-300">35,71 g</span>
        </div>

        <div
          className="mt-3 flex items-baseline gap-4 font-mono text-[30px] font-bold text-slate-50"
          style={{
            opacity: second,
            translate: `0px ${interpolate(second, [0, 1], [12, 0])}px`,
          }}
        >
          <span className="w-[92px] shrink-0 text-[16px] uppercase tracking-[0.14em] text-amber-200/80">
            Suja
          </span>
          <span>0,814734 kWh</span>
          <span style={{ color: "#FBBF24" }}>×</span>
          <span>378,00 g/kWh</span>
          <span style={{ color: "#FBBF24" }}>=</span>
          <span className="text-[34px] text-amber-300">307,97 g</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Fecho da cena na fala "nós provamos a causa raiz.".
 * O scrim apaga a tela do app para o veredito ser o último assunto.
 */
export const ClosingStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const start = CENA4_OVERLAYS.closing.inSeconds * fps;

  const scrim = interpolate(frame, [start, start + 0.7 * fps], [0, 0.78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stamp = spring({
    frame: frame - (CENA4_OVERLAYS.closing.inSeconds + 0.3) * fps,
    fps,
    config: { damping: 11, stiffness: 115 },
  });

  return (
    <AbsoluteFill className="pointer-events-none z-40">
      <AbsoluteFill style={{ backgroundColor: `rgba(4, 12, 9, ${scrim})` }} />

      <AbsoluteFill className="items-center justify-center">
        <div
          className="px-14 py-9 rounded-2xl border-4"
          style={{
            borderColor: ACCENT,
            backgroundColor: "rgba(6, 78, 59, 0.55)",
            boxShadow: THEME.shadows.card,
            opacity: stamp,
            scale: interpolate(stamp, [0, 1], [0.72, 1]),
            rotate: interpolate(stamp, [0, 1], ["-8deg", "-2deg"]),
          }}
        >
          <div className="font-mono text-[18px] font-bold uppercase tracking-[0.34em] text-emerald-300">
            Diagnóstico
          </div>
          <div className="mt-3 text-[64px] font-extrabold leading-none text-slate-50">
            Causa raiz provada
          </div>
          <div className="mt-3 text-[36px] font-bold leading-tight text-emerald-300">
            Não é só consumo: é a rede elétrica.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
