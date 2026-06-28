import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScratchCardProps {
  word: string;
  delay: number;
}

function ScratchCard({ word }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#b8b8b8');
    gradient.addColorStop(0.25, '#e0e0e0');
    gradient.addColorStop(0.5, '#a0a0a0');
    gradient.addColorStop(0.75, '#d0d0d0');
    gradient.addColorStop(1, '#909090');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const brightness = Math.random() * 40 - 20;
      ctx.fillStyle = `rgba(${160 + brightness}, ${160 + brightness}, ${160 + brightness}, 0.3)`;
      ctx.fillRect(x, y, 1, 1);
    }

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x * dpr, y * dpr, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  const handleMouseDown = () => { isDrawing.current = true; };
  const handleMouseUp = () => { isDrawing.current = false; };
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  }, [scratch]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
  }, [scratch]);

  useEffect(() => {
    initCanvas();

    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[280px] h-[360px] mx-auto overflow-hidden rounded-lg scratch-cursor"
      style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1A1A2E 50%, #16213E 100%)'
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-3xl md:text-4xl tracking-[0.15em] font-medium text-[#D8CBA6]"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: '0 0 20px rgba(216, 203, 166, 0.3)'
          }}
        >
          {word}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      />
    </div>
  );
}

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const revealTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    const revealText = revealTextRef.current;

    if (!section || !cards || !revealText) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.8,
        }
      });

      scrollTl.fromTo(section,
        { y: '100%' },
        { y: '0%', duration: 0.2, ease: 'none' },
        0
      );

      const cardElements = cards.querySelectorAll('.scratch-card-wrapper');
      scrollTl.fromTo(cardElements,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.15, ease: 'power2.out' },
        0.1
      );

      scrollTl.fromTo(revealText,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.1, ease: 'power2.out' },
        0.2
      );

      scrollTl.to(section,
        { y: '-100%', duration: 0.2, ease: 'power2.in' },
        0.8
      );

    }, section);

    return () => ctx.revert();
  }, []);

  const cards = [
    { word: 'PERCEPTION', delay: 0 },
    { word: 'ÉMOTION', delay: 0.1 },
    { word: 'INTIMITÉ', delay: 0.2 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        zIndex: 20,
        backgroundImage: 'url(/paper_texture.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <h2
          className="text-center text-3xl md:text-5xl mb-16 tracking-[0.1em] gold-text"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Notre Philosophie
        </h2>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {cards.map((card) => (
            <div key={card.word} className="scratch-card-wrapper">
              <ScratchCard word={card.word} delay={card.delay} />
              <p className="text-center text-xs text-[#D8CBA6]/50 mt-4 tracking-[0.2em] uppercase">
                Grattez pour révéler
              </p>
            </div>
          ))}
        </div>

        <p
          ref={revealTextRef}
          className="text-center text-lg md:text-xl mt-16 text-[#F0F0F0]/80 italic max-w-2xl mx-auto"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          "Le parfum est un art qui se raconte sur la peau."
        </p>
      </div>
    </section>
  );
}
