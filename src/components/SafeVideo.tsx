import React from "react";
import {
  OffthreadVideo,
  staticFile,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { THEME } from "../config/theme";
import { hasRecordedVideo, VIDEO_ASSET_MAP } from "../config/assets";
import { isPlaceholderOverlayEnabled } from "../config/preview";

export interface SafeVideoProps {
  /** e.g. "videos/01_globe_rotation.mp4" */
  src: string;
  /** e.g. "images/dashboard 1.png" */
  fallbackImage?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  scale?: number;
  trimBefore?: number;
  durationInFrames?: number;
  volume?: number;
  /** Velocidade de reprodução da gravação (1 = tempo real). */
  playbackRate?: number;
  /** Intensidade do Ken Burns aplicado ao print estático de fallback */
  kenBurns?: boolean;
}

/**
 * Camada de zoom promovida para o compositor (GPU). O conteúdo é rasterizado
 * uma vez no tamanho natural e apenas a camada é escalada, o que elimina o
 * tremor de re-amostragem típico de animar `scale` no próprio <video>.
 */
const ZoomLayer: React.FC<{ scale: number; children: React.ReactNode }> = ({
  scale,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transformOrigin: "center center",
      transform: `translateZ(0) scale(${scale})`,
      willChange: "transform",
      backfaceVisibility: "hidden",
    }}
  >
    {children}
  </div>
);

/**
 * Renderiza a gravação de tela quando ela existe em public/videos/ e cai
 * automaticamente para o print do app enquanto o vídeo não foi gravado.
 *
 * O componente é sempre montado dentro de um box 16:9 (ver BrowserFrame), então
 * `object-contain` nunca corta conteúdo, independente da resolução gravada.
 */
export const SafeVideo: React.FC<SafeVideoProps> = ({
  src,
  fallbackImage,
  label,
  className = "",
  style = {},
  scale = 1,
  trimBefore,
  durationInFrames,
  volume = 1,
  playbackRate = 1,
  kenBurns = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: localDuration, fps } = useVideoConfig();
  const isVideoAvailable = hasRecordedVideo(src);

  if (isVideoAvailable) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden ${className}`}
        style={{ ...style, backgroundColor: "#000" }}
      >
        {/*
         * O zoom vive numa camada própria: o <video> mantém o tamanho fixo (é
         * rasterizado uma única vez) e só a camada é transformada pelo
         * compositor. Animar `scale` direto no elemento fazia o navegador
         * re-layoutar e re-amostrar o frame a cada quadro — era isso que
         * tremia nos zooms.
         */}
        <ZoomLayer scale={scale}>
          <OffthreadVideo
            src={staticFile(src)}
            trimBefore={trimBefore}
            durationInFrames={durationInFrames}
            volume={volume}
            playbackRate={playbackRate}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </ZoomLayer>
      </div>
    );
  }

  const mapping = VIDEO_ASSET_MAP[src];
  const resolvedImage = fallbackImage || mapping?.fallbackImage;
  const displayLabel = label || mapping?.label || src;
  const displaySpecs = mapping?.specs || "1080p • 60fps • Proporção 16:9";
  const showOverlay = isPlaceholderOverlayEnabled();

  // Ken Burns proporcional à duração real da cena: o movimento nunca "congela".
  const total = Math.max(1, durationInFrames ?? localDuration);
  const progress = interpolate(frame, [0, total], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const kenBurnsScale = kenBurns ? 1.02 + progress * 0.04 : 1;
  const panY = kenBurns ? interpolate(frame, [0, total], [0, -8], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  }) : 0;

  if (resolvedImage) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden select-none ${className}`}
        style={{ ...style, backgroundColor: "#000" }}
      >
        <ZoomLayer scale={scale * kenBurnsScale}>
          <Img
            src={staticFile(resolvedImage)}
            className="w-full h-full object-contain"
            style={{ translate: `0px ${panY}px` }}
          />
        </ZoomLayer>

        {showOverlay ? (
          <>
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08130F]/85 border border-emerald-500/40 shadow-lg">
              <span
                className="relative flex h-2.5 w-2.5 items-center justify-center"
                style={{ opacity: 0.5 + 0.5 * Math.sin(frame / 6) }}
              >
                <span className="absolute h-full w-full rounded-full bg-emerald-400/50" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-mono tracking-wide text-emerald-300">
                PRÉVIA: {displayLabel}
              </span>
            </div>

            <div className="absolute bottom-3 right-4 z-20 px-2.5 py-1 rounded bg-[#08130F]/90 border border-emerald-500/20 text-[10px] font-mono text-slate-400">
              Aguardando: <span className="text-emerald-400">{src}</span>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  // Placeholder visual Dark Tech quando não há vídeo nem print de fallback.
  const pulse = spring({
    frame: frame % Math.round(fps * 1.6),
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden ${className}`}
      style={{
        ...style,
        backgroundColor: THEME.colors.bg,
        backgroundImage:
          "radial-gradient(circle at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #10B981 1px, transparent 1px), linear-gradient(to bottom, #10B981 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mb-5 flex items-center justify-center">
        <div
          className="absolute w-20 h-20 rounded-full bg-emerald-500/20 blur-xl"
          style={{ scale: 0.9 + pulse * 0.25, opacity: 0.5 + pulse * 0.4 }}
        />
        <div className="w-16 h-16 rounded-2xl bg-[#0F1F19] border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/50">
          <svg
            className="w-8 h-8 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center z-10 max-w-md">
        <h3 className="text-lg font-semibold text-slate-100 mb-1 tracking-tight">
          {displayLabel}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Espaço reservado para gravação de tela
        </p>

        <div className="inline-flex flex-col gap-1.5 px-4 py-2.5 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 text-left font-mono text-[11px]">
          <div className="text-slate-400 flex items-center justify-between gap-6">
            <span>Arquivo esperado:</span>
            <span className="text-emerald-400 font-bold">{src}</span>
          </div>
          <div className="text-slate-400 flex items-center justify-between gap-6">
            <span>Especificações:</span>
            <span className="text-slate-300">{displaySpecs}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
