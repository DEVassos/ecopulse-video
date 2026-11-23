import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FULL_SCREEN_WIDTH,
  SPLIT_GAP,
  SPLIT_PANEL_WIDTH,
} from "../config/layout";
import { THEME } from "../config/theme";
import {
  CENA4_OVERLAYS,
  CENA4_PHASES,
  CENA4_SPLIT,
  type Cena4Phase,
} from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { CutFlash, ScreenClipLayer } from "../components/ScreenClip";
import {
  ClosingStamp,
  CornerBadge,
  EquationCallout,
  GridIcon,
  RankIcon,
  Ring,
} from "./Cena4Overlays";

const ACCENT = THEME.colors.highlight;

/** Legenda do plano atual: some suave no fim para não brigar com o corte. */
const PhaseLegend: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 0.3 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      className="absolute bottom-6 left-6 z-20 pointer-events-none px-5 py-3 rounded-xl border backdrop-blur-sm"
      style={{
        backgroundColor: THEME.colors.surfaceGlass,
        borderColor: THEME.colors.borderStrong,
        boxShadow: THEME.shadows.floatBadge,
        opacity: enter * exit,
        translate: `${interpolate(enter, [0, 1], [-18, 0])}px 0px`,
      }}
    >
      <span
        className="font-mono text-[19px] font-bold uppercase tracking-[0.05em]"
        style={{ color: ACCENT }}
      >
        {text}
      </span>
    </div>
  );
};

/**
 * Print parado com um zoom muito lento: o plano final fica 17s em cena, então
 * a câmera respira em vez de congelar de vez.
 */
const StillLayer: React.FC<{ image: string }> = ({ image }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const zoom = interpolate(frame, [0, durationInFrames], [1.015, 1.075], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Img
        src={staticFile(image)}
        style={{ width: "100%", height: "100%", objectFit: "contain", scale: zoom }}
      />
    </AbsoluteFill>
  );
};

/** Painel do split-screen de abertura, com a legenda embaixo. */
const SplitPanel: React.FC<{
  image: string;
  label: string;
  note: string;
  side: "left" | "right";
}> = ({ image, label, note, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - (0.12 + (side === "right" ? 0.14 : 0)) * fps,
    fps,
    config: { damping: 14, stiffness: 92 },
  });
  const exit = interpolate(
    frame,
    [(CENA4_SPLIT.outSeconds - 0.32) * fps, CENA4_SPLIT.outSeconds * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity: enter * exit,
        translate: `${interpolate(
          enter,
          [0, 1],
          [side === "left" ? -70 : 70, 0]
        )}px 0px`,
      }}
    >
      <BrowserFrame
        width={SPLIT_PANEL_WIDTH}
        url="app.ecopulse.greenops.io/dashboard/compare"
        title="EcoPulse • Comparação"
      >
        <Img
          src={staticFile(image)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </BrowserFrame>

      <div className="mt-5 flex items-baseline gap-3">
        <span
          className="px-3 py-1 rounded-md font-mono text-[17px] font-bold uppercase tracking-[0.16em]"
          style={{ backgroundColor: ACCENT, color: "#04150F" }}
        >
          {label}
        </span>
        <span className="text-[17px] font-medium text-emerald-100/75">
          {note}
        </span>
      </div>
    </div>
  );
};

