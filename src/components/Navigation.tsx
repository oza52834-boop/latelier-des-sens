import { useEffect, useRef, useState } from 'react';

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Philosophie', href: '#philosophy' },
  { label: 'Collections', href: '#collections' },
  { label: "L'Atelier", href: '#atelier' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
      setIsVisible(scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div
        className="mx-4 md:mx-8 mt-4 rounded-full transition-all duration-500"
        style={{
          backgroundColor: isScrolled ? 'rgba(17, 17, 17, 0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          border: isScrolled ? '1px solid rgba(216, 203, 166, 0.1)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => handleClick(e, '#hero')}
            className="text-lg tracking-[0.15em] gold-text hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            L'ADS
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-xs tracking-[0.15em] uppercase text-[#F0F0F0]/60 hover:text-[#D8CBA6] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D8CBA6] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <a
            href="#contact"
            onClick={(e) => handleClick(e, '#contact')}
            className="text-xs tracking-[0.15em] uppercase px-5 py-2 border border-[#D8CBA6]/40 rounded-full text-[#D8CBA6] hover:bg-[#D8CBA6] hover:text-[#111111] transition-all duration-300"
          >
            Boutique
          </a>
        </div>
      </div>
    </nav>
  );
}
