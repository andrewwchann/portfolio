import { useCallback, useEffect, useRef, useState } from "react";
import type { AboutPhoto } from "../data/types";
import { asset } from "../utils/asset";

type AboutCarouselProps = {
  photos: AboutPhoto[];
};

export default function AboutCarousel({ photos }: AboutCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const count = photos.length;
  const hasMultiple = count > 1;
  const current = photos[index];

  const goTo = useCallback(
    (next: number) => {
      if (!hasMultiple) return;
      setIndex((next + count) % count);
    },
    [count, hasMultiple],
  );

  useEffect(() => {
    setIndex((i) => (count === 0 ? 0 : Math.min(i, count - 1)));
  }, [count]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "120px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || count === 0) return;

    setLoaded((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, [inView, index, count]);

  useEffect(() => {
    if (!inView || count <= 1) return;

    const preloadNeighbors = () => {
      setLoaded((prev) => {
        const next = new Set(prev);
        next.add((index + 1) % count);
        next.add((index - 1 + count) % count);
        return next;
      });
    };

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(preloadNeighbors, { timeout: 2000 });
    } else {
      timeoutId = setTimeout(preloadNeighbors, 1500);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [inView, index, count]);

  if (!current) return null;

  return (
    <div
      ref={carouselRef}
      className="about-carousel"
      aria-roledescription="carousel"
      aria-label="About photos"
    >
      <div className="about-carousel__viewport">
        {photos.map((photo, i) =>
          loaded.has(i) ? (
            <img
              key={photo.src}
              className={`about-carousel__image${i === index ? " is-active" : ""}`}
              src={asset(photo.src)}
              alt={i === index ? photo.alt : ""}
              aria-hidden={i !== index}
              width={520}
              height={520}
              decoding="async"
              loading={i === index ? "eager" : "lazy"}
            />
          ) : null,
        )}
        {current.caption ? (
          <p className="about-carousel__caption">{current.caption}</p>
        ) : null}
        {hasMultiple ? (
          <>
            <button
              type="button"
              className="about-carousel__zone about-carousel__zone--prev"
              onClick={() => goTo(index - 1)}
              aria-label="Previous photo"
            />
            <button
              type="button"
              className="about-carousel__zone about-carousel__zone--next"
              onClick={() => goTo(index + 1)}
              aria-label="Next photo"
            />
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div
          className="about-carousel__dots"
          role="tablist"
          aria-label="Choose photo"
        >
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              role="tab"
              className="about-carousel__dot"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1} of ${count}: ${photo.alt}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
