/**
 * EcoPulse - Registro e Mapeamento de Assets Estáticos
 * Fornece fallback inteligente para os prints reais do app caso os vídeos ainda estejam sendo gravados.
 */

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
    fallbackImage: "images/realtorio 1.png",
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
 * Lista de arquivos de vídeo que já foram gravados fisicamente em public/videos/
 * Quando você gravar e colocar um arquivo .mp4 na pasta public/videos/, adicione o nome dele aqui
 * (ou configure ENABLE_ALL_VIDEOS = true).
 */
export const RECORDED_VIDEOS: string[] = [];

/**
 * Se true, tenta sempre carregar o vídeo real via <OffthreadVideo>.
 * Se false, usa o fallback com o screenshot real animado e elegante enquanto você não gravar os vídeos.
 */
export const FORCE_VIDEO_PLAYBACK = false;

export const hasRecordedVideo = (videoPath: string): boolean => {
  if (FORCE_VIDEO_PLAYBACK) return true;
  return RECORDED_VIDEOS.includes(videoPath);
};
