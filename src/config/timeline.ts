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

/* ---------------------------------------------------------------------------
 * CENA 1 - plano de imagem em SEGUNDOS ABSOLUTOS
 *
 * A cena 1 é a única que não cabe no tempo da narração: o gancho ocupa ~5s e a
 * gravação do login (digitação completa + clique em "Entrar" + dashboard) roda
 * até ~25s. Por isso o plano é escrito em segundos reais e a duração da cena é
 * derivada dele (ver `cena1TailSeconds`), em vez de frações da cena.
 *
 * Trechos medidos no material entregue:
 * - `00_home_to_login.mp4` (22,70s): tela inicial e a passagem para o login.
 * - `01_login_typing.mp4` (33,60s): digitação, clique em "Entrar" por volta de
 *   25,5s e dashboard a partir de ~27,3s até o fim do arquivo.
 * ------------------------------------------------------------------------- */

/**
 * Tela limpa no início: só o fundo da marca, sem texto nem selo. Serve também
 * de molde para o fechamento, que volta a esse mesmo vazio para o loop casar.
 */
export const CENA1_INTRO_SECONDS = 1;

/** Segundo da cena em que a pergunta sai e a gravação entra. */
export const CENA1_HOOK_END_SECONDS = 5.1;

export interface Cena1Clip {
  src: string;
  /** Início do trecho no arquivo original. */
  startSeconds: number;
  /** Fim do trecho no arquivo original. */
  endSeconds: number;
  /** 1 = tempo real da gravação; >1 acelera. */
  speed: number;
  /** Segundo da cena em que o trecho começa. */
  atSeconds: number;
  url: string;
  enter?: "whip";
  exit?: "whip";
}

export const CENA1_CLIPS: readonly Cena1Clip[] = [
  {
    // Home e a passagem natural para o login, no tempo real da gravação.
    src: "videos/00_home_to_login.mp4",
    startSeconds: 5.6,
    endSeconds: 12.3,
    speed: 1,
    atSeconds: CENA1_HOOK_END_SECONDS,
    url: "app.ecopulse.greenops.io",
    exit: "whip",
  },
  {
    // Da digitação até o fim do arquivo: clique em "Entrar", carregamento e
    // dashboard já logado, sem pausa no meio.
    src: "videos/01_login_typing.mp4",
    startSeconds: 17,
    endSeconds: 33.6,
    speed: 1,
    atSeconds: 11.8,
    url: "app.ecopulse.greenops.io/login",
    enter: "whip",
  },
] as const;

/** Duração, em segundos de cena, de um trecho já com a velocidade aplicada. */
export const cena1ClipSeconds = (clip: Cena1Clip): number =>
  (clip.endSeconds - clip.startSeconds) / clip.speed;

/** Segundo em que a imagem da cena 1 termina (fim do último trecho). */
export const CENA1_PICTURE_END_SECONDS = CENA1_CLIPS.reduce(
  (end, clip) => Math.max(end, clip.atSeconds + cena1ClipSeconds(clip)),
  0
);

/**
 * Respiro da cena 1 depois da narração: a digitação continua sem locução, com a
 * trilha subindo, até o corte para a cena 2.
 */
const cena1TailSeconds = (): number =>
  Math.max(
    DEFAULT_TAIL_SECONDS,
    CENA1_PICTURE_END_SECONDS - (AUDIO_DURATIONS["cena1"] ?? 0)
  );

export interface Cena1HookBeat {
  atSeconds: number;
  text: string;
  /** Palavras destacadas em verde. */
  emphasize: readonly string[];
}

/** Cena 1 - a pergunta da abertura, revelada palavra por palavra. */
export const CENA1_HOOK_BEATS: readonly Cena1HookBeat[] = [
  { atSeconds: 1.2, text: "Sua empresa sabe…", emphasize: [] },
  {
    // a voz faz uma pausa de 1,7s a 2,0s antes de completar a pergunta
    atSeconds: 1.9,
    text: "quanto a infraestrutura de TI custa em carbono?",
    emphasize: ["carbono?"],
  },
] as const;

export interface Cena1Caption {
  atSeconds: number;
  untilSeconds: number;
  kicker: string;
  text: string;
  /** Trecho do texto destacado em verde. */
  highlight: string;
}

