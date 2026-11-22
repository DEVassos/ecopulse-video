/**
 * EcoPulse - Configuração Central da Linha do Tempo (Timeline)
 *
 * A duração de cada cena NÃO é escolhida à mão: ela é derivada da duração real
 * da narração (src/config/generated/audio.ts) somada a um respiro de
 * `tailSeconds`. Assim picture e som nunca dessincronizam quando um áudio é
 * regravado — basta rodar `npm run scan`.
 */

import { AUDIO_DURATIONS } from "./generated/audio";

export const SCENE_KEYS = [
  "cena1",
  "cena2",
  "cena3",
  "cena4",
  "cena5",
  "cena6",
  "cena7",
] as const;

export type SceneKey = (typeof SCENE_KEYS)[number];

export interface SceneConfig {
  key: SceneKey;
  /** Etiqueta curta exibida na pílula superior */
  label: string;
  /** Headline da cena */
  title: string;
  /** Arquivo de narração relativo a public/ */
  audioFile: string;
  /** Segundos de silêncio mantidos após o fim da narração */
  tailSeconds: number;
}

export interface TimelineConfig {
  fps: number;
  width: number;
  height: number;
  /** Duração do crossfade entre cenas, em frames */
  transitionInFrames: number;
  scenes: Record<SceneKey, SceneConfig>;
}

/** Respiro padrão depois da narração, para a cena "respirar" antes do corte. */
const DEFAULT_TAIL_SECONDS = 0.8;

const scene = (
  key: SceneKey,
  label: string,
  title: string,
  tailSeconds = DEFAULT_TAIL_SECONDS
): SceneConfig => ({
  key,
  label,
  title,
  audioFile: `audio/${key}.mp3`,
  tailSeconds,
});

export const TIMELINE_CONFIG: TimelineConfig = {
  fps: 60,
  width: 1920,
  height: 1080,
  transitionInFrames: 18,
  scenes: {
    cena1: scene(
      "cena1",
      "GreenOps na Prática",
      "Quanto sua infraestrutura de TI custa em carbono?"
    ),
    cena2: scene(
      "cena2",
      "Visão Global",
      "Mapeamento Geográfico de Emissões & Simulação"
    ),
    cena3: scene(
      "cena3",
      "Diagnóstico Granular",
      "Investigação Contínua de Emissões & Métricas Acumuladas"
    ),
    cena4: scene(
      "cena4",
      "Análise de Causa Raiz",
      "Correlação Multivariável entre Consumo Elétrico e Carbono"
    ),
    cena5: scene(
      "cena5",
      "Prestação de Contas",
      "Relatórios Executivos & Exportação Otimizada"
    ),
    cena6: scene(
      "cena6",
      "Rigor Científico",
      "Transparência Metodológica & Fórmulas Abertas"
    ),
    cena7: scene(
      "cena7",
      "Fechamento",
      "Visão geral, investigação e decisão.",
      0.9
    ),
  },
};

export interface Cena1Clip {
  src: string;
  /** Trecho usado da gravação, em segundos do arquivo original. */
  startSeconds: number;
  endSeconds: number;
  /** Fração da cena em que o trecho entra e sai. */
  from: number;
  to: number;
  url: string;
}

/**
 * Cena 1 - fração da cena em que a abertura (fundo + pergunta) termina e as
 * gravações entram. Trechos medidos no material entregue:
 * `00_home_to_login.mp4` (12,36s) tem a Home até ~8s e o corte para o login
 * logo depois; `01_login_typing.mp4` (33,60s) concentra a digitação e o
 * clique em "Entrar" por volta de 25s.
 *
 * A duração de cada trecho é preservada: a diferença entre a janela da cena e
 * o tempo de origem vira `playbackRate` (ver Cena1Hook), então trocar o áudio
 * da narração nunca corta a ação.
 */
export const CENA1_HOOK_END = 0.27;

export const CENA1_CLIPS: readonly Cena1Clip[] = [
  {
    // Home: ultimo trecho antes do corte para o login.
    src: "videos/00_home_to_login.mp4",
    startSeconds: 6,
    endSeconds: 8,
    from: CENA1_HOOK_END,
    to: 0.4,
    url: "app.ecopulse.greenops.io",
  },
  {
    // Corte para a tela de login.
    src: "videos/00_home_to_login.mp4",
    startSeconds: 8.8,
    endSeconds: 11.8,
    from: 0.4,
    to: 0.58,
    url: "app.ecopulse.greenops.io/login",
  },
  {
    // Digitacao do e-mail/senha e clique em "Entrar".
    src: "videos/01_login_typing.mp4",
    startSeconds: 19.6,
    endSeconds: 25.6,
    from: 0.58,
    to: 0.9,
    url: "app.ecopulse.greenops.io/login",
  },
  {
    // Transicao para o dashboard, ja com o badge de boas-vindas.
    src: "videos/01_login_typing.mp4",
    startSeconds: 27.3,
    endSeconds: 29.3,
    from: 0.9,
    to: 1,
    url: "app.ecopulse.greenops.io/dashboard",
  },
] as const;

export interface Cena1HookBeat {
  from: number;
  to: number;
  text: string;
  /** Palavras destacadas em verde. */
  emphasize: readonly string[];
}

