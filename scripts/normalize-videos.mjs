/**
 * Converte as gravações de public/videos/ para taxa de quadros CONSTANTE.
 *
 * As capturas de tela saem com timestamps irregulares (VFR): um frame dura
 * 0.033s, o seguinte 0.009s, outro 0.020s... O Remotion trabalha em frames
 * fixos, então esse espaçamento irregular vira um "pulinho" a cada troca de
 * frame — o tremor que aparece principalmente quando há zoom por cima.
 *
 * Uso: npm run normalize-videos
 * Os arquivos originais ficam em .video-originals/ (fora de public/, para não
 * irem no bundle do Remotion).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const VIDEOS_DIR = path.join(ROOT, "public", "videos");
const BACKUP_DIR = path.join(ROOT, ".video-originals");
const TARGET_FPS = 60;

const findFfmpeg = () => {
  const base = path.join(ROOT, "node_modules", "@remotion");
  if (!fs.existsSync(base)) throw new Error("node_modules/@remotion não encontrado");
  for (const pkg of fs.readdirSync(base)) {
    if (!pkg.startsWith("compositor-")) continue;
    const bin = path.join(base, pkg, "ffmpeg");
    if (fs.existsSync(bin)) return bin;
  }
  throw new Error("ffmpeg do Remotion não encontrado");
};

const ffmpeg = findFfmpeg();
fs.mkdirSync(BACKUP_DIR, { recursive: true });

// Filtro opcional: `npm run normalize-videos -- 08_report` normaliza só os
// arquivos cujo nome contenha o termo (evita reprocessar tudo).
const args = process.argv.slice(2);
const sizeIndex = args.indexOf("--size");
// `--size 1536x864` amplia para a largura nativa do <BrowserFrame>, evitando
// que o navegador estique a gravação (era o que borrava o texto).
const targetSize = sizeIndex >= 0 ? args[sizeIndex + 1] : null;
const only = args.filter((a, i) => !a.startsWith("-") && i !== sizeIndex + 1);

const files = fs
  .readdirSync(VIDEOS_DIR)
  .filter((name) => name.toLowerCase().endsWith(".mp4"))
  .filter((name) => only.length === 0 || only.some((term) => name.includes(term)));

if (files.length === 0) {
  console.log("Nenhum .mp4 em public/videos/.");
  process.exit(0);
}

for (const name of files) {
  const source = path.join(VIDEOS_DIR, name);
  const backup = path.join(BACKUP_DIR, name);
  const temp = path.join(VIDEOS_DIR, `__${name}`);

  if (!fs.existsSync(backup)) fs.copyFileSync(source, backup);

  console.log(`Normalizando ${name} → ${TARGET_FPS}fps CFR...`);
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-i",
      backup,
      // O ffmpeg empacotado pelo Remotion vem sem o filtro `fps`; a opção de
      // saída `-r` faz a conversão de taxa direto no muxer.
      "-r",
      String(TARGET_FPS),
      ...(targetSize ? ["-s", targetSize, "-sws_flags", "lanczos+accurate_rnd"] : []),
      "-c:v",
      "libx264",
      "-crf",
      "16",
      "-preset",
      "veryfast",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      temp,
    ],
    { stdio: "inherit" }
  );

  fs.renameSync(temp, source);
}

console.log(`\nPronto. Originais preservados em .video-originals/`);
