import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  value: number;
  suffix: string;
  prefix?: string;
  duration?: number;
}

const AnimatedCounter = ({ value, suffix, prefix = '', duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.3, triggerOnce: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (isIntersecting && !hasStarted.current) {
      hasStarted.current = true;
      const startTime = performance.now();
      const startValue = 0;

      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (value - startValue) * eased;
        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setCount(value);
        }
      };

      requestAnimationFrame(tick);
    }
  }, [isIntersecting, value, duration]);

  const displayValue = value % 1 !== 0 ? count.toFixed(1) : Math.floor(count).toString();

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <span className="font-display text-sage text-5xl md:text-6xl lg:text-7xl font-bold leading-none">
        {prefix}{displayValue}{suffix}
      </span>
    </div>
  );
};

export default AnimatedCounter;
