import {
  getShaderColorFromString,
  getShaderNoiseTexture,
  grainGradientFragmentShader,
  GrainGradientShapes,
  ShaderFitOptions,
  ShaderMount,
} from "@paper-design/shaders";

const DESKTOP_MAX_PIXELS = 1280 * 720;
const MOBILE_MAX_PIXELS = 854 * 480;

const COLORS = ["#fdfd96", "#ffffd1", "#ffffff"];
const COLOR_BACK = "#fdfd96";

export function getMaxPixelCount() {
  if (window.matchMedia("(max-width: 768px)").matches) {
    return MOBILE_MAX_PIXELS;
  }
  return DESKTOP_MAX_PIXELS;
}

function preloadNoiseTexture() {
  const img = getShaderNoiseTexture();
  if (!img) {
    return Promise.reject(new Error("Shader noise texture is unavailable"));
  }
  if (img.complete && img.naturalWidth > 0) {
    return Promise.resolve(img);
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load shader noise texture"));
  });
}

function buildUniforms(noiseTexture: HTMLImageElement) {
  return {
    u_colorBack: getShaderColorFromString(COLOR_BACK),
    u_colors: COLORS.map(getShaderColorFromString),
    u_colorsCount: COLORS.length,
    u_softness: 1,
    u_intensity: 0,
    u_noise: 0.12,
    u_shape: GrainGradientShapes.wave,
    u_noiseTexture: noiseTexture,
    u_fit: ShaderFitOptions.contain,
    u_scale: 1.32,
    u_rotation: 164,
    u_offsetX: -0.02,
    u_offsetY: 0.02,
    u_originX: 0.5,
    u_originY: 0.5,
    u_worldWidth: 0,
    u_worldHeight: 0,
  };
}

/** Start loading the noise texture as soon as this module is imported. */
export const shaderAssetsReady = preloadNoiseTexture();

export function createGrainGradientMount(
  parent: HTMLElement,
  speed: number,
  maxPixelCount: number,
  noiseTexture: HTMLImageElement,
) {
  return new ShaderMount(
    parent,
    grainGradientFragmentShader,
    buildUniforms(noiseTexture),
    undefined,
    speed,
    0,
    1,
    maxPixelCount,
  );
}