/** Cena 1 - legendas casadas com as frases da narração (18,29s). */
export const CENA1_CAPTIONS: readonly Cena1Caption[] = [
  {
    // "O EcoPulse traduz métricas de servidores em consumo real de energia..."
    atSeconds: 5.3,
    untilSeconds: 10.9,
    kicker: "O EcoPulse",
    text: "Traduz métricas de servidores em energia e emissões de CO₂.",
    highlight: "CO₂",
  },
  {
    // "E mais do que isso: nós mostramos exatamente onde você pode economizar."
    atSeconds: 11.1,
    untilSeconds: 15.7,
    kicker: "GreenOps na prática",
    text: "Nós mostramos exatamente onde você pode economizar.",
    highlight: "economizar",
  },
] as const;

/** Segundo em que entra o selo "Bem-vindos ao GreenOps na prática". */
export const CENA1_BADGE_SECONDS = 15.9;

/* ---------------------------------------------------------------------------
 * CENA 2 - o mapa e a simulação, também em SEGUNDOS ABSOLUTOS
 *
 * Cortes tirados das pausas reais da narração (`cena2.mp3`, 27,56s):
 * - 2,08–2,56  "Tudo começa com a visão global." -> "Enquanto dashboards..."
 * - 8,56–8,80  "...imagens de satélite reais." -> "Cada ponto representa..."
 * - 11,12–11,44 "Cada ponto representa uma região ativa." -> "Navegue pelo globo..."
 * - 20,40–20,64 "instantaneamente." -> "E já aponta a alternativa mais limpa..."
 *
 * O roteiro manda cortar para o zoom na fala "Navegue pelo globo..." e para a
 * simulação na pausa dramática, então os cortes caem em 11,44s e 20,40s.
 * ------------------------------------------------------------------------- */

export interface Cena2Clip {
  src: string;
  /** Início do trecho no arquivo original. */
  startSeconds: number;
  /** Fim do trecho no arquivo original. */
  endSeconds: number;
  /** Segundo da cena em que o trecho entra. */
  atSeconds: number;
  /** Rótulo do momento (aparece na legenda inferior). */
  legend: string;
}

const CENA2_SIMULATION_AT = 20.4;

export const CENA2_CLIPS: readonly Cena2Clip[] = [
  {
    // Globo girando enquanto a narração apresenta a visão global.
    src: "videos/02_globe_rotation.mp4",
    startSeconds: 0,
    endSeconds: 11.44,
    atSeconds: 0,
    legend: "● Telemetria Multirregional Ativa (AWS, GCP, Azure)",
  },
  {
    // "Navegue pelo globo, dê zoom e clique em um data center."
    src: "videos/03_globe_zoom.mp4",
    startSeconds: 0,
    endSeconds: 8.96,
    atSeconds: 11.44,
    legend: "● Análise de Carga & Intensidade de Carbono da Rede Elétrica",
  },
  {
    // Pausa dramática: o trecho final do arquivo é o que mostra o card de 86,44%.
    src: "videos/04_simulation_reveal.mp4",
    startSeconds: 14.2,
    endSeconds: 22.12,
    atSeconds: CENA2_SIMULATION_AT,
    legend: "● Simulação de Migração para Região Mais Limpa",
  },
] as const;

/**
 * Overlays da cena 2 - cada janela começa e termina numa pausa da narração,
 * para o card entrar e sair enquanto ninguém está falando.
 */
export const CENA2_OVERLAYS = {
  /** "Enquanto dashboards comuns usam mapas genéricos... imagens de satélite reais." */
  satellite: { inSeconds: 2.6, outSeconds: 5.1 },
  /** "cruza o consumo da sua API com a matriz elétrica local..." */
  cross: { inSeconds: 14.9, outSeconds: 19.6 },
  /** "...instantaneamente." - selo central do cruzamento. */
  seal: { inSeconds: 18.7, outSeconds: 20.2 },
  /** Pausa dramática: entra o card de recomendação. */
  badge: { inSeconds: 20.8, outSeconds: 27.0 },
} as const;

/** Segundo em que a simulação começa (usado pelo badge de recomendação). */
export const CENA2_SIMULATION_SECONDS = CENA2_SIMULATION_AT;

/** Duração em segundos do trecho de um clipe do plano. */
export const clipSeconds = (clip: { startSeconds: number; endSeconds: number }) =>
  clip.endSeconds - clip.startSeconds;

/** Segundo em que a imagem da cena 2 termina (fim do último trecho do plano). */
export const CENA2_PICTURE_END_SECONDS = CENA2_CLIPS.reduce(
  (end, clip) => Math.max(end, clip.atSeconds + clipSeconds(clip)),
  0
);

