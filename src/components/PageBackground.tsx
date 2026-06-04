import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  createGrainGradientMount,
  getMaxPixelCount,
  shaderAssetsReady,
} from "./shaderBackground";
import type { ShaderMount } from "@paper-design/shaders";

export default function PageBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<ShaderMount | null>(null);
  const speedRef = useRef(0.86);
  const maxPixelCountRef = useRef(getMaxPixelCount());
  const [shaderReady, setShaderReady] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    shaderAssetsReady
      .then((noiseTexture) => {
        if (cancelled || !containerRef.current) return;

        mountRef.current?.dispose();
        mountRef.current = createGrainGradientMount(
          containerRef.current,
          speedRef.current,
          maxPixelCountRef.current,
          noiseTexture,
        );

        requestAnimationFrame(() => {
          if (!cancelled) setShaderReady(true);
        });
      })
      .catch((error) => {
        console.error("Background shader failed to initialize:", error);
      });

    return () => {
      cancelled = true;
      mountRef.current?.dispose();
      mountRef.current = null;
      setShaderReady(false);
    };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 768px)");

    const update = () => {
      const reducedMotion = motion.matches;
      const nextSpeed = reducedMotion ? 0 : 0.86;
      const nextMaxPixels = getMaxPixelCount();

      speedRef.current = nextSpeed;
      maxPixelCountRef.current = nextMaxPixels;
      mountRef.current?.setSpeed(nextSpeed);
      mountRef.current?.setMaxPixelCount(nextMaxPixels);
    };

    update();
    motion.addEventListener("change", update);
    mobile.addEventListener("change", update);

    return () => {
      motion.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`page-shader${shaderReady ? " page-shader-ready" : ""}`}
      aria-hidden
    />
  );
}
