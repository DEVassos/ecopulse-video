/**
 * EcoPulse - Configuração Central da Linha do Tempo (Timeline)
 * Controla durações em segundos de cada uma das 7 cenas, subtítulos e parâmetros.
 */

export interface SceneConfig {
  id: string;
  name: string;
  durationInSeconds: number;
  audioFile: string;
  title: string;
  subtitle: string;
}

export interface TimelineConfig {
  fps: number;
  width: number;
  height: number;
  scenes: {
    cena1: SceneConfig;
    cena2: SceneConfig & {
      subclips: {
        globeRotationSec: number;
        globeZoomSec: number;
        simulationRevealSec: number;
      };
    };
    cena3: SceneConfig;
    cena4: SceneConfig;
    cena5: SceneConfig & {
      pdfRevealPercent: number;
    };
    cena6: SceneConfig & {
      formulaText: string;
    };
    cena7: SceneConfig;
  };
}

export const TIMELINE_CONFIG: TimelineConfig = {
  fps: 60,
  width: 1920,
  height: 1080,
  scenes: {
    cena1: {
      id: "cena1",
      name: "O Gancho",
      durationInSeconds: 20,
      audioFile: "audio/cena1.mp3",
      title: "Quanto sua infraestrutura de TI custa em carbono?",
      subtitle: "GreenOps na Prática",
    },
    cena2: {
      id: "cena2",
      name: "O Mapa e Simulação",
      durationInSeconds: 35,
      audioFile: "audio/cena2.mp3",
      title: "Visão Global & Simulação",
      subtitle: "Alternativa Limpa • Redução de 86,44%",
      subclips: {
        globeRotationSec: 12,
        globeZoomSec: 12,
        simulationRevealSec: 11,
      },
    },
    cena3: {
      id: "cena3",
      name: "Investigação",
      durationInSeconds: 35,
      audioFile: "audio/cena3.mp3",
      title: "Investigação de Emissões",
      subtitle: "Histórico Completo • Picos • Visão Acumulada",
    },
    cena4: {
      id: "cena4",
      name: "Comparação e Causa Raiz",
      durationInSeconds: 45,
      audioFile: "audio/cena4.mp3",
      title: "Causa Raiz",
      subtitle: "Consumo vs. Emissão • Carga ou Região?",
    },
    cena5: {
      id: "cena5",
      name: "Relatórios e PDF",
      durationInSeconds: 35,
      audioFile: "audio/cena5.mp3",
      title: "Relatórios Executivos",
      subtitle: "Tema Claro • Economia de Tinta",
      pdfRevealPercent: 0.55, // Inicia em 55% da cena
    },
    cena6: {
      id: "cena6",
      name: "Maturidade e Transparência",
      durationInSeconds: 25,
      audioFile: "audio/cena6.mp3",
      title: "Transparência Metodológica",
      subtitle: "Fórmulas & Modelagem Energética",
      formulaText: "P = CPU% × 1 + RAM × 0.375",
    },
    cena7: {
      id: "cena7",
      name: "Fechamento",
      durationInSeconds: 15,
      audioFile: "audio/cena7.mp3",
      title: "Visão geral, investigação e decisão.",
      subtitle: "Conheça o projeto no estande • Equipe DEVassos",
    },
  },
};

/**
 * Retorna a duração de uma cena em frames baseada no FPS
 */
export const getSceneDurationInFrames = (
  sceneKey: keyof TimelineConfig["scenes"],
  fps = TIMELINE_CONFIG.fps
): number => {
  const scene = TIMELINE_CONFIG.scenes[sceneKey];
  return Math.round(scene.durationInSeconds * fps);
};

/**
 * Retorna a duração total do vídeo em frames (soma de todas as 7 cenas)
 */
export const getTotalDurationInFrames = (fps = TIMELINE_CONFIG.fps): number => {
  const scenes: SceneConfig[] = Object.values(TIMELINE_CONFIG.scenes);
  const totalSeconds = scenes.reduce(
    (acc: number, scene: SceneConfig) => acc + scene.durationInSeconds,
    0
  );
  return Math.round(totalSeconds * fps);
};

/**
 * Retorna a duração total em segundos
 */
export const getTotalDurationInSeconds = (): number => {
  const scenes: SceneConfig[] = Object.values(TIMELINE_CONFIG.scenes);
  return scenes.reduce(
    (acc: number, scene: SceneConfig) => acc + scene.durationInSeconds,
    0
  );
};
