import React from "react";
import {
  AbsoluteFill,
  Freeze,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { THEME } from "../config/theme";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import { CENA5_OVERLAYS, CENA5_VIDEO } from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";
import { SafeImage } from "../components/SafeImage";

const PDF_WIDTH = 494;
const PDF_HEIGHT = 700;

/** "regras fixas e auditáveis... sem IA alucinada" (4,92–8,49 da narração). */
const RulesCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 14, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      className="absolute top-6 right-6 z-20"
      style={{
        opacity,
        translate: `0px ${interpolate(opacity, [0, 1], [-16, 0])}px`,
      }}
    >
      <div
        className="rounded-xl border border-emerald-400/45 bg-[#08130F]/95 backdrop-blur-sm pl-4 pr-5 py-3 flex items-center gap-3"
        style={{ boxShadow: THEME.shadows.glow }}
      >
        <span className="block w-1 self-stretch rounded-full bg-gradient-to-b from-emerald-300 to-lime-400" />
        <svg
          className="w-7 h-7 text-emerald-300 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <div className="flex flex-col">
          <span className="text-[13px] uppercase font-mono tracking-[0.18em] text-emerald-400">
            Como este relatório é gerado
          </span>
          <span className="text-[19px] font-bold text-slate-100 whitespace-nowrap">
            Regras fixas e auditáveis •{" "}
            <span className="text-lime-300">Zero IA generativa</span>
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Cartão do PDF exportado. Ele não vem da gravação (o vídeo do relatório é
 * estático), então é composto aqui: entrada deslizando e um carimbo no fim.
 */
const PdfCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const stampAt =
    Math.round(CENA5_OVERLAYS.stamp.inSeconds * fps) -
    Math.round(CENA5_OVERLAYS.pdf.inSeconds * fps);

  const stamp = spring({
    frame: frame - stampAt,
    fps,
    config: { damping: 11, stiffness: 190 },
  });

  const floatY = interpolate(Math.sin((frame / fps) * Math.PI * 0.9), [-1, 1], [-6, 6]);

  return (
    <div
      className="absolute z-30 rounded-2xl overflow-hidden border-2 border-emerald-400/50"
      style={{
        width: PDF_WIDTH,
        height: PDF_HEIGHT,
        right: 56,
        top: "50%",
        marginTop: -PDF_HEIGHT / 2 + floatY,
        opacity: interpolate(enter, [0, 0.35, 1], [0, 1, 1], {
          extrapolateRight: "clamp",
        }),
        rotate: `${interpolate(enter, [0, 1], [7, -1.5])}deg`,
        translate: `${interpolate(enter, [0, 1], [420, 0])}px 0px`,
        boxShadow:
          "0 40px 80px -18px rgba(0,0,0,0.92), 0 0 34px rgba(16,185,129,0.28)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-10 px-4 bg-slate-900/95 flex items-center justify-between border-b border-emerald-500/30 z-10">
        <span className="text-[13px] font-mono font-bold text-emerald-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          EcoPulse_Relatorio_Executivo.pdf
        </span>
        <span className="text-[12px] font-mono text-slate-400">PDF</span>
      </div>

      <div className="w-full h-full pt-10 bg-white">
        <SafeImage
          src="images/pdf/relatorio.png"
          alt="Relatório executivo exportado em PDF"
          className="w-full h-full object-contain object-top"
        />
      </div>

      {/* Selo de carimbo: Tema Claro • Economia de Tinta */}
      <div
        className="absolute bottom-6 left-1/2 z-40"
        style={{
          opacity: interpolate(stamp, [0, 0.25, 1], [0, 1, 1], {
            extrapolateRight: "clamp",
          }),
          translate: "-50% 0px",
          rotate: `${interpolate(stamp, [0, 1], [-16, -7])}deg`,
          scale: interpolate(stamp, [0, 1], [1.9, 1], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
        }}
      >
        <div
          className="px-5 py-2.5 rounded-xl border-[3px] border-emerald-500 bg-emerald-50/95 flex flex-col items-center"
          style={{ boxShadow: "0 10px 30px -6px rgba(0,0,0,0.6)" }}
        >
          <span className="text-[13px] uppercase font-mono tracking-[0.22em] text-emerald-700 font-bold">
            Detalhe de produto
          </span>
          <span className="text-[21px] font-black text-emerald-900 tracking-tight whitespace-nowrap">
            Tema Claro • Economia de Tinta
          </span>
        </div>
      </div>
    </div>
  );
};

type MiniPdfCardProps = {
  file: string;
  image: string;
  width: number;
  height: number;
  left: number;
  top: number;
  rotateDeg: number;
  /** Tempo local (em relação ao início do cartão) em que ele começa a sair. */
  outAtSeconds: number;
};

/**
 * As outras exportações. Entram espalhadas pela tela para ocupar o vídeo
 * congelado e sustentar a fala "a partir de qualquer tela".
 */
const MiniPdfCard: React.FC<MiniPdfCardProps> = ({
  file,
  image,
  width,
  height,
  left,
  top,
  rotateDeg,
  outAtSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 95 },
  });

  // Um "refresh" branco rápido dá a sensação de tela sendo exportada.
  const refresh = interpolate(frame, [0, 5, 15], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const outAt = Math.round(outAtSeconds * fps);
  const exit = interpolate(frame, [outAt, outAt + 14], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute z-20 rounded-xl overflow-hidden border border-emerald-400/45"
      style={{
        width,
        height,
        left,
        top,
        opacity: interpolate(enter, [0, 0.4, 1], [0, 1, 1], {
          extrapolateRight: "clamp",
        }) * exit,
        translate: `${interpolate(enter, [0, 1], [-90, 0])}px ${interpolate(enter, [0, 1], [50, 0])}px`,
        rotate: `${rotateDeg + interpolate(enter, [0, 1], [9, 0])}deg`,
        boxShadow:
          "0 30px 60px -18px rgba(0,0,0,0.92), 0 0 22px rgba(16,185,129,0.22)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-7 px-2.5 bg-slate-900/95 flex items-center justify-between border-b border-emerald-500/30 z-10">
        <span className="text-[11px] font-mono font-bold text-emerald-400 truncate">
          {file}
        </span>
        <span className="text-[10px] font-mono text-slate-500">PDF</span>
      </div>

      <div className="w-full h-full pt-7 bg-white">
        <SafeImage
          src={image}
          alt={file}
          className="w-full h-full object-contain object-top"
        />
      </div>

      <div
        className="absolute inset-0 z-20 bg-white pointer-events-none"
        style={{ opacity: refresh }}
      />
    </div>
  );
};

/**
 * Cena 5 - Relatórios e Exportação Corporativa.
 *
 * A gravação do relatório tem 22,92s contra 31,71s de narração, então depois do
 * último frame ela fica congelada e o PDF assume o primeiro plano. O fundo
 * escurece na virada para dar profundidade sem mexer na escala da gravação.
 */
export const Cena5Report: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const toFrame = (seconds: number) => Math.round(seconds * fps);

  const videoFrames = toFrame(CENA5_VIDEO.durationSeconds);
  const scrim = interpolate(
    frame,
    [
      toFrame(CENA5_OVERLAYS.scrim.inSeconds),
      toFrame(CENA5_OVERLAYS.scrim.inSeconds + CENA5_OVERLAYS.scrim.seconds),
    ],
    [0, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const outro = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <SceneShell sceneKey="cena5">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/reports/pareto"
        title="EcoPulse • Relatórios & Exportação"
      >
        <Sequence durationInFrames={videoFrames} layout="none">
          <AbsoluteFill>
            <SafeVideo
              src={CENA5_VIDEO.src}
              label="08 - Relatório Executivo & Exportação"
              volume={0}
              kenBurns={false}
              className="w-full h-full"
            />
          </AbsoluteFill>
        </Sequence>

        {durationInFrames > videoFrames ? (
          <Sequence from={videoFrames} layout="none">
            <Freeze frame={videoFrames - 1}>
              <AbsoluteFill>
                <SafeVideo
                  src={CENA5_VIDEO.src}
                  label="08 - Relatório Executivo & Exportação"
                  volume={0}
                  kenBurns={false}
                  className="w-full h-full"
                />
              </AbsoluteFill>
            </Freeze>
          </Sequence>
        ) : null}

        <AbsoluteFill
          className="bg-[#04100C] pointer-events-none"
          style={{ opacity: scrim }}
        />

        <div
          className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 text-[14px] font-mono text-emerald-300"
          style={{ opacity: outro }}
        >
          {CENA5_VIDEO.legend}
        </div>

        <Sequence
          from={toFrame(CENA5_OVERLAYS.rules.inSeconds)}
          durationInFrames={toFrame(
            CENA5_OVERLAYS.rules.outSeconds - CENA5_OVERLAYS.rules.inSeconds
          )}
          layout="none"
        >
          <RulesCard />
        </Sequence>

        <Sequence from={toFrame(CENA5_OVERLAYS.pdf.inSeconds)} layout="none">
          <PdfCard />
        </Sequence>

        <Sequence from={toFrame(CENA5_OVERLAYS.gallery.comparacao.inSeconds)} layout="none">
          <MiniPdfCard
            file="EcoPulse_Comparacao_Servicos.pdf"
            image="images/pdf/comparacao.png"
            width={300}
            height={425}
            left={34}
            top={96}
            rotateDeg={4}
            outAtSeconds={CENA5_OVERLAYS.gallery.outSeconds - CENA5_OVERLAYS.gallery.comparacao.inSeconds}
          />
        </Sequence>

        <Sequence from={toFrame(CENA5_OVERLAYS.gallery.emissoes.inSeconds)} layout="none">
          <MiniPdfCard
            file="EcoPulse_Emissoes.pdf"
            image="images/pdf/emissoes.png"
            width={286}
            height={405}
            left={318}
            top={412}
            rotateDeg={-3.5}
            outAtSeconds={CENA5_OVERLAYS.gallery.outSeconds - CENA5_OVERLAYS.gallery.emissoes.inSeconds}
          />
        </Sequence>

        <Sequence from={toFrame(CENA5_OVERLAYS.gallery.dashboard.inSeconds)} layout="none">
          <MiniPdfCard
            file="EcoPulse_Dashboard.pdf"
            image="images/pdf/dashboard.png"
            width={268}
            height={380}
            left={624}
            top={72}
            rotateDeg={5.5}
            outAtSeconds={CENA5_OVERLAYS.gallery.outSeconds - CENA5_OVERLAYS.gallery.dashboard.inSeconds}
          />
        </Sequence>
      </BrowserFrame>
    </SceneShell>
  );
};
