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
        className="rounded-xl border border-emerald-400/45 bg-[#08130F]/95 backdrop-blur-sm px-4 py-2.5 flex items-center gap-3"
        style={{ boxShadow: THEME.shadows.glow }}
      >
        <svg
          className="w-5 h-5 text-emerald-300"
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
          <span className="text-[10px] uppercase font-mono tracking-[0.18em] text-emerald-400">
            Como este relatório é gerado
          </span>
          <span className="text-sm font-bold text-slate-100 whitespace-nowrap">
            Regras fixas e auditáveis • Zero IA generativa
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Cartão do PDF exportado. Ele não vem da gravação (o vídeo do relatório é
 * estático), então é composto aqui: entrada deslizando, selo de carimbo e a
 * troca rápida para a segunda exportação.
 */
const PdfCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const stampAt = Math.round(CENA5_OVERLAYS.stamp.inSeconds * fps) -
    Math.round(CENA5_OVERLAYS.pdf.inSeconds * fps);
  const swapToAt = Math.round(CENA5_OVERLAYS.swapToCompare.inSeconds * fps) -
    Math.round(CENA5_OVERLAYS.pdf.inSeconds * fps);
  const swapBackAt = Math.round(CENA5_OVERLAYS.swapBack.inSeconds * fps) -
    Math.round(CENA5_OVERLAYS.pdf.inSeconds * fps);

  const stamp = spring({
    frame: frame - stampAt,
    fps,
    config: { damping: 11, stiffness: 190 },
  });

  const isCompare = frame >= swapToAt && frame < swapBackAt;

  // Flash branco nas duas trocas de exportação.
  const flash = Math.max(
    interpolate(
      frame,
      [swapToAt, swapToAt + 8, swapToAt + 20],
      [0, 0.85, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    ),
    interpolate(
      frame,
      [swapBackAt, swapBackAt + 8, swapBackAt + 20],
      [0, 0.85, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

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
      <div className="absolute top-0 left-0 right-0 h-9 px-4 bg-slate-900/95 flex items-center justify-between border-b border-emerald-500/30 z-10">
        <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {isCompare ? "EcoPulse_Comparacao_Servicos.pdf" : "EcoPulse_Relatorio_Executivo.pdf"}
        </span>
        <span className="text-[10px] font-mono text-slate-400">PDF</span>
      </div>

      <div className="w-full h-full pt-9 bg-white">
        <SafeImage
          src={isCompare ? "images/relatorio-pdf-2.png" : "images/relatorio-pdf-1.png"}
          alt="Relatório exportado em PDF"
          className="w-full h-full object-contain object-top"
        />
      </div>

      {/* Flash da troca entre as exportações */}
      <div
        className="absolute inset-0 z-20 bg-white pointer-events-none"
        style={{ opacity: flash }}
      />

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
          <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-emerald-700 font-bold">
            Detalhe de produto
          </span>
          <span className="text-[17px] font-black text-emerald-900 tracking-tight whitespace-nowrap">
            Tema Claro • Economia de Tinta
          </span>
        </div>
      </div>
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
          className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 text-xs font-mono text-emerald-300"
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
      </BrowserFrame>
    </SceneShell>
  );
};
