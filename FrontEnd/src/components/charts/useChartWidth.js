import { useEffect, useRef, useState } from "react";

export const useChartWidth = (fallback = 320) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      const nextWidth = containerRef.current?.clientWidth || fallback;
      setWidth(Math.max(nextWidth - 8, 220));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [fallback]);

  return { containerRef, width };
};
