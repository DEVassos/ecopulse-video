import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../config/theme";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import {
  CENA1_BADGE_SECONDS,
  CENA1_CAPTIONS,
  CENA1_CLIPS,
  CENA1_HOOK_BEATS,
  CENA1_HOOK_END_SECONDS,
  CENA1_INTRO_SECONDS,
  type Cena1Clip,
} from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";

const CAPTION_FADE = 10;

/** Duração do "chicote" (whip) nas trocas entre telas e na virada para a cena 2. */
const WHIP_FRAMES = 16;

/**
 * Trecho de gravação com entrada/saída em whip pan (desliza + desfoca + some),
 * para que a troca Home -> login não seja um corte seco.
 */
const ClipLayer: React.FC<{
  clip: Cena1Clip;
  playbackRate: number;
}> = ({ clip, playbackRate }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const enter = clip.enter
    ? interpolate(frame, [0, WHIP_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    : 1;

  const exit = clip.exit
    ? interpolate(
        frame,
        [durationInFrames - WHIP_FRAMES, durationInFrames - 1],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.7, 0, 0.84, 0),
        }
      )
    : 0;

  // 0.15 de opacidade no ponto de encontro dos dois lados: o cruzamento
  // acontece sob a faixa de luz do `WhipStreak`, sem buraco preto.
  const opacity = (0.15 + 0.85 * enter) * (1 - 0.85 * exit);

  return (
    <AbsoluteFill
      style={{
        opacity,
        translate: `${(1 - enter) * 130 - exit * 130}px 0px`,
        scale: 1 + (1 - enter) * 0.03 + exit * 0.03,
        filter: `blur(${(1 - enter) * 9 + exit * 9}px)`,
      }}
    >
      <SafeVideo
        src={clip.src}
        trimBefore={Math.round(clip.startSeconds * fps)}
        playbackRate={playbackRate}
        volume={0}
        kenBurns={false}
        label={clip.src}
        className="w-full h-full"
      />
    </AbsoluteFill>
  );
};

