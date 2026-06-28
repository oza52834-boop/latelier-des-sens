import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });

      trailRefs.current.forEach((trail, i) => {
        if (!trail) return;
        gsap.to(trail, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15 + i * 0.03,
          ease: 'power2.out',
        });
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
      trailRefs.current.forEach(trail => {
        if (trail) gsap.to(trail, { opacity: 0.3, duration: 0.3 });
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
      trailRefs.current.forEach(trail => {
        if (trail) gsap.to(trail, { opacity: 0, duration: 0.3 });
      });
    };

    const handleLinkEnter = () => {
      gsap.to(cursor, {
        scale: 2.5,
        backgroundColor: 'rgba(216, 203, 166, 0.1)',
        borderColor: 'rgba(216, 203, 166, 0.6)',
        duration: 0.3,
      });
    };

    const handleLinkLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(216, 203, 166, 0.8)',
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const interactiveElements = document.querySelectorAll('a, button, .scratch-cursor, .product-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleLinkEnter);
      el.addEventListener('mouseleave', handleLinkLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleLinkEnter);
        el.removeEventListener('mouseleave', handleLinkLeave);
      });
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-5 h-5 rounded-full border border-[#D8CBA6]/80 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ opacity: 0 }}
      />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) trailRefs.current[i] = el; }}
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#D8CBA6]/30 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: 0 }}
        />
      ))}
    </>
  );
}
