import { Leaf, Bell, ArrowRight, Flower2, Sprout, Droplets, ShoppingBag, Shovel, ShoppingCart, Star, Home, Trees, Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import UserNavBar from "../components/userNavBar";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function HeroSection() {
  const [heroRef, heroInView] = useInView(0.1);

  return (
    <>
      <UserNavBar />

      {/* HERO */}
      <section ref={heroRef} className="min-h-screen bg-white flex items-center px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-10 items-center">

          {/* LEFT */}
          <div className="flex flex-col gap-6 items-center text-center md:items-start md:text-left w-full md:w-1/2">

            <div
              className={`inline-flex items-center gap-2 bg-[#f0f4ee] border border-[#c8d9c0] text-[#3d6b45] text-sm font-medium px-4 py-1.5 rounded-full w-fit shadow-sm transition-all duration-700 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "100ms" }}
            >
              <Leaf className="w-4 h-4" />
              Your Digital Garden Starts Here
            </div>

            <div
              className={`transition-all duration-700 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "200ms" }}
            >
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">Bring Nature</h1>
              <h1 className="text-5xl md:text-6xl font-black text-[#3d6b45] leading-tight tracking-tight">Closer to Home</h1>
            </div>

            <p
              className={`text-gray-500 text-base md:text-lg leading-relaxed max-w-md transition-all duration-700 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "300ms" }}
            >
              Discover premium plants, gardening supplies, and book verified gardeners — all in one place. Transform your space with GreenNest.
            </p>

            <div
              className={`flex items-center justify-center md:justify-start gap-3 flex-wrap transition-all duration-700 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "400ms" }}
            >
              <Link to="/products" className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95">
                Browse Plants <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/gardeners" className="border border-[#3d6b45] hover:bg-[#f0f4ee] text-[#3d6b45] font-semibold px-6 py-3 rounded-xl bg-white transition-all duration-150 hover:scale-105 active:scale-95">
                Find a Gardener
              </Link>
            </div>

            <div
              className={`flex items-center justify-center md:justify-start gap-6 mt-2 transition-all duration-700 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Leaf className="w-4 h-4 text-[#3d6b45]" />
                <span>500+ Plants</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Bell className="w-4 h-4 text-[#3d6b45]" />
                <span>50+ Nurseries</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className={`hidden md:flex relative w-full md:w-1/2 justify-center items-center transition-all duration-1000 ${heroInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle, rgba(61,107,69,0.2) 0%, rgba(61,107,69,0.08) 45%, transparent 72%)",
                borderRadius: "50%",
                filter: "blur(20px)",
                transform: "scale(1.05)",
              }}
            />
            <div className="w-full h-[480px] rounded-3xl overflow-hidden shadow-xl relative z-10">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"
                alt="Gardening tools with soil"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div
              className={`absolute -bottom-5 -left-6 bg-white rounded-2xl shadow-lg px-5 py-3.5 flex items-center gap-3 z-20 transition-all duration-700 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "700ms" }}
            >
              <div className="w-10 h-10 bg-[#3d6b45] rounded-xl flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">Verified Gardeners</p>
                <p className="text-gray-400 text-xs">100+ professionals</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <ShopByCategory />
      <FreshArrivals />
      <GardeningServices />

      {/* FOOTER */}
      <footer className="w-full bg-[#1e3a22] px-6 md:px-16 pt-14 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10">
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2 w-fit">
                <div className="w-9 h-9 bg-[#3d6b45] rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-white font-semibold text-lg tracking-tight">GreenNest</span>
              </Link>
              <p className="text-[#a8c4a0] text-sm leading-relaxed max-w-xs">
                Your one-stop destination for quality plants, gardening products, and professional gardening services. Bringing nature closer to your home.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-bold text-base">Quick Links</h3>
              <ul className="flex flex-col gap-3">
                <li><Link to="/plants" className="text-[#a8c4a0] text-sm hover:text-white transition-colors duration-150">Browse Plants</Link></li>
                <li><Link to="/gardeners" className="text-[#a8c4a0] text-sm hover:text-white transition-colors duration-150">Find Gardeners</Link></li>
                <li><Link to="/orders" className="text-[#a8c4a0] text-sm hover:text-white transition-colors duration-150">My Orders</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-bold text-base">Support</h3>
              <ul className="flex flex-col gap-3">
                <li><Link to="mailto:help@greennest.com" className="text-[#a8c4a0] text-sm hover:text-white transition-colors duration-150">help@greennest.com</Link></li>
                <li><Link to="tel:+15551234567" className="text-[#a8c4a0] text-sm hover:text-white transition-colors duration-150">+1 (555) 123-4567</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#2e5235]" />
          <div className="pt-6 text-center">
            <p className="text-[#7aa882] text-sm">© 2026 GreenNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

const categories = [
  { label: "Indoor Plants", icon: ShoppingBag, bg: "bg-[#f0f4ee]", iconColor: "text-[#3d6b45]" },
  { label: "Outdoor Plants", icon: Leaf, bg: "bg-[#f0f4ee]", iconColor: "text-[#4a7c52]" },
  { label: "Flowering", icon: Flower2, bg: "bg-pink-50", iconColor: "text-pink-500" },
  { label: "Seeds", icon: Sprout, bg: "bg-amber-50", iconColor: "text-amber-600" },
  { label: "Pots & Planters", icon: Droplets, bg: "bg-sky-50", iconColor: "text-sky-600" },
  { label: "Gardening Tools", icon: Shovel, bg: "bg-orange-50", iconColor: "text-orange-500" },
];

function ShopByCategory() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} className="w-full py-16 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col items-center gap-2 mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight text-center">Shop by Category</h2>
          <p className="text-sm md:text-base text-gray-400 text-center">Find exactly what your garden needs</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                to="/products"
                key={cat.label}
                className={`group flex flex-col items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#c8d9c0] transition-all duration-300 ease-in-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-14 h-14 ${cat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-7 h-7 ${cat.iconColor}`} strokeWidth={1.75} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center leading-tight">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const products = [
  { id: 1, name: "Gardening Tool Kit", nursery: "Green Valley Nursery", rating: 4.1, price: 599, category: "Tools", categoryColor: "bg-[#f0f4ee] text-[#3d6b45]", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 2, name: "Bougainvillea", nursery: "Herb Haven", rating: 4.5, price: 275, category: "Flowering", categoryColor: "bg-[#f0f4ee] text-[#3d6b45]", image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&q=80" },
  { id: 3, name: "Aloe Vera", nursery: "Nature's Nest", rating: 4.7, price: 179, category: "Indoor", categoryColor: "bg-[#f0f4ee] text-[#3d6b45]", image: "https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=400&q=80" },
  { id: 4, name: "Jasmine Plant", nursery: "Bloom Garden", rating: 4.6, price: 320, category: "Flowering", categoryColor: "bg-[#f0f4ee] text-[#3d6b45]", image: "https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=400&q=80" },
];

function FreshArrivals() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} className="w-full py-16 px-6 md:px-16 bg-[#f7f9f6]">
      <div className="max-w-7xl mx-auto">
        <div className={`flex items-start justify-between mb-8 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Fresh Arrivals</h2>
            <p className="text-sm text-gray-400 mt-1">Handpicked plants just for you</p>
          </div>
          <Link to="/plants" className="flex items-center gap-1 text-[#3d6b45] hover:text-[#345c3c] text-sm font-semibold transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <Link
              to={`/plants/${product.id}`}
              key={product.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative w-full h-52 bg-[#f0f4ee] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 ${product.categoryColor} text-xs font-semibold px-3 py-1 rounded-full`}>
                  {product.category}
                </span>
              </div>
              <div className="px-4 pt-4 pb-5 flex flex-col gap-2">
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">{product.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{product.nursery}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-medium text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-1.5 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const services = [
  { id: 1, icon: Home, title: "Home Gardening", description: "Professional setup and maintenance for your home garden" },
  { id: 2, icon: Trees, title: "Lawn Maintenance", description: "Keep your lawn lush, green and perfectly maintained" },
  { id: 3, icon: Scissors, title: "Plant Care & Pruning", description: "Expert care, trimming and health check for your plants" },
];

function GardeningServices() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} className="w-full py-20 px-6 md:px-16 bg-[#1e3a22]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className={`text-center flex flex-col gap-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Professional Gardening Services</h2>
          <p className="text-[#a8c4a0] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Book verified gardeners for all your home gardening and maintenance needs
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Link
                to="/gardeners"
                key={service.id}
                className={`bg-[#2a4d2e]/60 border border-[#3d6b45]/40 rounded-2xl px-7 py-8 flex flex-col gap-5 hover:bg-[#2a4d2e]/80 hover:border-[#4a7c52]/60 hover:-translate-y-1 transition-all duration-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="w-12 h-12 bg-[#3d6b45] rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-bold text-lg leading-tight">{service.title}</h3>
                  <p className="text-[#a8c4a0] text-sm leading-relaxed">{service.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <Link
          to="/gardeners"
          className={`flex items-center gap-2 bg-white hover:bg-[#f0f4ee] text-[#1e3a22] font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-md hover:scale-105 active:scale-95 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "400ms" }}
        >
          Browse Gardeners <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}