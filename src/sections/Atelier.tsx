import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Ingredient {
  name: string;
  note: string;
  position: { x: string; y: string };
  size: string;
}

const ingredients: Ingredient[] = [
  { name: 'Bergamote', note: 'Note de Tête', position: { x: '10%', y: '15%' }, size: 'text-4xl md:text-6xl' },
  { name: 'Rose de Damas', note: 'Note de Cœur', position: { x: '60%', y: '65%' }, size: 'text-3xl md:text-5xl' },
  { name: 'Ambre Gris', note: 'Note de Fond', position: { x: '25%', y: '75%' }, size: 'text-3xl md:text-5xl' },
  { name: 'Vétiver', note: 'Note de Fond', position: { x: '70%', y: '25%' }, size: 'text-2xl md:text-4xl' },
  { name: 'Iris', note: 'Note de Cœur', position: { x: '45%', y: '40%' }, size: 'text-2xl md:text-3xl' },
  { name: 'Musc', note: 'Note de Fond', position: { x: '15%', y: '50%' }, size: 'text-xl md:text-2xl' },
];

export default function Atelier() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = section.offsetWidth;
    let height = section.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ['#A63D40', '#C89F9C', '#D8CBA6', '#0D1B2A', '#8B4513'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 80 + 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.15 + 0.05,
      });
    }

    let time = 0;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      time += 0.005;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        width * mouseRef.current.x,
        height * mouseRef.current.y,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, '#1a0f0f');
      gradient.addColorStop(0.5, '#0D1B2A');
      gradient.addColorStop(1, '#111111');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.3;
        p.y += p.vy + Math.cos(time + p.x * 0.01) * 0.3;

        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        const particleGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        particleGradient.addColorStop(0, p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0'));
        particleGradient.addColorStop(1, p.color + '00');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleGradient;
        ctx.fill();
      });

      const mouseGradient = ctx.createRadialGradient(
        width * mouseRef.current.x,
        height * mouseRef.current.y,
        0,
        width * mouseRef.current.x,
        height * mouseRef.current.y,
        150
      );
      mouseGradient.addColorStop(0, 'rgba(216, 203, 166, 0.1)');
      mouseGradient.addColorStop(1, 'rgba(216, 203, 166, 0)');
      ctx.fillStyle = mouseGradient;
      ctx.beginPath();
      ctx.arc(width * mouseRef.current.x, height * mouseRef.current.y, 150, 0, Math.PI * 2);
      ctx.fill();
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };

    const handleResize = () => {
      width = section.offsetWidth;
      height = section.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    section.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      section.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const ingredientsContainer = ingredientsRef.current;

    if (!section || !heading || !ingredientsContainer) return;

    const ctx = gsap.context(() => {
      const ingredientElements = ingredientsContainer.querySelectorAll('.ingredient-item');

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
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: 'none' },
        0
      );

      scrollTl.fromTo(heading,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
        0.05
      );

      ingredientElements.forEach((el, i) => {
        scrollTl.fromTo(el,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' },
          0.1 + i * 0.03
        );
      });

      scrollTl.to(section,
        { opacity: 0, duration: 0.2, ease: 'power2.in' },
        0.8
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 40 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <div className="relative z-10 w-full h-full">
        <div className="absolute top-12 left-1/2 -translate-x-1/2">
          <p className="text-center text-xs tracking-[0.4em] uppercase text-[#D8CBA6]/60 mb-4">
            Découvrez
          </p>
          <h2
            ref={headingRef}
            className="text-4xl md:text-6xl tracking-[0.1em] gold-text text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            L'Atelier
          </h2>
        </div>

        <div ref={ingredientsRef} className="absolute inset-0">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.name}
              className="ingredient-item absolute float-text"
              style={{
                left: ingredient.position.x,
                top: ingredient.position.y,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${5 + index}s`,
              }}
            >
              <span
                className={`${ingredient.size} text-[#F0F0F0]/20 hover:text-[#D8CBA6]/80 transition-colors duration-500 cursor-default select-none`}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  mixBlendMode: 'difference',
                }}
              >
                {ingredient.name}
              </span>
              <span className="block text-xs tracking-[0.2em] uppercase text-[#D8CBA6]/40 mt-1">
                {ingredient.note}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm text-[#F0F0F0]/50 italic max-w-md">
            Chaque fragrance est composée à partir des ingrédients les plus précieux, sélectionnés avec soin dans le monde entier.
          </p>
        </div>
      </div>
    </section>
  );
}
