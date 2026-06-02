import { useEffect, useState } from "react";
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
  const [speed, setSpeed] = useState(0.86);
  const [maxPixelCount, setMaxPixelCount] = useState(DESKTOP_MAX_PIXELS);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 768px)");

    const update = () => {
      const reducedMotion = motion.matches || document.hidden;
      setSpeed(reducedMotion ? 0 : 0.86);
      setMaxPixelCount(getMaxPixelCount());
    };

    update();
    motion.addEventListener("change", update);
    mobile.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      motion.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div className="page-shader" aria-hidden>
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
    </div>
  );
}
