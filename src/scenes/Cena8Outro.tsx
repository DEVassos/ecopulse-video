import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { Brand } from "../components/Brand";

/**
 * Cena 8 - Fechamento
 *
 * Dois tempos, sincronizados com a narração:
 * 1. Recap em três batidas: "Visão geral" · "investigação" · "e decisão".
 * 2. O logo vira o elemento principal, com o batimento da marca, e o subtítulo
 *    entra em duas partes: "conectando monitoramento, dados" e
 *    "e sustentabilidade digital.".
 *
 * No fim o conteúdo se retira e o fundo fica intacto, para o loop fechar em
 * "fundo -> fundo" sem piscar.
 */

/** Batidas do recap (frames da cena), medidas nas pausas de cena8.mp3. */
const RECAP_STEPS = [8, 97, 182] as const;

const TITLE_OUT = [230, 264] as const;
const BRAND_IN = 266;
const BRAND_PULSE = 288;
const SUBTITLE_ONE = 353;
const SUBTITLE_TWO = 457;
const CONTENT_OUT = [659, 687] as const;

const SPRING_FAST = { damping: 16, stiffness: 110 } as const;
const SPRING_SOFT = { damping: 18, stiffness: 70 } as const;

interface RevealProps {
  frame: number;
  start: number;
  distance?: number;
  children: React.ReactNode;
}

/** Entrada padrão dos blocos de texto: sobe, surge e sai do desfoque. */
const Reveal: React.FC<RevealProps> = ({
  frame,
  start,
  distance = 26,
  children,
}) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - start,
    fps,
    config: SPRING_FAST,
  });

  return (
    <div
      style={{
        display: "inline-block",
        opacity: progress,
        translate: `0px ${interpolate(progress, [0, 1], [distance, 0])}px`,
        filter: `blur(${interpolate(progress, [0, 1], [6, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Cena8Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOut = interpolate(frame, TITLE_OUT, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (value) => value * value,
  });

  const brandIn = spring({
    frame: frame - BRAND_IN,
    fps,
    config: SPRING_FAST,
  });

  const ruleIn = spring({
    frame: frame - (SUBTITLE_ONE - 6),
    fps,
    config: SPRING_SOFT,
  });

  const contentOut = interpolate(frame, CONTENT_OUT, [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2);
  const glow = 1 + 0.05 * Math.sin((frame / fps) * Math.PI * 1.2);

  return (
    <SceneShell sceneKey="cena8" showHeader={false}>
      <div className="relative w-full h-full">
        {/* Recapitulação */}
        <div
          className="absolute inset-0 flex items-center justify-center text-center px-8"
          style={{
            opacity: (1 - titleOut) * contentOut,
            scale: interpolate(titleOut, [0, 1], [1, 0.94]),
            translate: `0px ${interpolate(titleOut, [0, 1], [0, -34])}px`,
            filter: `blur(${interpolate(titleOut, [0, 1], [0, 8])}px)`,
          }}
        >
          <h1 className="text-7xl font-black text-slate-100 tracking-tight leading-tight">
            <Reveal frame={frame} start={RECAP_STEPS[0]}>
              <span className="inline-block">Visão geral,</span>
            </Reveal>{" "}
            <Reveal frame={frame} start={RECAP_STEPS[1]}>
              <span className="inline-block">investigação</span>
            </Reveal>{" "}
            <Reveal frame={frame} start={RECAP_STEPS[2]}>
              <span className="inline-block text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.55)]">
                e decisão.
              </span>
            </Reveal>
          </h1>
        </div>

        {/* Assinatura: logo + subtítulo */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-8"
          style={{ opacity: contentOut }}
        >
          <div
            className="absolute w-[1100px] h-[1100px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.05) 42%, transparent 68%)",
              opacity: brandIn * (0.8 + pulse * 0.2),
            }}
          />

          <div
            className="relative"
            style={{
              opacity: brandIn,
              scale: interpolate(brandIn, [0, 1], [0.92, 1]) * glow,
              translate: `0px ${interpolate(brandIn, [0, 1], [24, 0])}px`,
            }}
          >
            <Brand
              startFrame={BRAND_PULSE}
              repeatSeconds={2.4}
              fontSize={104}
            />
          </div>

          <div
            className="relative rounded-full my-10"
            style={{
              width: interpolate(ruleIn, [0, 1], [0, 560]),
              height: 1,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.55) 25%, rgba(16,185,129,0.8) 50%, rgba(16,185,129,0.55) 75%, transparent 100%)",
              opacity: ruleIn,
            }}
          />

          <div className="relative flex flex-col items-center gap-3 text-center">
            <Reveal frame={frame} start={SUBTITLE_ONE} distance={20}>
              <p className="text-4xl font-medium text-slate-300 tracking-tight">
                conectando monitoramento, dados
              </p>
            </Reveal>

            <Reveal frame={frame} start={SUBTITLE_TWO} distance={20}>
              <p
                className="text-5xl font-black tracking-tight"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, #6EE7B7 0%, #34D399 45%, #FACC15 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: "drop-shadow(0 0 26px rgba(52,211,153,0.35))",
                }}
              >
                e sustentabilidade digital.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
