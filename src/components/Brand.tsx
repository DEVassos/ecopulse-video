import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../config/theme";

/**
 * Wordmark oficial do EcoPulse (ícone + "EcoPulse"), portado da aplicação.
 *
 * Na app a animação é SMIL (`begin="indefinite"` disparado por JS), o que não
 * funciona em render determinístico. Aqui o mesmo keyframe é reconstruído com
 * `useCurrentFrame()`: a folha se transforma em batimento cardíaco e volta.
 *
 * Cores oficiais:
 * - folha `#10B981` · pulse `#FACC15` · texto `#E2E8F0` · neon `#5CFFB8`
 */

const COLOR = {
  leaf: "#10B981",
  pulse: "#FACC15",
  text: "#E2E8F0",
  neon: "#5CFFB8",
} as const;

/** Duração de um ciclo completo de batimento (mesma da app). */
const CYCLE_SECONDS = 2.4;

type Point = readonly [number, number];

const STEM_POINTS: readonly Point[] = [
  [2, 21],
  [2.4, 19.2],
  [3.6, 17.4],
  [5.2, 16],
  [7.1, 15],
  [9, 14.4],
  [11, 13.4],
  [13, 12],
];

const HEARTBEAT_POINTS: readonly Point[] = [
  [1, 13],
  [6, 13],
  [8, 11.5],
  [9.5, 13],
  [11.5, 5],
  [13.5, 19],
  [15.5, 13],
  [23, 13],
];

const LEAF_PATH =
  "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z";

const round = (value: number): number => Math.round(value * 1000) / 1000;

/** Monta o `d` a partir dos pontos. */
const toPath = (points: readonly Point[]): string =>
  points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${round(x)} ${round(y)}`)
    .join(" ");

/** Interpola cada vértice entre a folha e o batimento. */
const morphPoints = (progress: number): readonly Point[] =>
  STEM_POINTS.map(([sx, sy], index) => {
    const [bx, by] = HEARTBEAT_POINTS[index];
    return [sx + (bx - sx) * progress, sy + (by - sy) * progress] as const;
  });

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Curva do keyframe original (`.5 0 .2 1`). */
const EASE = Easing.bezier(0.5, 0, 0.2, 1);

/** 0 → 1 (até 28%) · segura · 1 → 0 (de 72% a 100%). */
const holdProgress = (t: number): number => {
  if (t <= 0.28) {
    return interpolate(t, [0, 0.28], [0, 1], { ...CLAMP, easing: EASE });
  }
  if (t <= 0.72) {
    return 1;
  }
  return interpolate(t, [0.72, 1], [1, 0], { ...CLAMP, easing: EASE });
};

export interface BrandProps {
  /** Frame (relativo à cena) em que o batimento começa. */
  startFrame?: number;
  /** Tamanho do wordmark em px — ícone, gap e espaçamento acompanham. */
  fontSize?: number;
  /** Intervalo entre batimentos em segundos. `0` (padrão) toca uma vez só. */
  repeatSeconds?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Brand: React.FC<BrandProps> = ({
  startFrame = 0,
  fontSize = 24,
  repeatSeconds = 0,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cycleFrames = Math.round(CYCLE_SECONDS * fps);
  const elapsed = Math.max(0, frame - startFrame);
  const local =
    repeatSeconds > 0 ? elapsed % cycleFrames : Math.min(elapsed, cycleFrames);
  const t = local / cycleFrames;

  const progress = holdProgress(t);
  const leafDashOffset = round(progress * 1.05);
  const stemPath = toPath(morphPoints(progress));

  const pulseOpacity = interpolate(
    t,
    [0, 0.28, 0.32, 0.66, 0.72, 1],
    [0, 0, 1, 1, 0, 0],
    CLAMP
  );

  const pulseDashOffset = interpolate(
    t,
    [0, 0.3, 0.7, 1],
    [0.28, 0.28, -1, -1],
    CLAMP
  );

  const iconSize = fontSize * 1.25;
  const glow = fontSize * 0.09;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${fontSize * 0.42}px`,
        ...style,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={COLOR.leaf}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="EcoPulse"
        style={{ overflow: "visible", flexShrink: 0 }}
      >
        <path
          pathLength={1}
          strokeDasharray="1 2"
          strokeDashoffset={leafDashOffset}
          d={LEAF_PATH}
        />

        <path d={stemPath} />

        <path
          pathLength={1}
          strokeDasharray="0.28 1.2"
          strokeDashoffset={pulseDashOffset}
          opacity={pulseOpacity}
          d={toPath(HEARTBEAT_POINTS)}
          style={{
            stroke: COLOR.neon,
            filter: `drop-shadow(0 0 ${glow}px rgba(92, 255, 184, 0.35))`,
          }}
        />
      </svg>

      <span
        style={{
          fontFamily: THEME.fonts.brand,
          fontSize,
          fontWeight: 700,
          letterSpacing: "-0.0208em",
          lineHeight: 1,
          color: COLOR.text,
          whiteSpace: "nowrap",
        }}
      >
        Eco<span style={{ color: COLOR.pulse }}>Pulse</span>
      </span>
    </div>
  );
};
