import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { SPLIT_PANEL_WIDTH, SPLIT_GAP } from "../config/layout";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";

interface PanelProps {
  tag: string;
  hint: string;
  url: string;
  title: string;
  videoSrc: string;
  label: string;
  enterFrom: number;
  delay: number;
}

const ComparePanel: React.FC<PanelProps> = ({
  tag,
  hint,
  url,
  title,
  videoSrc,
  label,
  enterFrom,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      className="flex flex-col"
      style={{
        width: SPLIT_PANEL_WIDTH,
        opacity: progress,
        translate: `${interpolate(progress, [0, 1], [enterFrom, 0])}px 0px`,
      }}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {tag}
        </span>
        <span className="text-xs font-mono text-slate-400">{hint}</span>
      </div>

      <BrowserFrame width={SPLIT_PANEL_WIDTH} url={url} title={title}>
        <SafeVideo
          src={videoSrc}
          label={label}
          className="w-full h-full"
        />
      </BrowserFrame>
    </div>
  );
};

/**
 * Cena 4 - Comparação e Causa Raiz
 * Split-screen com dois painéis e um conector animado no vão central,
 * ligando "Consumo vs. Emissão" a "Carga ou Região?".
 */
export const Cena4Compare: React.FC = () => {
  const frame = useCurrentFrame();

  const connector = interpolate(frame, [45, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell sceneKey="cena4">
      <div
        className="relative flex items-stretch justify-center"
        style={{ gap: SPLIT_GAP }}
      >
        <ComparePanel
          tag="Consumo vs. Emissão"
          hint="Serviços & Instâncias"
          url="app.ecopulse.greenops.io/compare/services"
          title="Consumo por Serviço"
          videoSrc="videos/05_compare_services.mp4"
          label="05 - Comparação por Serviços"
          enterFrom={-40}
          delay={10}
        />

        <ComparePanel
          tag="Carga ou Região?"
          hint="Dispersão Geográfica"
          url="app.ecopulse.greenops.io/compare/scatter"
          title="Matriz de Dispersão"
          videoSrc="videos/06_compare_scatter.mp4"
          label="06 - Gráfico de Dispersão"
          enterFrom={40}
          delay={20}
        />

        {/* Conector vetorial: cresce do centro para os dois lados */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{ translate: "-50% -50%" }}
        >
          <div
            className="relative flex items-center justify-center"
            style={{ width: SPLIT_GAP, height: 24 }}
          >
            <div
              className="h-[3px] rounded-full"
              style={{
                width: SPLIT_GAP,
                backgroundColor: THEME.colors.primary,
                scale: `${connector} 1`,
                boxShadow: `0 0 12px ${THEME.colors.glowStrong}`,
              }}
            />
            <div
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                left: -4,
                backgroundColor: THEME.colors.highlight,
                scale: connector > 0.05 ? 1 : 0,
                boxShadow: `0 0 14px ${THEME.colors.glowStrong}`,
              }}
            />
            <div
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                right: -4,
                backgroundColor: THEME.colors.highlight,
                scale: connector > 0.95 ? 1 : 0,
                boxShadow: `0 0 14px ${THEME.colors.glowStrong}`,
              }}
            />
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
