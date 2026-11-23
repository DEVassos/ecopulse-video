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
import { CENA6_OVERLAYS } from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";

/**
 * Selo do começo da cena, na fala "autenticação e controle de acesso
 * corporativo". Fica no canto para não competir com a página de ajuda ao fundo.
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
        className="absolute top-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl border"
        style={{
          backgroundColor: THEME.colors.surfaceGlass,
          borderColor: THEME.colors.borderStrong,
          boxShadow: THEME.shadows.floatBadge,
          opacity: enter * exit,
          translate: `0 ${interpolate(enter, [0, 1], [-22, 0])}px`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect
            x="4"
            y="10"
            width="16"
            height="11"
            rx="2.5"
            stroke={THEME.colors.highlight}
            strokeWidth="2"
          />
          <path
            d="M8 10V7a4 4 0 0 1 8 0v3"
            stroke={THEME.colors.highlight}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-mono text-[18px] font-bold tracking-[0.06em] text-emerald-200">
          ACESSO CORPORATIVO PROTEGIDO
        </span>
      </div>
    </AbsoluteFill>
  );
};

interface Keyword {
  atSeconds: number;
  text: string;
  accent: string;
}

/**
 * "…nossa página de ajuda documenta todas as fórmulas usadas nos cálculos de
 * potência e carbono." Cada palavra-chave entra na sua fala e permanece, virando
 * um checklist da metodologia até o fim da cena.
 */
const KEYWORDS: readonly Keyword[] = [
  { atSeconds: 7.0, text: "Página de Ajuda", accent: "#34D399" },
  { atSeconds: 9.2, text: "Fórmulas abertas", accent: "#5EEAD4" },
  { atSeconds: 12.9, text: "Potência · Energia · Carbono", accent: "#A3E635" },
];

const MethodCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - CENA6_OVERLAYS.card.inSeconds * fps,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const closing = spring({
    frame: frame - CENA6_OVERLAYS.closing.inSeconds * fps,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill className="pointer-events-none items-center justify-end pb-8">
      <div
        className="w-full max-w-4xl px-10 py-6 rounded-2xl border-2 flex flex-col"
        style={{
          backgroundColor: THEME.colors.surfaceGlass,
          borderColor: THEME.colors.borderStrong,
          boxShadow: THEME.shadows.card,
          opacity: enter,
          translate: `0 ${interpolate(enter, [0, 1], [40, 0])}px`,
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-400"
            style={{
              opacity: 0.55 + 0.45 * Math.sin((frame / fps) * Math.PI * 1.4),
            }}
          />
          <span className="font-mono text-[20px] font-bold uppercase tracking-[0.24em] text-emerald-300">
            Transparência Matemática
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {KEYWORDS.map((keyword) => {
            const item = spring({
              frame: frame - keyword.atSeconds * fps,
              fps,
              config: { damping: 14, stiffness: 130 },
            });

            return (
              <div
                key={keyword.text}
                className="flex items-center gap-4"
                style={{
                  opacity: item,
                  translate: `${interpolate(item, [0, 1], [-28, 0])}px 0`,
                }}
              >
                <span
                  className="w-1.5 self-stretch rounded-full"
                  style={{ backgroundColor: keyword.accent }}
                />
                <span
                  className="text-[30px] font-extrabold leading-tight"
                  style={{ color: keyword.accent }}
                >
                  {keyword.text}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="mt-4 pt-3 border-t flex items-center gap-3"
          style={{
            borderColor: THEME.colors.borderSubtle,
            opacity: closing,
            translate: `0 ${interpolate(closing, [0, 1], [14, 0])}px`,
          }}
        >
          <span className="text-[24px] leading-none text-lime-300">✓</span>
          <span className="text-[24px] font-bold text-slate-100">
            Cada número é rastreável
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Cena 6 - Maturidade e Transparência.
 *
 * A Central de Ajuda fica ao fundo (é ela que documenta as fórmulas) e o card
 * só revela as palavras-chave conforme a locução as cita.
 */
export const Cena6Help: React.FC = () => {
  return (
    <SceneShell sceneKey="cena6">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/help/methodology"
        title="EcoPulse • Scientific Methodology & Formulas"
      >
        <SafeVideo
          src="videos/09_help_formulas.mp4"
          label="09 - Central de Ajuda & Fórmulas"
          className="w-full h-full"
        />

        <AccessBadge
          inSeconds={CENA6_OVERLAYS.access.inSeconds}
          outSeconds={CENA6_OVERLAYS.access.outSeconds}
        />
        <MethodCard />
      </BrowserFrame>
    </SceneShell>
  );
};
