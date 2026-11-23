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
 * estático), então é composto aqui: entrada deslizando da direita.
 */
const PdfCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
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
    </div>
  );
};

type StampTone = "paper" | "solid";

type StampProps = {
  kicker: string;
  title: string;
  caption?: string;
  /** "paper" = selo claro de documento; "solid" = selo cheio verde, mais forte. */
  tone?: StampTone;
  /** Escala de entrada do carimbo (grande -> 1). */
  scaleFrom?: number;
  /** Tempo local (s) em que o carimbo começa a sair. Sem valor, fica até o fim. */
  outAtSeconds?: number;
};

const STAMP_TONES: Record<
  StampTone,
  { box: string; kicker: string; title: string; caption: string; titleSize: number; glow: string }
> = {
  paper: {
    box: "border-emerald-500 bg-emerald-50/97",
    kicker: "text-emerald-700",
    title: "text-emerald-900",
    caption: "text-emerald-700/80",
    titleSize: 31,
    glow: "0 26px 70px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(16,185,129,0.35)",
  },
  solid: {
    box: "border-lime-300 bg-emerald-600/96",
    kicker: "text-lime-100",
    title: "text-white",
    caption: "text-emerald-50/90",
    titleSize: 38,
    glow:
      "0 30px 80px -10px rgba(0,0,0,0.9), 0 0 44px rgba(52,211,153,0.55), inset 0 0 0 2px rgba(255,255,255,0.12)",
  },
};

/**
 * Carimbo central. Fica no meio da tela, sobre os PDFs, para falar de todos de
 * uma vez — não é um detalhe de um documento só.
 */
const Stamp: React.FC<StampProps> = ({
  kicker,
  title,
  caption,
  tone = "paper",
  scaleFrom = 2.2,
  outAtSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = STAMP_TONES[tone];

  const enter = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 190 },
  });

  const outAt = outAtSeconds === undefined ? null : Math.round(outAtSeconds * fps);
  const stay = outAt === null
    ? 1
    : interpolate(frame, [outAt, outAt + 16], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      });

  return (
    <AbsoluteFill className="items-center justify-center z-50 pointer-events-none">
      <div
        style={{
          opacity: interpolate(enter, [0, 0.25, 1], [0, 1, 1], {
            extrapolateRight: "clamp",
          }) * stay,
          rotate: `${interpolate(enter, [0, 1], [-22, -7])}deg`,
          scale:
            interpolate(enter, [0, 1], [scaleFrom, 1], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }) * interpolate(stay, [0, 1], [1.14, 1]),
          translate: `${interpolate(stay, [0, 1], [-40, 0])}px 0px`,
        }}
      >
        <div
          className={`px-9 py-5 rounded-2xl border-[4px] flex flex-col items-center gap-1 ${theme.box}`}
          style={{ boxShadow: theme.glow }}
        >
          <span
            className={`text-[15px] uppercase font-mono tracking-[0.28em] font-bold ${theme.kicker}`}
          >
            {kicker}
          </span>
          <span
            className={`font-black tracking-tight whitespace-nowrap ${theme.title}`}
            style={{ fontSize: theme.titleSize }}
          >
            {title}
          </span>
          {caption ? (
            <span
              className={`text-[15px] font-mono font-semibold tracking-wide ${theme.caption}`}
            >
              {caption}
            </span>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Varredura verde de saída. Cobre a tela da esquerda para a direita e entrega
 * o corte para a cena 6, em vez de simplesmente sumir no escuro.
 */
const ExitWipe: React.FC<{ seconds: number }> = ({ seconds }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = interpolate(
    frame,
    [durationInFrames - Math.round(seconds * fps), durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  if (progress <= 0) {
    return null;
  }

  return (
    <AbsoluteFill className="pointer-events-none overflow-hidden" style={{ zIndex: 60 }}>
      <div
        className="absolute inset-0"
        style={{
          translate: `${-100 + progress * 100}% 0px`,
          background:
            "linear-gradient(90deg, #04100C 0%, #04100C 74%, #065F46 90%, #34D399 100%)",
        }}
      >
        <span
          className="absolute top-0 bottom-0 right-0 w-[6px]"
          style={{ background: "#ECFDF5", boxShadow: "0 0 40px 8px rgba(52,211,153,0.9)" }}
        />
      </div>
    </AbsoluteFill>
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
        }),
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
    <SceneShell
      sceneKey="cena5"
      overlay={<ExitWipe seconds={CENA5_OVERLAYS.exit.seconds} />}
    >
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
          />
        </Sequence>

        <Sequence from={toFrame(CENA5_OVERLAYS.stamp.inSeconds)} layout="none">
          <Stamp
            kicker="Detalhe de produto"
            title="Tema Claro • Economia de Tinta"
            caption="Vale para todas as exportações"
            outAtSeconds={
              CENA5_OVERLAYS.stamp.outSeconds - CENA5_OVERLAYS.stamp.inSeconds
            }
          />
        </Sequence>

        <Sequence from={toFrame(CENA5_OVERLAYS.docStamp.inSeconds)} layout="none">
          <Stamp
            tone="solid"
            kicker="Documentação"
            title="Documentação na prática"
            caption="Tudo explicado dentro do EcoPulse"
            scaleFrom={2.6}
          />
        </Sequence>
      </BrowserFrame>
    </SceneShell>
  );
};
