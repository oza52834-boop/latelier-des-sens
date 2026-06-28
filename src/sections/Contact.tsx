import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Phone, Instagram, Facebook } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const button = buttonRef.current;
    const footer = footerRef.current;

    if (!section || !heading || !button || !footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(heading,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(button,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: button,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.2,
        }
      );

      gsap.fromTo(footer,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setButtonPos({ x: x * 0.3, y: y * 0.3 });
  };

  const handleButtonMouseLeave = () => {
    setButtonPos({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      style={{ zIndex: 50, backgroundColor: '#111111' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 md:py-32">
        <p className="text-xs tracking-[0.4em] uppercase text-[#D8CBA6]/60 mb-6">
          Expérience Sur Mesure
        </p>
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl lg:text-8xl tracking-[0.05em] gold-text text-center mb-12"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Créez Votre Odeur
        </h2>
        <p className="text-center text-[#F0F0F0]/50 max-w-lg mb-12 text-sm md:text-base leading-relaxed">
          Offrez-vous une consultation privée avec nos parfumeurs experts pour créer une fragrance unique, 
          façonnée selon vos désirs et votre personnalité.
        </p>

        <button
          ref={buttonRef}
          className="magnetic-btn relative w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-[#D8CBA6]/40 flex items-center justify-center group hover:border-[#D8CBA6] transition-all duration-500"
          style={{
            transform: `translate(${buttonPos.x}px, ${buttonPos.y}px)`,
            transition: 'transform 0.2s ease-out, border-color 0.5s ease',
          }}
          onMouseMove={handleButtonMouseMove}
          onMouseLeave={handleButtonMouseLeave}
        >
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#D8CBA6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 text-center">
            <span
              className="block text-lg md:text-xl tracking-[0.15em] uppercase text-[#D8CBA6] group-hover:gold-text transition-all duration-300"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Prendre
            </span>
            <span
              className="block text-lg md:text-xl tracking-[0.15em] uppercase text-[#D8CBA6] group-hover:gold-text transition-all duration-300 mt-1"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Rendez-vous
            </span>
          </div>

          <div className="absolute inset-0 rounded-full border border-[#D8CBA6]/20 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500"
            style={{ animationDuration: '10s', borderStyle: 'dashed' }}
          />
        </button>
      </div>

      <div
        ref={footerRef}
        className="w-full border-t border-white/10 py-12 md:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="text-center md:text-left">
              <h3
                className="text-2xl tracking-[0.1em] gold-text mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                L'Atelier des Sens
              </h3>
              <p className="text-sm text-[#F0F0F0]/40 leading-relaxed">
                Parfumerie de niche contemporaine.<br />
                Créateur de fragrances d'exception depuis 2018.
              </p>
            </div>

            <div className="text-center">
              <h4 className="text-xs tracking-[0.3em] uppercase text-[#D8CBA6]/60 mb-6">
                Contact
              </h4>
              <div className="space-y-3">
                <a href="mailto:contact@atelierdessens.com" className="flex items-center justify-center gap-2 text-sm text-[#F0F0F0]/50 hover:text-[#D8CBA6] transition-colors">
                  <Mail size={14} />
                  contact@atelierdessens.com
                </a>
                <a href="tel:+33123456789" className="flex items-center justify-center gap-2 text-sm text-[#F0F0F0]/50 hover:text-[#D8CBA6] transition-colors">
                  <Phone size={14} />
                  +33 1 23 45 67 89
                </a>
                <div className="flex items-center justify-center gap-2 text-sm text-[#F0F0F0]/50">
                  <MapPin size={14} />
                  12 Rue de la Paix, Paris 75002
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-xs tracking-[0.3em] uppercase text-[#D8CBA6]/60 mb-6">
                Suivez-nous
              </h4>
              <div className="flex items-center justify-center md:justify-end gap-6">
                <a href="#" className="text-[#F0F0F0]/50 hover:text-[#D8CBA6] transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-[#F0F0F0]/50 hover:text-[#D8CBA6] transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
              <p className="text-xs text-[#F0F0F0]/30 mt-8">
                © 2024 L'Atelier des Sens. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
