import React from "react";
import { Img, staticFile } from "remotion";
import { THEME } from "../config/theme";

export interface SafeImageProps {
  src: string; // e.g. "images/logo.png"
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackText?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = "Imagem",
  className = "",
  style = {},
  fallbackText,
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <Img
        src={staticFile(src)}
        alt={alt}
        className="w-full h-full object-contain"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          // Em caso de falha de carregamento no navegador, esconde a imagem quebrada
          (e.currentTarget as HTMLElement).style.display = "none";
        }}
      />
      {fallbackText && (
        <noscript>
          <div
            className="w-full h-full flex items-center justify-center p-4 text-xs font-mono text-emerald-400"
            style={{ backgroundColor: THEME.colors.surface }}
          >
            {fallbackText}
          </div>
        </noscript>
      )}
    </div>
  );
};
