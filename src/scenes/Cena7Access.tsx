import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../config/theme";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import {
  CENA7_OVERLAYS,
  CENA7_TRIM_BEFORE_SECONDS,
  CENA7_VIDEO,
} from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";

const ACCENT = THEME.colors.highlight;

/**
 * Selo do começo da cena, na fala "o acesso também é controlado".
 * Vai no canto inferior direito porque o topo da página já tem a navegação.
 */
const AccessBadge: React.FC<{ inSeconds: number; outSeconds: number }> = ({
  inSeconds,
  outSeconds,
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
    <AbsoluteFill className="pointer-events-none">
      <div
        className="absolute bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl border"
        style={{
          backgroundColor: THEME.colors.surfaceGlass,
          borderColor: THEME.colors.borderStrong,
          boxShadow: THEME.shadows.floatBadge,
          opacity: enter * exit,
          translate: `0 ${interpolate(enter, [0, 1], [22, 0])}px`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l7 3v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6l7-3z"
            stroke={ACCENT}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2.2 2.2L15.5 10"
            stroke={ACCENT}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-mono text-[18px] font-bold tracking-[0.06em] text-emerald-200">
          ACESSO CONTROLADO PELO ADMINISTRADOR
        </span>
      </div>
    </AbsoluteFill>
  );
};

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
 * Realce retangular sobre uma área da própria tela do app. A moldura fica
 * fixa (as coordenadas foram medidas na gravação) e só respira com um halo.
 */
const Ring: React.FC<RingProps> = ({
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
      className="absolute pointer-events-none"
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
          } px-3 py-1 rounded-md font-mono text-[16px] font-bold uppercase tracking-[0.18em]`}
          style={{ backgroundColor: THEME.colors.primary, color: "#04150F" }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
};

interface ClickRippleProps {
  inSeconds: number;
  outSeconds: number;
  x: number;
  y: number;
  label: string;
}

/** Pulso de clique em cima do botão "Gerar convite". */
const ClickRipple: React.FC<ClickRippleProps> = ({
  inSeconds,
  outSeconds,
  x,
  y,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - inSeconds * fps,
    fps,
    config: { damping: 15, stiffness: 110 },
  });
  const exit = interpolate(
    frame,
    [outSeconds * fps, outSeconds * fps + 0.35 * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const elapsed = frame / fps - inSeconds;
  const radius = 46;

  return (
    <>
      {[0, 0.45].map((offset) => {
        const local = (((elapsed - offset) % 0.9) + 0.9) % 0.9;
        const progress = local / 0.9;

        return (
          <div
            key={offset}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: x - radius,
              top: y - radius,
              width: radius * 2,
              height: radius * 2,
              border: `3px solid ${ACCENT}`,
              opacity: enter * exit * (1 - progress),
              scale: 0.4 + progress * 1.15,
            }}
          />
        );
      })}

      <div
        className="absolute pointer-events-none"
        style={{
          left: x + 84,
          top: y - 20,
          opacity: enter * exit,
          translate: `${interpolate(enter, [0, 1], [-18, 0])}px 0`,
        }}
      >
        <span
          className="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-[17px] font-bold uppercase tracking-[0.16em]"
          style={{
            backgroundColor: THEME.colors.surfaceGlass,
            borderColor: THEME.colors.borderStrong,
            boxShadow: THEME.shadows.floatBadge,
            color: THEME.colors.textPrimary,
          }}
        >
          <span className="text-[19px] leading-none text-emerald-300">⌘</span>
          {label}
        </span>
      </div>
    </>
  );
};

/**
 * Fecho da cena na fala "Simples, seguro e sob o controle da empresa.".
 * O scrim apaga a tela do app para o carimbo ser o último assunto da cena.
 */
const ClosingStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const start = CENA7_OVERLAYS.closing.inSeconds * fps;

  const scrim = interpolate(frame, [start, start + 0.7 * fps], [0, 0.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stamp = spring({
    frame: frame - (CENA7_OVERLAYS.closing.inSeconds + 0.3) * fps,
    fps,
    config: { damping: 11, stiffness: 115 },
  });

  return (
    <AbsoluteFill className="pointer-events-none">
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
            Governança de acesso
          </div>
          <div className="mt-3 text-[64px] font-extrabold leading-none text-slate-50">
            Simples · Seguro
          </div>
          <div className="mt-3 text-[36px] font-bold leading-tight text-emerald-300">
            Sob o controle da empresa.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Cena 7 - Controle de Acesso Corporativo.
 *
 * A gravação (`10_config.mp4`) é uma única tomada contínua: a página abre
 * parada, alguém convida um e-mail, escolhe o papel, gera o convite e recebe
 * o link exclusivo com validade. O começo morto é cortado com `trimBefore`
 * para os eventos caírem nas falas certas.
 */
export const Cena7Access: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <SceneShell sceneKey="cena7">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/settings"
        title="EcoPulse • Configuração & Convites"
      >
        <SafeVideo
          src={CENA7_VIDEO.src}
          label="10 - Configuração & Convites"
          className="w-full h-full"
          trimBefore={Math.round(CENA7_TRIM_BEFORE_SECONDS * fps)}
        />

        <AccessBadge
          inSeconds={CENA7_OVERLAYS.access.inSeconds}
          outSeconds={CENA7_OVERLAYS.access.outSeconds}
        />

        <Ring
          inSeconds={CENA7_OVERLAYS.invite.inSeconds}
          outSeconds={CENA7_OVERLAYS.invite.outSeconds}
          left={68}
          top={444}
          width={1402}
          height={366}
          label="Convite individual"
        />

        <ClickRipple
          inSeconds={CENA7_OVERLAYS.oneClick.inSeconds}
          outSeconds={CENA7_OVERLAYS.oneClick.outSeconds}
          x={150}
          y={768}
          label="1 clique"
        />

        <Ring
          inSeconds={CENA7_OVERLAYS.link.inSeconds}
          outSeconds={CENA7_OVERLAYS.link.outSeconds}
          left={86}
          top={656}
          width={1368}
          height={156}
          label="Link exclusivo com validade"
          labelAlign="right"
        />

        <ClosingStamp />
      </BrowserFrame>
    </SceneShell>
  );
};
