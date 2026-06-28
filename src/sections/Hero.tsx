import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const h1 = heading1Ref.current;
    const h2 = heading2Ref.current;
    const sub = subheadingRef.current;
    const prompt = scrollPromptRef.current;

    if (!section || !h1 || !h2 || !sub || !prompt) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(h1, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )
      .fromTo(h2,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.9'
      )
      .fromTo(sub,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(prompt,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.8,
        }
      });

      scrollTl
        .to(h1, { y: -80, ease: 'none' }, 0)
        .to(h2, { y: -60, ease: 'none' }, 0)
        .to(sub, { opacity: 0, y: -40, ease: 'none' }, 0)
        .to([h1, h2], { 
          opacity: 0, 
          scale: 1.1,
          ease: 'power2.in',
          duration: 0.3 
        }, 0.7)
        .to(prompt, { opacity: 0, ease: 'none' }, 0.1);

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ zIndex: 10 }}
    >
      <div className="relative z-10 text-center px-4">
        <h1
          ref={heading1Ref}
          className="text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] tracking-[0.02em] font-medium gold-text opacity-0"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          L'ATELIER
        </h1>
        <h1
          ref={heading2Ref}
          className="text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] tracking-[0.02em] font-medium gold-text mt-2 opacity-0"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          DES SENS
        </h1>
        <p
          ref={subheadingRef}
          className="mt-8 text-sm md:text-base tracking-[0.3em] uppercase text-[#D8CBA6]/80 opacity-0"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          Parfumerie de niche contemporaine
        </p>
      </div>

      <div
        ref={scrollPromptRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 opacity-0"
      >
        <p className="text-xs tracking-[0.4em] uppercase text-[#D8CBA6]/60 mb-4">
          Toucher pour découvrir
        </p>
        <div className="w-px h-12 bg-gradient-to-b from-[#D8CBA6]/60 to-transparent mx-auto animate-pulse" />
      </div>
    </section>
  );
}
