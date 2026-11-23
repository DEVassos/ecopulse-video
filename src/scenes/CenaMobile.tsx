import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { SafeVideo } from "../components/SafeVideo";
import { MOBILE_VIDEO } from "../config/timeline";

/**
 * Cena Mobile - o EcoPulse no celular.
 *
 * Sem narração: só o cabeçalho ("Mobile" / "EcoPulse no celular") e a gravação
 * do celular dentro de um aparelho centralizado. A tela tem quase a altura
 * nativa da gravação (850px), então o vídeo não é ampliado.
 */

/** Altura da tela do aparelho, em px (a largura segue a proporção do vídeo). */
const SCREEN_HEIGHT = 820;
const SCREEN_WIDTH = Math.round(
  (SCREEN_HEIGHT * MOBILE_VIDEO.width) / MOBILE_VIDEO.height
);
const BEZEL = 12;

export const CenaMobile: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - 2,
    fps,
    config: { damping: 200 },
  });

  return (
    <SceneShell sceneKey="mobile">
      <div
        className="relative"
        style={{
          width: SCREEN_WIDTH + BEZEL * 2,
          height: SCREEN_HEIGHT + BEZEL * 2,
          padding: BEZEL,
          borderRadius: 52,
          background: "linear-gradient(160deg, #13241E 0%, #070F0C 100%)",
          border: "1px solid rgba(52, 211, 153, 0.35)",
          boxShadow:
            "0 40px 90px -20px rgba(0,0,0,0.9), 0 0 60px rgba(16,185,129,0.22)",
          opacity: enter,
          translate: `0px ${(1 - enter) * 28}px`,
        }}
      >
        {/* Botões laterais */}
        <span className="absolute -right-[3px] top-[150px] h-[80px] w-[3px] rounded-r bg-emerald-900/80" />
        <span className="absolute -left-[3px] top-[120px] h-[44px] w-[3px] rounded-l bg-emerald-900/80" />
        <span className="absolute -left-[3px] top-[180px] h-[70px] w-[3px] rounded-l bg-emerald-900/80" />

        <div
          className="relative w-full h-full overflow-hidden bg-black"
          style={{ borderRadius: 40 }}
        >
          <SafeVideo
            src={MOBILE_VIDEO.src}
            label="11 - EcoPulse no celular"
            trimBefore={Math.round(MOBILE_VIDEO.trimStartSeconds * fps)}
            volume={0}
            kenBurns={false}
            className="w-full h-full"
          />
        </div>
      </div>
    </SceneShell>
  );
};