/**
 * Respiro da cena 2 depois da narração: o card de simulação continua em tela
 * alguns frames antes do corte para a cena 3.
 */
const cena2TailSeconds = (): number =>
  Math.max(
    DEFAULT_TAIL_SECONDS,
    CENA2_PICTURE_END_SECONDS - (AUDIO_DURATIONS["cena2"] ?? 0)
  );

/* ---------------------------------------------------------------------------
 * CENA 3 - Investigação de Emissões (1:00 - 1:35)
 *
 * Narração (`cena3.mp3`) = 20,51s. Gravação (`05_emissions_chart.mp4`) = 31,28s,
 * com a seguinte estrutura medida frame a frame:
 * - 0,00–4,60s  tela completamente parada, antes da primeira animação
 * - 5,0–9,0s    gráfico se desenhando
 * - 11,0s / 13,5s / 16,5s / 17,5s / 22,5s  cliques e trocas de visão
 * - 26,5–31,3s  tela parada de novo
 *
 * Cortar o arquivo a partir de 4,60s encaixa o clique da visão acumulada
 * (22,5s do arquivo) em 17,9s da cena — exatamente na fala "alterna com um
 * clique para a visão acumulada" (que começa em 14,6s e termina em 20,4s).
 * ------------------------------------------------------------------------- */

export const CENA3_VIDEO = {
  src: "videos/05_emissions_chart.mp4",
  /** Descarta o trecho inicial parado do arquivo. */
  trimStartSeconds: 4.6,
  legend: "● Histórico • Picos • Visão Acumulada",
} as const;

/* ------------------------------------------------------------------------- *
 * CENA 4 - Comparação e Causa Raiz (1:35 - 2:20)
 *
 * Narração (`cena4.mp3`) = 25,63s. Gravações (medidas frame a frame):
 * - `06_compare_services.mp4` 25,67s: parado até 9,5s; a seleção dos serviços
 *   acontece em 10,0s / 11,5–13,5s; dashboards em coluna a partir daí.
 * - `07_compare_scatter.mp4` 20,13s: curvas entrando em 4,5–9,5s e parado de
 *   16,0s ao fim.
 *
 * A aplicação é sequencial (seleciona serviços -> colunas -> curvas cruzadas),
 * não lado a lado, então o plano virou dois trechos em tela cheia. O corte cai
 * em 10,24s, na pausa entre "...mais energia que o Audit Stream" e "mas emite
 * dez vezes menos carbono" — o `06` só ganha vida útil perto de 10s, e o `07`
 * assume exatamente quando a narração pede a explicação cruzada.
 *
 * O `07` entra em 10,24s e roda 15,39s (até 15,7s do arquivo), o que cobre a
 * fala "Nós não apenas apontamos o problema; nós provamos a causa raiz."
 * ------------------------------------------------------------------------- */

export interface ScreenClip {
  src: string;
  /** Início do trecho no arquivo original. */
  startSeconds: number;
  /** Fim do trecho no arquivo original. */
  endSeconds: number;
  /** Segundo da cena em que o trecho entra. */
  atSeconds: number;
  /** Rótulo do momento (aparece na legenda inferior). */
  legend: string;
}

export const CENA4_CLIPS: readonly ScreenClip[] = [
  {
    // "O verdadeiro poder de decisão está na comparação lado a lado."
    // "Repare nesta discrepância: o Reporting Batch consome mais energia..."
    src: "videos/06_compare_services.mp4",
    startSeconds: 0,
    endSeconds: 10.24,
    atSeconds: 0,
    legend: "● Comparação de Serviços • Consumo × Emissão",
  },
  {
    // "...mas emite dez vezes menos carbono." + "O gráfico de dispersão
    // responde o porquê" + "Nós provamos a causa raiz."
    src: "videos/07_compare_scatter.mp4",
    startSeconds: 0,
    endSeconds: 15.39,
    atSeconds: 10.24,
    legend: "● Cruzamento das Curvas • Carga × Matriz Elétrica",
  },
];

export const TIMELINE_CONFIG: TimelineConfig = {
  fps: 60,
  width: 1920,
  height: 1080,
  transitionInFrames: 18,
  scenes: {
    cena1: scene(
      "cena1",
      "GreenOps na Prática",
      "Quanto sua infraestrutura de TI custa em carbono?",
      cena1TailSeconds()
    ),
    cena2: scene(
      "cena2",
      "Visão Global",
      "Mapeamento Geográfico de Emissões & Simulação",
      cena2TailSeconds()
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
