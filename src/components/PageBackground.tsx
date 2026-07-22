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
  const speedRef = useRef(0.42);
  const maxPixelCountRef = useRef(getMaxPixelCount());
  const [shaderReady, setShaderReady] = useState(false);
  // The animated WebGL background is desktop-only. On phones/tablets we skip it
  // entirely (no canvas, no rAF, no WebGL context) and fall back to the flat
  // `--bg` colour, which is by far the cheapest option for mobile scrolling.
  const [shaderEnabled, setShaderEnabled] = useState(
    () =>
      typeof window !== "undefined" &&
      !window.matchMedia("(max-width: 768px)").matches,
  );

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)");
    const sync = () => setShaderEnabled(!mobile.matches);
    sync();
    mobile.addEventListener("change", sync);
    return () => mobile.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !shaderEnabled) return;

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
  }, [shaderEnabled]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 768px)");
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        };
      }
    ).connection;

    const update = () => {
      const reducedMotion = motion.matches;
      const isMobile = mobile.matches;
      const saveData = Boolean(connection?.saveData);
      const lowEndCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
      const deviceMemory = (
        navigator as Navigator & { deviceMemory?: number }
      ).deviceMemory;
      const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 4;
      const lowPower = saveData || lowEndCpu || lowMemory;

      const nextSpeed = reducedMotion || isMobile || saveData
        ? 0
        : lowPower
          ? 0.2
          : 0.42;
      const nextMaxPixels = getMaxPixelCount({ isMobile, lowPower });

      speedRef.current = nextSpeed;
      maxPixelCountRef.current = nextMaxPixels;
      mountRef.current?.setSpeed(nextSpeed);
      mountRef.current?.setMaxPixelCount(nextMaxPixels);
    };

    update();
    motion.addEventListener("change", update);
    mobile.addEventListener("change", update);
    connection?.addEventListener?.("change", update);

    return () => {
      motion.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
    };
  }, []);

  // Pause the shader while the user is actively scrolling so the main thread
  // stays free for smooth scrolling, then resume shortly after scrolling stops.
  useEffect(() => {
    let idleTimer = 0;
    let paused = false;

    const onScroll = () => {
      if (!paused) {
        paused = true;
        mountRef.current?.setSpeed(0);
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        paused = false;
        mountRef.current?.setSpeed(speedRef.current);
      }, 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
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