/** Abertura: as duas metades da comparação lado a lado. */
const SplitStage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(
    frame,
    [(CENA4_SPLIT.outSeconds - 0.32) * fps, CENA4_SPLIT.outSeconds * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      className="items-center justify-center"
      style={{ flexDirection: "row", gap: SPLIT_GAP, opacity: out }}
    >
      {CENA4_SPLIT.panels.map((panel, index) => (
        <SplitPanel
          key={panel.image}
          image={panel.image}
          label={panel.label}
          note={panel.note}
          side={index === 0 ? "left" : "right"}
        />
      ))}

      <div className="absolute bottom-6 left-6 px-5 py-3 rounded-xl border backdrop-blur-sm"
        style={{
          backgroundColor: THEME.colors.surfaceGlass,
          borderColor: THEME.colors.borderStrong,
          boxShadow: THEME.shadows.floatBadge,
        }}
      >
        <span
          className="font-mono text-[19px] font-bold uppercase tracking-[0.05em]"
          style={{ color: ACCENT }}
        >
          {CENA4_SPLIT.legend}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Realces ancorados nas coordenadas medidas nos frames 1536x864 (1:1 com o
 * conteúdo da moldura). Cada janela começa junto da fala correspondente.
 */
const PhaseOverlays: React.FC = () => (
  <>
    <Ring
      inSeconds={CENA4_OVERLAYS.chips.inSeconds}
      outSeconds={CENA4_OVERLAYS.chips.outSeconds}
      left={84}
      top={116}
      width={1215}
      height={106}
      label="até 10 serviços"
    />

    <CornerBadge
      inSeconds={CENA4_OVERLAYS.ranking.inSeconds}
      outSeconds={CENA4_OVERLAYS.ranking.outSeconds}
      icon={<RankIcon />}
    >
      menor → maior CO₂e
    </CornerBadge>

    <Ring
      inSeconds={CENA4_OVERLAYS.metrics.inSeconds}
      outSeconds={CENA4_OVERLAYS.metrics.outSeconds}
      left={56}
      top={206}
      width={1424}
      height={252}
      label="energia · potência · CO₂e"
    />

    <Ring
      inSeconds={CENA4_OVERLAYS.curves.inSeconds}
      outSeconds={CENA4_OVERLAYS.curves.outSeconds}
      left={56}
      top={300}
      width={1430}
      height={380}
      label="evolução no tempo · 15 min"
    />

    <Ring
      inSeconds={CENA4_OVERLAYS.crossing.inSeconds}
      outSeconds={CENA4_OVERLAYS.crossing.outSeconds}
      left={56}
      top={40}
      width={1060}
      height={420}
      label="cruzamento de dados"
    />

    <Ring
      inSeconds={CENA4_OVERLAYS.isolate.inSeconds}
      outSeconds={CENA4_OVERLAYS.isolate.outSeconds}
      left={1182}
      top={98}
      width={342}
      height={306}
      label="intensidade da rede"
    />

    <Ring
      inSeconds={CENA4_OVERLAYS.equation.inSeconds}
      outSeconds={CENA4_OVERLAYS.equation.outSeconds}
      left={722}
      top={116}
      width={286}
      height={90}
    />

    <CornerBadge
      inSeconds={CENA4_OVERLAYS.isolate.inSeconds}
      outSeconds={CENA4_OVERLAYS.equation.inSeconds}
      icon={<GridIcon />}
    >
      carga × região
    </CornerBadge>
  </>
);

const FullStage: React.FC = () => {
  const { fps } = useVideoConfig();
  const toFrame = (seconds: number) => Math.round(seconds * fps);

  const renderPlan = (phase: Cena4Phase) =>
    phase.kind === "video" ? (
      <ScreenClipLayer
        src={phase.src as string}
        startSeconds={phase.startSeconds as number}
        label={phase.legend}
      />
    ) : (
      <StillLayer image={phase.image as string} />
    );

  return (
    <BrowserFrame
      width={FULL_SCREEN_WIDTH}
      url="app.ecopulse.greenops.io/dashboard/compare"
      title="EcoPulse • Comparação de Serviços"
    >
      {CENA4_PHASES.map((phase) => (
        <Sequence
          key={`${phase.kind}-${phase.atSeconds}`}
          from={toFrame(phase.atSeconds)}
          durationInFrames={toFrame(phase.outSeconds - phase.atSeconds)}
          name={phase.legend}
        >
          {renderPlan(phase)}
          <PhaseLegend text={phase.legend} />
          <CutFlash atFrame={0} />
        </Sequence>
      ))}

      <PhaseOverlays />
      <EquationCallout />
      <ClosingStamp />
    </BrowserFrame>
  );
};

/**
 * Cena 4 - Comparação e Causa Raiz.
 *
 * Abertura em split-screen (tabela x dispersão), depois a gravação assume em
 * tela cheia: seleção dos serviços, ranking, tabela de métricas e as curvas.
 * No fim, a página trava no bloco "Carga ou região?" e a conta da causa raiz
 * vira o assunto até o carimbo do veredito.
 */
export const Cena4Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const splitOut = Math.round(CENA4_SPLIT.outSeconds * fps);

  return (
    <SceneShell sceneKey="cena4">
      {/* A tela cheia só aparece depois do split: mantém o vão entre os
          painéis mostrando o fundo da cena, e não uma moldura vazia. */}
      <div style={{ opacity: frame < splitOut ? 0 : 1 }}>
        <FullStage />
      </div>

      {frame < splitOut ? <SplitStage /> : null}
    </SceneShell>
  );
};
