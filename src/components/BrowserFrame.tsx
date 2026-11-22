import React from "react";
import { THEME } from "../config/theme";

export interface BrowserFrameProps {
  children: React.ReactNode;
  url?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  contentClassName?: string;
}

/**
 * Moldura de navegador minimalista estilo macOS Dark Tech.
 * Possui botões da janela, barra de endereço discreta e acabamento esmeralda.
 */
export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  children,
  url = "app.ecopulse.greenops.io",
  title = "EcoPulse • GreenOps Platform",
  className = "",
  style = {},
  glow = true,
  contentClassName = "",
}) => {
  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden border border-emerald-500/25 transition-all ${className}`}
      style={{
        backgroundColor: THEME.colors.surface,
        boxShadow: glow ? THEME.shadows.browser : THEME.shadows.card,
        ...style,
      }}
    >
      {/* Barra de Título / Header macOS Minimalista */}
      <div className="h-11 px-4 flex items-center justify-between border-b border-emerald-500/15 bg-[#0A1612]/90 backdrop-blur-md select-none">
        {/* Controles da janela macOS */}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full opacity-85 hover:opacity-100 transition-opacity"
            style={{ backgroundColor: THEME.colors.macClose }}
          />
          <div
            className="w-3 h-3 rounded-full opacity-85 hover:opacity-100 transition-opacity"
            style={{ backgroundColor: THEME.colors.macMinimize }}
          />
          <div
            className="w-3 h-3 rounded-full opacity-85 hover:opacity-100 transition-opacity"
            style={{ backgroundColor: THEME.colors.macMaximize }}
          />
        </div>

        {/* Barra de Endereço Central */}
        <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-[#08130F]/90 border border-emerald-500/20 text-xs font-mono text-slate-300 shadow-inner">
          {/* Ícone de Cadeado SSL Verde */}
          <svg
            className="w-3.5 h-3.5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-slate-400">https://</span>
          <span className="text-emerald-300 font-medium">{url}</span>
        </div>

        {/* Badge Lateral / Status do SaaS */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
            {title}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            PROD
          </span>
        </div>
      </div>

      {/* Conteúdo / Tela da Aplicação */}
      <div className={`relative flex-1 w-full overflow-hidden ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};
