/**
 * EcoPulse - Registro e Mapeamento de Assets Estáticos
 * Fornece fallback inteligente para os prints reais do app caso os vídeos ainda estejam sendo gravados.
 */

import { RECORDED_VIDEOS } from "./generated/videos";

export interface VideoAssetMapping {
  videoFile: string;
  fallbackImage: string;
  label: string;
  specs: string;
}

export const VIDEO_ASSET_MAP: Record<string, VideoAssetMapping> = {
  "videos/01_globe_rotation.mp4": {
    videoFile: "videos/01_globe_rotation.mp4",
    fallbackImage: "images/dashboard 1.png",
    label: "Rotação do Globo 3D",
    specs: "1080p • 60fps • Rotação suave",
  },
  "videos/02_globe_zoom.mp4": {
    videoFile: "videos/02_globe_zoom.mp4",
    fallbackImage: "images/dashboard 3.png",
    label: "Zoom e Foco em Datacenter",
    specs: "1080p • 60fps • Zoom-in",
  },
  "videos/03_simulation_reveal.mp4": {
    videoFile: "videos/03_simulation_reveal.mp4",
    fallbackImage: "images/dashboard 4.png",
    label: "Simulação e Alternativa Limpa",
    specs: "1080p • 60fps • Painel de simulação",
  },
  "videos/04_emissions_chart.mp4": {
    videoFile: "videos/04_emissions_chart.mp4",
    fallbackImage: "images/emissoes 1.png",
    label: "Gráfico de Emissões & Histórico",
    specs: "1080p • 60fps • Gráfico dinâmico",
  },
  "videos/05_compare_services.mp4": {
    videoFile: "videos/05_compare_services.mp4",
    fallbackImage: "images/comparação 1.png",
    label: "Comparação: Consumo vs. Emissão",
    specs: "1080p • 60fps • Tabela comparativa",
  },
  "videos/06_compare_scatter.mp4": {
    videoFile: "videos/06_compare_scatter.mp4",
    fallbackImage: "images/comparação 5.png",
    label: "Gráfico de Dispersão Carga/Região",
    specs: "1080p • 60fps • Gráfico scatter",
  },
  "videos/07_report_pareto.mp4": {
    videoFile: "videos/07_report_pareto.mp4",
    fallbackImage: "images/relatorio 1.png",
    label: "Relatório Executivo & Pareto",
    specs: "1080p • 60fps • Curva Pareto",
  },
  "videos/08_help_formulas.mp4": {
    videoFile: "videos/08_help_formulas.mp4",
    fallbackImage: "images/ajuda 1.png",
    label: "Central de Ajuda & Fórmulas",
    specs: "1080p • 60fps • Documentação",
  },
};

/**
 * Um vídeo é considerado disponível quando o arquivo .mp4 existe de fato em
 * public/videos/. A lista é gerada por `npm run scan` (scripts/scan-assets.mjs),
 * então gravar um vídeo e rodar o scan basta — sem editar código.
 */
export const hasRecordedVideo = (videoPath: string): boolean =>
  RECORDED_VIDEOS.includes(videoPath);

/** Caminhos ainda pendentes de gravação. */
export const PENDING_VIDEOS: readonly string[] = Object.keys(
  VIDEO_ASSET_MAP
).filter((videoPath) => !hasRecordedVideo(videoPath));
