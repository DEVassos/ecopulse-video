import React from "react";
import {
  OffthreadVideo,
  staticFile,
  Img,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { THEME } from "../config/theme";
import { hasRecordedVideo, VIDEO_ASSET_MAP } from "../config/assets";

export interface SafeVideoProps {
  src: string; // e.g. "videos/01_globe_rotation.mp4"
  fallbackImage?: string; // e.g. "images/dashboard 1.png"
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  scale?: number;
  trimBefore?: number;
  durationInFrames?: number;
  volume?: number;
}

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
}) => {
  const frame = useCurrentFrame();
  const isVideoAvailable = hasRecordedVideo(src);

  // Se o vídeo físico existe, renderiza diretamente com <OffthreadVideo>
  if (isVideoAvailable) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden ${className}`}
        style={{ ...style, backgroundColor: THEME.colors.bg }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          trimBefore={trimBefore}
          durationInFrames={durationInFrames}
          volume={volume}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: scale,
          }}
        />
      </div>
    );
  }

  // Se não existe, busca fallback configurado no mapeamento ou prop
  const mapping = VIDEO_ASSET_MAP[src];
  const resolvedImage = fallbackImage || mapping?.fallbackImage;
  const displayLabel = label || mapping?.label || src;
  const displaySpecs = mapping?.specs || "1080p • 60fps • Proporção 16:9";

  // Efeito Ken Burns sutil para dar vida ao print estático
  const kenBurnsScale = interpolate(frame, [0, 600], [1.0, 1.05], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const subtlePanY = interpolate(frame, [0, 600], [0, -10], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  if (resolvedImage) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden select-none ${className}`}
        style={{
          ...style,
          backgroundColor: THEME.colors.bg,
        }}
      >
        {/* Screenshot real do app com leve movimento de câmera */}
        <div
          className="w-full h-full"
          style={{
            scale: scale * kenBurnsScale,
            translate: `0px ${subtlePanY}px`,
          }}
        >
          <Img
            src={staticFile(resolvedImage)}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Badge discreto indicando modo de prévia / gravação futura */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08130F]/85 border border-emerald-500/40 backdrop-blur-md shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono tracking-wide text-emerald-300">
            PRÉVIA: {displayLabel}
          </span>
        </div>

        {/* Rodapé sutil com o caminho do arquivo esperado */}
        <div className="absolute bottom-3 right-4 z-20 px-2.5 py-1 rounded bg-[#08130F]/90 border border-emerald-500/20 text-[10px] font-mono text-slate-400 backdrop-blur-sm">
          Aguardando: <span className="text-emerald-400">{src}</span>
        </div>
      </div>
    );
  }

  // Placeholder visual Dark Tech caso não haja nem vídeo nem imagem de fallback
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden ${className}`}
      style={{
        ...style,
        backgroundColor: THEME.colors.bg,
        backgroundImage: `radial-gradient(circle at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%)`,
      }}
    >
      {/* Grid de fundo */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #10B981 1px, transparent 1px), linear-gradient(to bottom, #10B981 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ícone com pulso tecnológico */}
      <div className="relative mb-5 flex items-center justify-center">
        <div
          className="absolute w-20 h-20 rounded-full bg-emerald-500/20 blur-xl animate-pulse"
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

      {/* Título do placeholder */}
      <div className="text-center z-10 max-w-md">
        <h3 className="text-lg font-semibold text-slate-100 mb-1 tracking-tight">
          {displayLabel}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Espaço reservado para gravação de tela
        </p>

        {/* Card de especificações técnicas */}
        <div className="inline-flex flex-col gap-1.5 px-4 py-2.5 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 text-left font-mono text-[11px] backdrop-blur-md">
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
