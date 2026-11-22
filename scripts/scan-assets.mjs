#!/usr/bin/env node
/**
 * EcoPulse - Scanner de assets
 *
 * Gera dois arquivos derivados do conteúdo real de public/:
 *
 *   src/config/generated/audio.ts   -> duração real (em segundos) de cada narração
 *   src/config/generated/videos.ts  -> lista dos .mp4 realmente presentes em public/videos/
 *
 * Assim a timeline nunca fica dessincronizada da narração e basta soltar um
 * arquivo em public/videos/ para o vídeo passar a ser usado automaticamente.
 *
 * Uso: node scripts/scan-assets.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const AUDIO_DIR = path.join(PUBLIC, "audio");
const VIDEO_DIR = path.join(PUBLIC, "videos");
const OUT_DIR = path.join(ROOT, "src", "config", "generated");

/**
 * Lê a duração de um arquivo MPEG-1/2/2.5 Layer III percorrendo os frames.
 * Evita depender de ffprobe (nem sempre disponível no ambiente de build).
 */
const MP3_BITRATES_KBPS = {
  v1l3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0],
  v2l3: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
};
const MP3_SAMPLE_RATES = {
  3: [44100, 48000, 32000],
  2: [22050, 24000, 16000],
  0: [11025, 12000, 8000],
};

const readMp3DurationInSeconds = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  let offset = 0;

  // Pula o cabeçalho ID3v2, se existir.
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    const tagSize =
      ((buffer[6] & 0x7f) << 21) |
      ((buffer[7] & 0x7f) << 14) |
      ((buffer[8] & 0x7f) << 7) |
      (buffer[9] & 0x7f);
    offset = 10 + tagSize;
  }

  let samples = 0;
  let sampleRate = 44100;

  while (offset < buffer.length - 4) {
    const isFrameSync =
      buffer[offset] === 0xff && (buffer[offset + 1] & 0xe0) === 0xe0;
    if (!isFrameSync) {
      offset += 1;
      continue;
    }

    const versionBits = (buffer[offset + 1] >> 3) & 0x3;
    const layerBits = (buffer[offset + 1] >> 1) & 0x3;
    const bitrateIndex = (buffer[offset + 2] >> 4) & 0xf;
    const sampleRateIndex = (buffer[offset + 2] >> 2) & 0x3;
    const padding = (buffer[offset + 2] >> 1) & 0x1;

    const invalid =
      versionBits === 1 ||
      layerBits !== 1 ||
      bitrateIndex === 0 ||
      bitrateIndex === 15 ||
      sampleRateIndex === 3;

    if (invalid) {
      offset += 1;
      continue;
    }

    const isMpeg1 = versionBits === 3;
    const bitrate =
      (isMpeg1 ? MP3_BITRATES_KBPS.v1l3 : MP3_BITRATES_KBPS.v2l3)[bitrateIndex] *
      1000;
    sampleRate = MP3_SAMPLE_RATES[versionBits][sampleRateIndex];
    const samplesPerFrame = isMpeg1 ? 1152 : 576;
    const frameLength =
      Math.floor(((isMpeg1 ? 144 : 72) * bitrate) / sampleRate) + padding;

    if (frameLength < 4) {
      offset += 1;
      continue;
    }

    samples += samplesPerFrame;
    offset += frameLength;
  }

  return samples / sampleRate;
};

const listFiles = (dir, extension) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => path.extname(name).toLowerCase() === extension)
    .sort();
};

const listRecordedVideos = () =>
  listFiles(VIDEO_DIR, ".mp4")
    .map((name) => `videos/${name}`)
    .sort();

const scanAudio = () => {
  const durations = {};
  for (const name of listFiles(AUDIO_DIR, ".mp3")) {
    const key = path.basename(name, path.extname(name));
    const seconds = readMp3DurationInSeconds(path.join(AUDIO_DIR, name));
    durations[key] = Math.round(seconds * 1000) / 1000;
  }
  return durations;
};

const BANNER = `/**
 * ARQUIVO GERADO AUTOMATICAMENTE por scripts/scan-assets.mjs
 * Não edite à mão: rode \`npm run scan\` para atualizar.
 */
`;

const writeGeneratedFile = (fileName, contents) => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, fileName), contents, "utf8");
};

const main = () => {
  const audio = scanAudio();
  const videos = listRecordedVideos();

  writeGeneratedFile(
    "audio.ts",
    `${BANNER}
/** Duração real (em segundos) de cada arquivo de public/audio/*.mp3 */
export const AUDIO_DURATIONS: Record<string, number> = ${JSON.stringify(
      audio,
      null,
      2
    )};
`
  );

  writeGeneratedFile(
    "videos.ts",
    `${BANNER}
/** Arquivos .mp4 realmente presentes em public/videos/ */
export const RECORDED_VIDEOS: readonly string[] = ${JSON.stringify(
      videos,
      null,
      2
    )};
`
  );

  const rounded = Object.entries(audio)
    .map(([key, seconds]) => `  ${key.padEnd(10)} ${seconds.toFixed(2)}s`)
    .join("\n");

  console.log(
    "Áudio encontrado em public/audio/:\n" + (rounded || "  (nenhum)")
  );
  console.log(
    `\nVídeos gravados em public/videos/: ${videos.length}` +
      (videos.length
        ? "\n" + videos.map((v) => `  ${v}`).join("\n")
        : " (usando prints como prévia)")
  );
};

main();
