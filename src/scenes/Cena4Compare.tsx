import React from "react";
import { Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FULL_SCREEN_WIDTH } from "../config/layout";
import { CENA4_CLIPS, CENA4_OVERLAYS, clipSeconds } from "../config/timeline";
import { SceneShell } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { CutFlash, ScreenClipLayer } from "../components/ScreenClip";
import { DiscrepancyCard } from "./Cena4Overlays";

/**
 * Cena 4 - Comparação e Causa Raiz.
 *
 * O roteiro pedia split-screen 50/50, mas a aplicação é sequencial: primeiro
 * você seleciona os serviços e eles aparecem em colunas, depois vêm as curvas
 * cruzadas de cada serviço. Além disso, em 848px de largura (metade da tela) os
 * gráficos gravados a 1376px perdem boa parte da legibilidade. Por isso os dois
 * trechos rodam em tela cheia, emendados na pausa da narração — o corte é o
 * momento em que a fala passa da discrepância para a explicação.
 */
export const Cena4Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const toFrame = (seconds: number) => Math.round(seconds * fps);

  const bounds = CENA4_CLIPS.map((clip) => ({
    start: Math.round(clip.atSeconds * fps),
    length: Math.round(clipSeconds(clip) * fps),
  }));

  const activeIndex = CENA4_CLIPS.reduce(
    (current, _clip, index) => (frame >= bounds[index].start ? index : current),
    0
  );

  // Respiro final: o plano já entregou o resultado, a cena apenas fecha.
  const outro = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <SceneShell sceneKey="cena4">
      <BrowserFrame
        width={FULL_SCREEN_WIDTH}
        url="app.ecopulse.greenops.io/dashboard/compare"
        title="EcoPulse • Análise de Causa Raiz"
      >
        {CENA4_CLIPS.map((clip, index) => (
          <Sequence
            key={clip.src}
            from={bounds[index].start}
            // O último trecho segura o frame final até a cena fechar, para não
            // abrir um vão de tela vazia depois que a gravação acaba.
            durationInFrames={
              index === CENA4_CLIPS.length - 1
                ? durationInFrames - bounds[index].start
                : bounds[index].length
            }
          >
            <ScreenClipLayer
              src={clip.src}
              startSeconds={clip.startSeconds}
              label={clip.legend}
            />
          </Sequence>
        ))}

        {bounds.slice(1).map((bound) => (
          <CutFlash key={`flash-${bound.start}`} atFrame={bound.start} />
        ))}

        <div
          className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-lg bg-[#0F1F19]/90 border border-emerald-500/30 text-[14px] font-mono text-emerald-300"
          style={{ opacity: interpolate(outro, [0, 1], [1, 0]) }}
        >
          {CENA4_CLIPS[activeIndex].legend}
        </div>

        <Sequence
          from={toFrame(CENA4_OVERLAYS.discrepancy.inSeconds)}
          durationInFrames={toFrame(
            CENA4_OVERLAYS.discrepancy.outSeconds -
              CENA4_OVERLAYS.discrepancy.inSeconds
          )}
          layout="none"
        >
          <DiscrepancyCard />
        </Sequence>
      </BrowserFrame>
    </SceneShell>
  );
};
