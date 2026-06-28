import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const line = lineRef.current;

    if (!container || !logo || !line) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          gsap.to(container, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete,
          });
        }, 300);
      },
    });

    tl.fromTo(logo,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    tl.fromTo(line,
      { width: 0, opacity: 0 },
      { width: 200, opacity: 1, duration: 1.2, ease: 'power2.inOut' },
      '-=0.3'
    );

    tl.to({}, { duration: 0.3 });

    return () => {
      clearInterval(progressInterval);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="loading-screen">
      <div ref={logoRef} className="text-center opacity-0">
        <h1 className="text-3xl md:text-4xl tracking-[0.2em] gold-text mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          L'ATELIER DES SENS
        </h1>
        <p className="text-xs tracking-[0.4em] uppercase text-[#D8CBA6]/50">
          Parfumerie de Niche
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <div ref={lineRef} className="h-px bg-gradient-to-r from-transparent via-[#D8CBA6] to-transparent" style={{ width: 0 }} />
        <p className="text-xs text-[#D8CBA6]/40 tracking-[0.2em]">
          {Math.min(Math.round(progress), 100)}%
        </p>
      </div>
    </div>
  );
}
