import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../config/theme";
import {
  TIMELINE_CONFIG,
  getNarrationDurationInFrames,
  type SceneKey,
} from "../config/timeline";
import { SafeAudio } from "./SafeAudio";

export interface SceneHeaderProps {
  label: string;
  title: string;
  delay?: number;
}

/** Cabeçalho padrão: pílula de categoria + headline da cena. */
export const SceneHeader: React.FC<SceneHeaderProps> = ({
  label,
  title,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      className="flex items-center gap-4"
      style={{
        opacity: progress,
        translate: `${(1 - progress) * -24}px 0px`,
      }}
    >
      <div className="shrink-0 px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase">
        {label}
      </div>
      <h2 className="text-2xl font-bold text-slate-200 tracking-tight">
        {title}
      </h2>
    </div>
  );
};

export interface SceneShellProps {
  sceneKey: SceneKey;
  children: React.ReactNode;
  /** Cenas de tipo/outro não têm cabeçalho. */
  showHeader?: boolean;
  /** Conteúdo extra desenhado acima do miolo (overlays absolutos). */
  overlay?: React.ReactNode;
}

/**
 * Estrutura comum das cenas: fundo Dark Tech, cabeçalho no topo, miolo
 * centralizado e narração da cena (com fade curto de entrada).
 */
export const SceneShell: React.FC<SceneShellProps> = ({
  sceneKey,
  children,
  showHeader = true,
  overlay,
}) => {
  const { label, title, audioFile } = TIMELINE_CONFIG.scenes[sceneKey];
  const { fps } = useVideoConfig();
  const narrationInFrames = getNarrationDurationInFrames(sceneKey, fps);

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ backgroundColor: THEME.colors.bg }}
    >
      <SafeAudio
        src={audioFile}
        fadeInSeconds={0.12}
        fadeOutSeconds={0.25}
        durationInFrames={narrationInFrames}
      />

      {/* Brilho ambiente + grade sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(16,185,129,0.14) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #10B981 1px, transparent 1px), linear-gradient(to bottom, #10B981 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative w-full h-full flex flex-col">
        {showHeader ? (
          <div className="px-16 pt-9 pb-6">
            <SceneHeader label={label} title={title} delay={4} />
          </div>
        ) : null}
        <div className="flex-1 flex items-center justify-center px-16 pb-10 pt-2">
          {children}
        </div>
      </div>

      {overlay}
    </div>
  );
};
