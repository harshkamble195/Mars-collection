import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, RefreshCw, Truck } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const data = await api.products.list({ limit: 12 });
        const productsList = data.products || [];
        setFeaturedProducts(productsList.filter((p) => p.isFeatured));
        setTrendingProducts(productsList.filter((p) => p.isTrending));
      } catch (error) {
        console.error('Error fetching landing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  const categories = [
    {
      name: 'Premium Hoodies',
      path: '/shop?category=Hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
    },
    {
      name: 'Luxury Tees',
      path: '/shop?category=T-Shirts',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
    },
    {
      name: 'Tailored Jackets',
      path: '/shop?category=Jackets',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600',
    },
    {
      name: 'Emblem Accessories',
      path: '/shop?category=Accessories',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600',
    },
  ];

  const testimonials = [
    {
      name: 'Alexander Sterling',
      role: 'Fashion Designer',
      text: 'MARS Collection brings couture-level fabric weight and meticulous attention to detail to modern streetwear. The Signature Hoodie holds its shape perfectly.',
      rating: 5,
    },
    {
      name: 'Sophia Laurent',
      role: 'Creative Director',
      text: 'A truly premium experience. The minimalist branding, high-grade Italian calfskin leather sneakers, and prompt service make MARS my go-to luxury basic store.',
      rating: 5,
    },
    {
      name: 'Julian Vance',
      role: 'Collector & Stylist',
      text: 'The tailoring on the gabardine trench coat is outstanding. Seamless lines, waterproof coating, and premium silk lining. Worth every penny.',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner Section */}
      <section className="relative h-[90vh] md:h-screen w-full flex items-center bg-luxury-black overflow-hidden">
        {/* Background Image overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920"
          alt="MARS Collection Luxury Campaign"
          className="absolute inset-0 w-full h-full object-cover object-center animate-fade-in"
        />

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-6 w-full z-20 text-left text-white mt-12">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-gold font-medium animate-slide-up">
            Autumn / Winter Campaign '26
          </p>
          <h1 className="font-serif text-5xl md:text-8xl tracking-wide leading-none mt-4 max-w-4xl animate-slide-up">
            Architectural <br />Silhouettes
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-light tracking-wide max-w-lg mt-6 leading-relaxed animate-slide-up">
            Discover minimal luxury streetwear engineered with heavyweight organic cottons, clean structural cuts, and subtle gold accents.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-slide-up">
            <Link to="/shop" className="btn-gold">
              Shop The Collection
            </Link>
            <Link to="/shop?sort=createdAt" className="btn-outline">
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20 text-white/50 text-[9px] uppercase tracking-widest font-medium">
          <span>Scroll</span>
          <div className="h-8 w-[1px] bg-white/30 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gold animate-bounce" />
          </div>
        </div>
      </section>

      {/* Brand Value Statements */}
      <section className="bg-white dark:bg-luxury-black border-b border-gray-100 dark:border-luxury-border py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-4">
            <Shield size={24} className="text-gold mb-3" />
            <h4 className="text-xs uppercase tracking-widest font-semibold">Premium Craftsmanship</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xs font-light">
              Meticulously selected fabrics, including long-staple organic cottons and Italian calfskin leathers.
            </p>
          </div>
          <div className="flex flex-col items-center p-4">
            <Truck size={24} className="text-gold mb-3" />
            <h4 className="text-xs uppercase tracking-widest font-semibold">Complimentary Express Shipping</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xs font-light">
              Enjoy complimentary express shipping on all domestic orders exceeding $150.
            </p>
          </div>
          <div className="flex flex-col items-center p-4">
            <RefreshCw size={24} className="text-gold mb-3" />
            <h4 className="text-xs uppercase tracking-widest font-semibold">Conscious Luxury</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xs font-light">
              Ethical production, small batch releases, and sustainable packaging materials.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full text-left">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-12 gap-4">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-wide">Featured Items</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light uppercase tracking-wider">
              Selected key looks from our signature collection
            </p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest hover:text-gold transition-colors text-luxury-charcoal dark:text-white"
          >
            View All Catalog <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Category Grid Section */}
      <section className="bg-beige-100 dark:bg-luxury-charcoal border-y border-gray-200 dark:border-luxury-border py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl tracking-wide">Curated Categories</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light uppercase tracking-wider">
              Browse wardrobe pieces by collection lines
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={cat.path}
                className="group relative h-96 overflow-hidden bg-luxury-black shadow-sm"
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-500 z-10" />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20 text-left text-white">
                  <h3 className="font-serif text-xl tracking-wider">{cat.name}</h3>
                  <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-gold mt-2 font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Explore Now <ArrowRight size={10} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Brand Block */}
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-luxury-black text-center text-white px-6">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920"
          alt="MARS Brand Statement Campaign"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative max-w-3xl z-20">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">Our Core Philosophy</p>
          <h2 className="font-serif text-3xl md:text-5xl mt-4 tracking-wide leading-tight">
            "We believe in creating garments that outlast trends, merging structural streetwear with minimal luxury fabrics."
          </h2>
          <p className="text-xs text-gray-300 font-light mt-6 tracking-widest uppercase">
            Designed in New York &bull; Engineered in Italy
          </p>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full text-left">
        <div className="mb-12">
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide">Trending Right Now</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light uppercase tracking-wider">
            Most popular purchases from this season
          </p>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {trendingProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-beige-100 dark:bg-luxury-charcoal border-t border-gray-200 dark:border-luxury-border py-20 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-serif text-3xl md:text-4xl tracking-wide">Customer Reviews</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light uppercase tracking-wider">
              Feedback from our global clientele
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <div
                key={index}
                className="bg-white dark:bg-luxury-black p-8 shadow-sm border border-gray-100 dark:border-luxury-border/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-center text-gold gap-0.5 mb-6">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" className="text-gold" />
                    ))}
                  </div>
                  <p className="text-sm font-light text-gray-600 dark:text-gray-300 italic leading-relaxed">
                    "{test.text}"
                  </p>
                </div>
                <div className="mt-8 border-t border-gray-100 dark:border-luxury-border/30 pt-4 text-center">
                  <h4 className="text-xs uppercase tracking-widest font-semibold">{test.name}</h4>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">{test.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
