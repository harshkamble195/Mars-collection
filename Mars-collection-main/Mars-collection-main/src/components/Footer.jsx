import React from 'react';
import { Mail } from 'lucide-react';

const Footer = () => {
  const handleSubmitNewsletter = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to AURA updates.');
    e.target.reset();
  };

  return (
    <footer className="bg-luxury-black text-white border-t border-luxury-border">
      {/* Upper Newsletter Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-luxury-border">
        <div>
          <h3 className="font-serif text-2xl md:text-3xl tracking-wide">Subscribe to MARS Updates</h3>
          <p className="text-gray-400 text-sm mt-2 font-light">
            Receive early access to collections, campaigns, and exclusive digital experiences.
          </p>
        </div>
        <form onSubmit={handleSubmitNewsletter} className="flex items-center gap-2 max-w-md w-full self-center md:ml-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full bg-transparent border border-gray-700 focus:border-gold px-4 py-3 text-sm focus:outline-none transition-colors duration-150 rounded-none placeholder-gray-500"
            required
          />
          <button type="submit" className="bg-white hover:bg-gold text-luxury-black font-medium tracking-widest text-xs px-6 py-3.5 uppercase transition-all duration-300 rounded-none whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <h2 className="font-serif text-3xl tracking-widest">MARS</h2>
          <p className="text-gray-400 text-xs font-light leading-relaxed">
            Crafting contemporary, minimal luxury apparel and streetwear. Dedicated to quality silhouettes, organic textiles, and conscious craftsmanship.
          </p>
          <div className="flex gap-4 pt-2 text-gray-400">
            <a href="#" className="hover:text-gold transition-colors duration-200" aria-label="Instagram">
              <svg className="w-[18px] h-[18px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="hover:text-gold transition-colors duration-200" aria-label="Twitter">
              <svg className="w-[18px] h-[18px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="hover:text-gold transition-colors duration-200" aria-label="Explore">
              <svg className="w-[18px] h-[18px] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-300 mb-4">Collections</h4>
          <ul className="space-y-2.5 text-xs text-gray-400 font-light">
            <li><a href="/shop?category=Hoodies" className="hover:text-gold transition-colors duration-150">Premium Hoodies</a></li>
            <li><a href="/shop?category=T-Shirts" className="hover:text-gold transition-colors duration-150">Luxury Tees</a></li>
            <li><a href="/shop?category=Jackets" className="hover:text-gold transition-colors duration-150">Tailored Jackets</a></li>
            <li><a href="/shop?category=Footwear" className="hover:text-gold transition-colors duration-150">Calfskin Footwear</a></li>
            <li><a href="/shop?category=Accessories" className="hover:text-gold transition-colors duration-150">Emblem Accessories</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-300 mb-4">Customer Support</h4>
          <ul className="space-y-2.5 text-xs text-gray-400 font-light">
            <li><a href="#" className="hover:text-gold transition-colors duration-150">Contact Support</a></li>
            <li><a href="#" className="hover:text-gold transition-colors duration-150">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-gold transition-colors duration-150">Sizing Guides</a></li>
            <li><a href="#" className="hover:text-gold transition-colors duration-150">FAQ & Policies</a></li>
            <li><a href="#" className="hover:text-gold transition-colors duration-150">Store Locator</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-300 mb-4">Company</h4>
          <ul className="space-y-2.5 text-xs text-gray-400 font-light">
            <li><a href="#" className="hover:text-gold transition-colors duration-150">Our Story</a></li>
            <li><a href="#" className="hover:text-gold transition-colors duration-150">Craftsmanship</a></li>
            <li><a href="#" className="hover:text-gold transition-colors duration-150">Sustainability</a></li>
            <li><a href="#" className="hover:text-gold transition-colors duration-150">Press & Media</a></li>
            <li><a href="#" className="hover:text-gold transition-colors duration-150">Careers</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright & Payment */}
      <div className="bg-[#050505] border-t border-luxury-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-gray-500 font-light">
          <span>&copy; {new Date().getFullYear()} MARS Collection. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>PayPal</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
