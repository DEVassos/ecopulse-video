import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../config/theme";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import {
  CENA2_CLIPS,
  CENA2_SIMULATION_SECONDS,
  Cena2Clip,
  clipSeconds,
} from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { SafeVideo } from "../components/SafeVideo";

/** Frames de varredura verde em cada corte entre um trecho e o próximo. */
const CUT_FLASH_FRAMES = 12;

/** Moldura de escala de cada trecho: o globo abre devagar, o card fecha o plano. */
const CLIP_PUSH: readonly (readonly [number, number])[] = [
  [1.0, 1.15],
  [1.02, 1.08],
  [1.0, 1.12],
];

const ClipLayer: React.FC<{ clip: Cena2Clip; index: number }> = ({
  clip,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrames = Math.round(clipSeconds(clip) * fps);
  const [from, to] = CLIP_PUSH[index] ?? [1, 1];
  const push = interpolate(frame, [0, localFrames], [from, to], {
    extrapolateRight: "clamp",
  });

  // No trecho da simulação o push acompanha o card no canto inferior direito.
  const focus =
    index === CLIP_PUSH.length - 1
      ? interpolate(frame, [localFrames * 0.45, localFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill>
      <SafeVideo
        src={clip.src}
        label={clip.legend}
        trimBefore={Math.round(clip.startSeconds * fps)}
        playbackRate={1}
        volume={0}
        kenBurns={false}
        scale={push}
        style={{ translate: `${-46 * focus}px ${-34 * focus}px` }}
        className="w-full h-full"
      />
    </AbsoluteFill>
  );
};

/** Varredura de luz verde marcando a troca de trecho (mesma linguagem da cena 1). */
const CutFlash: React.FC<{ atFrame: number }> = ({ atFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - atFrame;

  if (local < 0 || local > CUT_FLASH_FRAMES) return null;

  const progress = local / CUT_FLASH_FRAMES;

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        opacity: interpolate(progress, [0, 0.25, 1], [0, 0.55, 0]),
        background:
          "linear-gradient(105deg, transparent 30%, #d8fff0 48%, #34d399 52%, transparent 70%)",
        translate: `${interpolate(progress, [0, 1], [-30, 30])}% 0px`,
        scale: 1.1,
      }}
    />
  );
};

/**
 * Cena 2 - O Mapa e a Simulação.
 * Os três trechos são encaixados pelo plano em segundos absolutos definido em
 * `CENA2_CLIPS`, cortando nas pausas reais da narração.
 */
export const Cena2Map: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bounds = CENA2_CLIPS.map((clip) => ({
    start: Math.round(clip.atSeconds * fps),
    length: Math.round(clipSeconds(clip) * fps),
  }));

  const activeIndex = CENA2_CLIPS.reduce(
    (current, _clip, index) => (frame >= bounds[index].start ? index : current),
    0
  );

  const badgeStart = Math.round(CENA2_SIMULATION_SECONDS * fps) + 24;
  const badgeSpring = spring({
    frame: frame - badgeStart,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Respiro final: o plano já entregou o resultado, a cena apenas fecha.
  const outro = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <SceneShell sceneKey="cena2">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/dashboard/map"
        title="EcoPulse • Global Carbon Mesh"
      >
        {CENA2_CLIPS.map((clip, index) => (
          <Sequence
            key={clip.src}
            from={bounds[index].start}
            durationInFrames={bounds[index].length}
          >
            <ClipLayer clip={clip} index={index} />
          </Sequence>
        ))}

        {bounds.slice(1).map((bound) => (
          <CutFlash key={`flash-${bound.start}`} atFrame={bound.start} />
        ))}

        <div
          className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 text-xs font-mono text-emerald-300"
          style={{ opacity: interpolate(outro, [0, 1], [1, 0]) }}
        >
          {CENA2_CLIPS[activeIndex].legend}
        </div>

        {frame >= badgeStart ? (
          <div
            className="absolute bottom-6 right-6 z-30 flex items-center gap-4 px-5 py-3 rounded-2xl bg-[#08130F]/95 border-2 border-emerald-400/80"
            style={{
              opacity: badgeSpring * interpolate(outro, [0, 1], [1, 0]),
              scale: interpolate(badgeSpring, [0, 1], [0.8, 1]),
              translate: `0px ${interpolate(badgeSpring, [0, 1], [40, 0])}px`,
              boxShadow: THEME.shadows.glow,
            }}
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                Recomendação Inteligente
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black tracking-tight text-slate-100">
                  Alternativa Limpa
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  Redução de 86,44%
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </BrowserFrame>
    </SceneShell>
  );
};
