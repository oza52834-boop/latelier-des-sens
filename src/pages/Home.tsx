import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import FluidBackground from '@/components/FluidBackground';
import CustomCursor from '@/components/CustomCursor';
import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';

import Hero from '@/sections/Hero';
import Philosophy from '@/sections/Philosophy';
import Collections from '@/sections/Collections';
import Atelier from '@/sections/Atelier';
import Contact from '@/sections/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        <FluidBackground />
        <CustomCursor />
        <Navigation />

        <main className="relative">
          <section id="hero">
            <Hero />
          </section>
          <section id="philosophy">
            <Philosophy />
          </section>
          <section id="collections">
            <Collections />
          </section>
          <section id="atelier">
            <Atelier />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </main>
      </div>
    </>
  );
}
