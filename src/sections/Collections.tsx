import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "L'Interdit",
    subtitle: 'Eau de Parfum',
    description: 'Une fragrance audacieuse qui défie les conventions. Notes de racine d\'iris, de jasmin sambac et de patchouli pour un sillage mystérieux et envoûtant.',
    price: '€145',
    image: '/product_women.png',
    category: 'Pour Elle',
  },
  {
    id: 2,
    name: "Terre d'Hermès",
    subtitle: 'Eau de Toilette',
    description: 'Une composition boisée et minérale qui célèbre la nature brute. Notes d\'agrumes, de poivre et de cèdre pour un homme authentique et sophistiqué.',
    price: '€128',
    image: '/product_men.png',
    category: 'Pour Lui',
  },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(card,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.2,
        }
      );
    }, card);

    return () => ctx.revert();
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="product-card group"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/10 overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute top-6 right-6 z-20">
          <span className="text-xs tracking-[0.2em] uppercase text-[#D8CBA6]/80 bg-black/40 px-3 py-1.5 rounded-full">
            {product.category}
          </span>
        </div>

        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-[#D8CBA6]/5 to-transparent rounded-full blur-3xl scale-75 group-hover:scale-100 transition-transform duration-700" />
          <img
            src={product.image}
            alt={product.name}
            className="relative z-10 h-full w-auto object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
            style={{
              filter: isHovered ? 'drop-shadow(0 20px 40px rgba(216, 203, 166, 0.2))' : 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
            }}
          />
        </div>

        <div className="relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#D8CBA6]/60 mb-2">
            {product.subtitle}
          </p>
          <h3
            className="text-2xl md:text-3xl mb-3 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-[#F0F0F0]/60 leading-relaxed mb-6">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span
              className="text-2xl gold-text font-medium"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.price}
            </span>
            <button className="magnetic-btn px-6 py-3 bg-[#D8CBA6] text-[#111111] text-sm tracking-[0.15em] uppercase font-medium rounded-full hover:bg-[#E8DFC4] transition-colors duration-300">
              Découvrir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Collections() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;

    if (!section || !heading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(heading,
        { y: 50, opacity: 0 },
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen py-24 md:py-32 overflow-hidden"
      style={{ zIndex: 30, backgroundColor: '#F4F1EA' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-xs tracking-[0.4em] uppercase text-[#1A1A1A]/50 mb-4">
            Nos Créations
          </p>
          <h2
            ref={headingRef}
            className="text-4xl md:text-6xl lg:text-7xl tracking-[0.05em] text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Nos Collections
          </h2>
          <div className="w-24 h-px bg-[#1A1A1A]/20 mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