/** Faixa de luz que cruza a tela durante o whip, escondendo o cruzamento. */
const WhipStreak: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const mid = durationInFrames / 2;
  const sweep = interpolate(frame, [0, durationInFrames], [-35, 135], {
    easing: Easing.inOut(Easing.quad),
  });
  const intensity = interpolate(
    frame,
    [mid - 5, mid, mid + 5],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(105deg, transparent ${sweep - 24}%, rgba(16,185,129,${
            0.1 + 0.2 * intensity
          }) ${sweep}%, transparent ${sweep + 24}%)`,
        }}
      />
      <AbsoluteFill
        style={{ backgroundColor: "#eafff5", opacity: intensity * 0.16 }}
      />
    </AbsoluteFill>
  );
};

const Highlighted: React.FC<{ text: string; highlight: string }> = ({
  text,
  highlight,
}) => {
  const index = text.indexOf(highlight);

  if (index === -1) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      <span className="text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.5)]">
        {highlight}
      </span>
      {text.slice(index + highlight.length)}
    </>
  );
};

/** Revela o texto palavra por palavra (blur + subida + fade). */
const WordReveal: React.FC<{
  text: string;
  frame: number;
  start: number;
  emphasize: readonly string[];
  stagger?: number;
  className?: string;
}> = ({ text, frame, start, emphasize, stagger = 3, className = "" }) => {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => {
        const progress = interpolate(
          frame,
          [start + index * stagger, start + index * stagger + 12],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: "inline-block",
              opacity: progress,
              translate: `0px ${(1 - progress) * 18}px`,
              filter: `blur(${(1 - progress) * 8}px)`,
            }}
          >
            <span
              className={emphasize.includes(word) ? "text-emerald-400" : undefined}
            >
              {word}
            </span>
            {index < words.length - 1 ? "\u00A0" : null}
          </span>
        );
      })}
    </span>
  );
};

interface HookPopup {
  kicker: string;
  text: string;
  position: React.CSSProperties;
  delay: number;
  /** Direção da saída no fim da abertura (-1 = esquerda/cima). */
  dx: number;
  dy: number;
}

const HOOK_POPUPS: readonly HookPopup[] = [
  {
    kicker: "01 · Energia",
    text: "servidores em operação",
    position: { left: 128, top: 196 },
    delay: 10,
    dx: -1,
    dy: -0.5,
  },
  {
    kicker: "02 · Emissões",
    text: "CO₂ equivalente",
    position: { right: 128, top: 236 },
    delay: 24,
    dx: 1,
    dy: -0.45,
  },
  {
    kicker: "03 · Oportunidade",
    text: "onde dá para economizar",
    position: { left: 200, top: 800 },
    delay: 38,
    dx: -0.8,
    dy: 0.7,
  },
] as const;

/**
 * Cena 1 - O Gancho Premium
 * Abre com um fundo de marca e a pergunta revelada palavra por palavra (com
 * popups de contexto). Quando a pergunta termina, entra a gravação real:
 * Home -> login -> digitação e clique em "Entrar", com push-in e legendas.
 */
export const Cena1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const toFrame = (seconds: number) => Math.round(seconds * fps);

  const hookEndFrame = toFrame(CENA1_HOOK_END_SECONDS);

  // O plano está em segundos reais: o playbackRate só existe para caber o
  // trecho na janela de tempo definida em `Cena1Clip.speed`.
  const blocks = CENA1_CLIPS.map((clip) => {
    const from = toFrame(clip.atSeconds);
    const to = toFrame(clip.atSeconds + (clip.endSeconds - clip.startSeconds) / clip.speed);

    return { clip, from, frames: to - from, playbackRate: clip.speed };
  });

  const activeBlock =
    [...blocks].reverse().find((block) => frame >= block.from) ?? blocks[0];

  const lastBlock = blocks[blocks.length - 1];
  const pushInStart = lastBlock.from + lastBlock.frames * 0.4;

  const pushInScale = interpolate(
    frame,
    [pushInStart, durationInFrames],
    [1, 1.12],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Entrada das gravações (sobe + escala + fade) quando a pergunta termina.
  const stageIn = spring({
    frame: frame - (hookEndFrame - 6),
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.9 },
  });

  // Saída da abertura (recua + desfoca + some).
  const hookOut = interpolate(
    frame,
    [hookEndFrame - 14, hookEndFrame + 2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const badgeSpring = spring({
    frame: frame - toFrame(CENA1_BADGE_SECONDS),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2);

  const popupStart = toFrame(CENA1_HOOK_BEATS[1].atSeconds);

  // O selo entra depois de um segundo de tela limpa (só o fundo da marca).
  const brandIn = spring({
    frame: frame - toFrame(CENA1_INTRO_SECONDS),
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.8 },
  });

  return (
    <SceneShell sceneKey="cena1" showHeader={false}>
      {/* ---------------------------------------------------------------
          Abertura: fundo de marca + pergunta (antes das gravações)
      ----------------------------------------------------------------- */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-28 text-center"
        style={{
          opacity: 1 - hookOut,
          scale: 1 + hookOut * 0.06,
          filter: `blur(${hookOut * 10}px)`,
        }}
      >
        <div
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border"
          style={{
            borderColor: THEME.colors.borderSubtle,
            backgroundColor: THEME.colors.surfaceGlassSubtle,
            opacity: brandIn,
            scale: interpolate(brandIn, [0, 1], [0.9, 1]),
            translate: `0px ${interpolate(brandIn, [0, 1], [14, 0])}px`,
            filter: `blur(${interpolate(brandIn, [0, 1], [8, 0])}px)`,
          }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full bg-emerald-400"
            style={{ boxShadow: `0 0 ${10 + pulse * 14}px #10B981` }}
          />
          <span className="font-mono text-sm uppercase tracking-[0.32em] text-emerald-300">
            EcoPulse · GreenOps
          </span>
        </div>

        {CENA1_HOOK_BEATS.map((beat, index) => {
          const start = toFrame(beat.atSeconds) + 4;
          const isQuestion = index === 1;

          return (
            <WordReveal
              key={beat.text}
              text={beat.text}
              frame={frame}
              start={start}
              emphasize={beat.emphasize}
              stagger={isQuestion ? 4 : 3}
              className={
                isQuestion
                  ? "mt-6 block max-w-[1460px] text-[84px] leading-[1.06] font-extrabold tracking-tight text-slate-100"
                  : "mt-9 block text-[40px] leading-tight font-semibold tracking-tight text-slate-500"
              }
            />
          );
        })}
      </div>

      {/* Popups de contexto da pergunta */}
      {HOOK_POPUPS.map((popup) => {
        const pop = spring({
          frame: frame - (popupStart + popup.delay),
          fps,
          config: { damping: 14, stiffness: 90 },
        });

        const drift = Math.sin((frame / fps) * 1.3 + popup.delay) * 6;

        return (
          <div key={popup.kicker} className="absolute" style={popup.position}>
            <div
              className="px-6 py-4 rounded-2xl border backdrop-blur-sm"
              style={{
                borderColor: THEME.colors.borderSubtle,
                backgroundColor: THEME.colors.surfaceGlass,
                boxShadow: THEME.shadows.card,
                opacity: pop * (1 - hookOut),
                scale: interpolate(pop, [0, 1], [0.82, 1]),
                translate: `${popup.dx * hookOut * 160}px ${
                  popup.dy * hookOut * 130 + drift
                }px`,
                transformOrigin: "center",
              }}
            >
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400">
                {popup.kicker}
              </div>
              <div className="mt-1 text-xl font-semibold text-slate-200">
                {popup.text}
              </div>
            </div>
          </div>
        );
      })}

      {/* ---------------------------------------------------------------
          Gravações reais: Home -> login (digitação inteira) -> dashboard
      ----------------------------------------------------------------- */}
      <div
        className="relative"
        style={{
          width: FULL_SCREEN_WIDTH,
          opacity: stageIn,
          scale: interpolate(stageIn, [0, 1], [0.95, 1]) * pushInScale,
          translate: `0px ${interpolate(stageIn, [0, 1], [56, 0])}px`,
        }}
      >
        <BrowserFrame
          width={FULL_SCREEN_WIDTH}
          url={activeBlock.clip.url}
          title="EcoPulse • GreenOps Platform"
        >
          {blocks.map(({ clip, from, frames, playbackRate }) => (
            <Sequence
              key={`${clip.src}-${clip.startSeconds}`}
              from={from}
              durationInFrames={frames}
            >
              <ClipLayer clip={clip} playbackRate={playbackRate} />
            </Sequence>
          ))}

          {/* Whip na troca Home -> login */}
          {blocks.map(({ clip, from }) =>
            clip.enter === "whip" ? (
              <Sequence
                key={`whip-${clip.startSeconds}`}
                from={from - WHIP_FRAMES}
                durationInFrames={WHIP_FRAMES * 2}
              >
                <WhipStreak />
              </Sequence>
            ) : null
          )}
        </BrowserFrame>

        <div
          className="absolute inset-x-0 bottom-0 px-14 pb-8 pt-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(2,7,5,0.95) 0%, rgba(2,7,5,0.80) 38%, transparent 100%)",
          }}
        >
          <div className="relative h-[132px]">
            {CENA1_CAPTIONS.map((caption) => {
              const inFrame = toFrame(caption.atSeconds);
              const outFrame = toFrame(caption.untilSeconds);

              const opacity = interpolate(
                frame,
                [
                  inFrame,
                  inFrame + CAPTION_FADE,
                  outFrame - CAPTION_FADE,
                  outFrame,
                ],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              if (opacity <= 0) {
                return null;
              }

              return (
                <div
                  key={caption.text}
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    opacity,
                    translate: `0px ${interpolate(
                      opacity,
                      [0, 1],
                      [18, 0]
                    )}px`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-6 h-[2px] bg-emerald-400/70" />
                    <span className="text-sm font-mono uppercase tracking-[0.22em] text-emerald-400">
                      {caption.kicker}
                    </span>
                  </div>
                  <p className="text-[52px] leading-[1.1] font-extrabold tracking-tight text-slate-100">
                    <Highlighted
                      text={caption.text}
                      highlight={caption.highlight}
                    />
                  </p>
                </div>
              );
            })}

            <div
              className="absolute inset-x-0 bottom-0 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-emerald-400/40 bg-[#0F1F19]/92"
              style={{
                opacity: badgeSpring,
                scale: interpolate(badgeSpring, [0, 1], [0.88, 1]),
                transformOrigin: "left center",
                boxShadow: THEME.shadows.floatBadge,
              }}
            >
              <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                <span
                  className="absolute h-full w-full rounded-full bg-emerald-400"
                  style={{
                    opacity: 0.15 + pulse * 0.35,
                    scale: 1 + pulse * 0.6,
                  }}
                />
                <span className="relative h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_#10B981]" />
              </span>
              <span className="text-xl font-bold tracking-wide text-emerald-300">
                Bem-vindos ao GreenOps na prática
              </span>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
