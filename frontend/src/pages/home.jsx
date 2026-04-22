import { Leaf, Bell, ArrowRight, Flower2, Sprout, Droplets, ShoppingBag, Shovel, ShoppingCart, Star, Home, Trees, Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";
import { ProductSkeleton } from "../components/Skeleton";

const API_BASE = "http://localhost:8000/api/products";

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

      <Footer />
    </>
  );
}

// ── Shop By Category ──────────────────────────────────────────────────────────

const categories = [
  { label: "Indoor Plants",    icon: ShoppingBag, bg: "bg-[#f0f4ee]",  iconColor: "text-[#3d6b45]"   },
  { label: "Outdoor Plants",   icon: Leaf,        bg: "bg-[#f0f4ee]",  iconColor: "text-[#4a7c52]"   },
  { label: "Flowering",        icon: Flower2,     bg: "bg-pink-50",    iconColor: "text-pink-500"     },
  { label: "Seeds",            icon: Sprout,      bg: "bg-amber-50",   iconColor: "text-amber-600"   },
  { label: "Pots & Planters",  icon: Droplets,    bg: "bg-sky-50",     iconColor: "text-sky-600"     },
  { label: "Gardening Tools",  icon: Shovel,      bg: "bg-orange-50",  iconColor: "text-orange-500"  },
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

// ── Fresh Arrivals (live from backend) ────────────────────────────────────────

function FreshArrivals() {
  const [ref, inView]           = useInView();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchFresh = async () => {
      try {
        const res  = await fetch(`${API_BASE}/allProducts`);
        const data = await res.json();
        if (data.success) {
          const fresh = data.data
            .filter((p) => p.status !== "Out of Stock")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
          setProducts(fresh);
        }
      } catch (err) {
        console.error("Failed to fetch fresh arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFresh();
  }, []);

  return (
    <section ref={ref} className="w-full py-16 px-6 md:px-16 bg-[#f7f9f6]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className={`flex items-start justify-between mb-8 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Fresh Arrivals</h2>
            <p className="text-sm text-gray-400 mt-1">Handpicked plants just for you</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-[#3d6b45] hover:text-[#345c3c] text-sm font-semibold transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => <ProductSkeleton key={n} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-400 text-sm">No products available right now.</p>
          </div>

        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <Link
                to={`/plants/${product._id}`}
                key={product._id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative w-full h-52 bg-[#f0f4ee] overflow-hidden">
                  <img
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#f0f4ee] text-[#3d6b45] text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-[#3d6b45] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    New
                  </span>
                </div>
                <div className="px-4 pt-4 pb-5 flex flex-col gap-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{product.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{product.nursery || "GreenNest"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-medium text-gray-600">{product.rating || "New"}</span>
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
        )}
      </div>
    </section>
  );
}

// ── Gardening Services ────────────────────────────────────────────────────────

const services = [
  { id: 1, icon: Home,     title: "Home Gardening",       description: "Professional setup and maintenance for your home garden"    },
  { id: 2, icon: Trees,    title: "Lawn Maintenance",      description: "Keep your lawn lush, green and perfectly maintained"        },
  { id: 3, icon: Scissors, title: "Plant Care & Pruning",  description: "Expert care, trimming and health check for your plants"     },
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