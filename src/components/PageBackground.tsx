import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";

const DESKTOP_MAX_PIXELS = 1280 * 720;
const MOBILE_MAX_PIXELS = 854 * 480;

function getMaxPixelCount() {
  if (window.matchMedia("(max-width: 768px)").matches) {
    return MOBILE_MAX_PIXELS;
  }
  return DESKTOP_MAX_PIXELS;
}

export default function PageBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [speed, setSpeed] = useState(0.86);
  const [maxPixelCount, setMaxPixelCount] = useState(getMaxPixelCount);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const markReady = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setReady(true);
        setMaxPixelCount(getMaxPixelCount());
      }
    };

    markReady();
    const observer = new ResizeObserver(markReady);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 768px)");

    const update = () => {
      const reducedMotion = motion.matches;
      setSpeed(reducedMotion ? 0 : 0.86);
      setMaxPixelCount(getMaxPixelCount());
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
    <div ref={containerRef} className="page-shader" aria-hidden>
      {ready && (
        <GrainGradient
          style={{ width: "100%", height: "100%" }}
          colors={["#fdfd96", "#ffffd1", "#ffffff"]}
          colorBack="#fdfd96"
          softness={1}
          intensity={0}
          noise={0.12}
          shape="wave"
          speed={speed}
          scale={1.32}
          rotation={164}
          offsetX={-0.02}
          offsetY={0.02}
          minPixelRatio={1}
          maxPixelCount={maxPixelCount}
        />
      )}
    </div>
  );
}
