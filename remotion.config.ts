import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
// Prints e UI com muito texto: qualidade alta evita artefato nas bordas das letras.
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(null);

Config.overrideBundlerConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});
