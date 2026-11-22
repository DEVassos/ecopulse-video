/**
 * EcoPulse - Dark Tech Theme & Visual Identity Tokens
 * Palette: Dark Tech / SaaS Moderno
 */

export const THEME = {
  colors: {
    // Fundo Principal
    bg: "#08130F",
    // Superfícies / Cards
    surface: "#0F1F19",
    // Superfície com transparência para Glassmorphism
    surfaceGlass: "rgba(15, 31, 25, 0.85)",
    surfaceGlassSubtle: "rgba(15, 31, 25, 0.65)",
    
    // Verde Primário Esmeralda
    primary: "#10B981",
    // Verde Destaque
    highlight: "#34D399",
    // Verde Escuro / Fundo sutil
    emeraldDark: "#064E3B",
    
    // Tipografia
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    
    // Bordas e Efeitos
    borderSubtle: "rgba(16, 185, 129, 0.2)",
    borderStrong: "rgba(16, 185, 129, 0.45)",
    glowColor: "rgba(16, 185, 129, 0.35)",
    glowStrong: "rgba(52, 211, 153, 0.6)",
    
    // Cores de Janela macOS
    macClose: "#EF4444",
    macMinimize: "#F59E0B",
    macMaximize: "#10B981",
  },
  shadows: {
    browser: "0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(16, 185, 129, 0.12)",
    card: "0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.15)",
    glow: "0 0 30px rgba(16, 185, 129, 0.45)",
    floatBadge: "0 15px 30px -5px rgba(0, 0, 0, 0.8), 0 0 20px rgba(16, 185, 129, 0.3)",
  },
} as const;