/** Cena 1 - a pergunta da abertura, revelada palavra por palavra. */
export const CENA1_HOOK_BEATS: readonly Cena1HookBeat[] = [
  {
    from: 0,
    to: 0.105,
    text: "Sua empresa sabe…",
    emphasize: [],
  },
  {
    from: 0.105,
    to: CENA1_HOOK_END,
    text: "quanto a infraestrutura de TI custa em carbono?",
    emphasize: ["carbono?"],
  },
] as const;

export interface Cena1Caption {
  from: number;
  to: number;
  kicker: string;
  text: string;
  /** Trecho do texto destacado em verde. */
  highlight: string;
}

/** Cena 1 - legendas sincronizadas com as frases da narração. */
export const CENA1_CAPTIONS: readonly Cena1Caption[] = [
  {
    // "O EcoPulse traduz métricas... emissões de CO2" (5,3s -> 10,9s)
    from: CENA1_HOOK_END,
    to: 0.575,
    kicker: "O EcoPulse",
    text: "Traduz métricas de servidores em energia e emissões de CO₂.",
    highlight: "CO₂",
  },
  {
    // "E mais do que isso: mostramos onde você pode economizar" (11,1s -> 15,7s)
    from: 0.575,
    to: 0.83,
    kicker: "GreenOps na prática",
    text: "Nós mostramos exatamente onde você pode economizar.",
    highlight: "economizar",
  },
] as const;

/**
 * Cena 2 - divisão interna em 3 momentos, em frações da duração da cena.
 * Frações (em vez de segundos fixos) mantêm a divisão correta se o áudio mudar.
 */
export const CENA2_MOMENTS = {
  globeRotation: 0.36,
  globeZoom: 0.32,
  // o restante (0.32) é a revelação da simulação
} as const;

/** Cena 5 - a partir de qual fração da cena o PDF entra em tela. */
export const CENA5_PDF_REVEAL = 0.55;

/** Cena 6 - fórmula exibida com efeito máquina de escrever. */
export const CENA6_FORMULA = "P = CPU% × 1 + RAM × 0.375";

/** Composição curta (loop de estande): sem narração, só o arco essencial. */
export const SHORT_SCENE_KEYS: readonly SceneKey[] = [
  "cena1",
  "cena2",
  "cena3",
  "cena7",
];

const audioDurationOf = (key: SceneKey): number => {
  const seconds = AUDIO_DURATIONS[key];
  if (typeof seconds !== "number" || seconds <= 0) {
    throw new Error(
      `Duração de áudio ausente para "${key}". Rode \`npm run scan\` para regenerar src/config/generated/audio.ts.`
    );
  }
  return seconds;
};

const sceneDurationInSeconds = (key: SceneKey): number =>
  audioDurationOf(key) + TIMELINE_CONFIG.scenes[key].tailSeconds;

/** Duração da narração de uma cena, em frames. */
export const getNarrationDurationInFrames = (
  key: SceneKey,
  fps = TIMELINE_CONFIG.fps
): number => Math.round(audioDurationOf(key) * fps);

/** Duração visual de uma cena, em frames (narração + respiro). */
export const getSceneDurationInFrames = (
  key: SceneKey,
  fps = TIMELINE_CONFIG.fps
): number => Math.ceil(sceneDurationInSeconds(key) * fps);

export interface SceneSlot {
  key: SceneKey;
  /** Frame global em que a cena começa a aparecer */
  startFrame: number;
  durationInFrames: number;
  narrationInFrames: number;
}

/**
 * Posiciona uma lista de cenas na timeline global, descontando a sobreposição
 * criada por cada crossfade (é isso que <TransitionSeries> faz internamente).
 */
export const getSceneSlots = (
  keys: readonly SceneKey[],
  fps = TIMELINE_CONFIG.fps
): SceneSlot[] => {
  const slots: SceneSlot[] = [];
  let cursor = 0;

  keys.forEach((key, index) => {
    const durationInFrames = getSceneDurationInFrames(key, fps);
    slots.push({
      key,
      startFrame: cursor,
      durationInFrames,
      narrationInFrames: getNarrationDurationInFrames(key, fps),
    });
    cursor += durationInFrames;
    if (index < keys.length - 1) {
      cursor -= TIMELINE_CONFIG.transitionInFrames;
    }
  });

  return slots;
};

/** Duração total de uma sequência de cenas, já descontados os crossfades. */
export const getSequenceDurationInFrames = (
  keys: readonly SceneKey[] = SCENE_KEYS,
  fps = TIMELINE_CONFIG.fps
): number => {
  const slots = getSceneSlots(keys, fps);
  const last = slots[slots.length - 1];
  return last.startFrame + last.durationInFrames;
};

/** Duração total do vídeo completo (EcoPulseMain). */
export const getTotalDurationInFrames = (
  fps = TIMELINE_CONFIG.fps
): number => getSequenceDurationInFrames(SCENE_KEYS, fps);

/** Duração total em segundos (para exibição/README). */
export const getTotalDurationInSeconds = (
  fps = TIMELINE_CONFIG.fps
): number => getTotalDurationInFrames(fps) / fps;
