// EcoPulse - Remotion Entry Point
// Renderizar via CLI:
// npx remotion render src/index.ts EcoPulseMain out/ecopulse.mp4

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
