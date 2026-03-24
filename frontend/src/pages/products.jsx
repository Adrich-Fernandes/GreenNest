import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, Star, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";

import { useAuth } from "@clerk/clerk-react";

const API_BASE = "http://localhost:8000/api/products"; 
const categories = ["All Types", "Indoor", "Outdoor", "Flowering", "Seeds", "Pots & Planters", "Tools"];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Top Rated"];

function useInView(threshold = 0.1) {
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

export default function Products() {
  const { getToken, isSignedIn } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Types");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cardsRef, cardsInView] = useInView(0.05);

  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      alert("Please login to add items to cart! 🌿");
      return;
    }

    setAddingId(productId);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      const data = await res.json();
      if (data.success) {
        // Optional: show a toast or success state
        alert("Added to cart! 🌿");
      }
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAddingId(null);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/allProducts`);
        const data = await res.json();
        if (data.success) setAllProducts(data.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = allProducts
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.nursery || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All Types" || p.category === selectedCategory;
      return matchesSearch && matchesCategory && p.status !== "Out of Stock";
    })
    .sort((a, b) => {
      if (selectedSort === "Price: Low to High") return a.price - b.price;
      if (selectedSort === "Price: High to Low") return b.price - a.price;
      if (selectedSort === "Top Rated") return b.rating - a.rating;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <>
      <UserNavBar />
      <section className="w-full min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          <div className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Plants & Products</h1>
            <p className="text-gray-400 text-sm mt-1">Browse our curated collection of plants and gardening essentials</p>
          </div>

          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all duration-700 relative z-30 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="flex items-center gap-3 bg-white border border-[#c8d9c0] rounded-xl px-4 py-3 flex-1 shadow-sm focus-within:border-[#3d6b45] focus-within:ring-2 focus-within:ring-[#f0f4ee] transition-all duration-200">
              <Search className="w-4 h-4 text-[#3d6b45] shrink-0" />
              <input
                type="text"
                placeholder="Search plants, tools, seeds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>

            <div className="relative z-30">
              <button
                onClick={() => { setCategoryOpen(!categoryOpen); setSortOpen(false); }}
                className="flex items-center gap-2 bg-white border border-[#c8d9c0] rounded-xl px-4 py-3 text-sm text-gray-700 font-medium shadow-sm hover:border-[#3d6b45] transition-colors w-full sm:w-44 justify-between"
              >
                {selectedCategory}
                <ChevronDown className={`w-4 h-4 text-[#3d6b45] transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-[#c8d9c0] rounded-xl shadow-lg z-50 w-44 py-1 overflow-hidden">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setCategoryOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f4ee] hover:text-[#3d6b45] flex items-center justify-between transition-colors"
                    >
                      {cat}
                      {selectedCategory === cat && (
                        <svg className="w-4 h-4 text-[#3d6b45]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative z-30">
              <button
                onClick={() => { setSortOpen(!sortOpen); setCategoryOpen(false); }}
                className="flex items-center gap-2 bg-white border border-[#c8d9c0] rounded-xl px-4 py-3 text-sm text-gray-700 font-medium shadow-sm hover:border-[#3d6b45] transition-colors w-full sm:w-48 justify-between"
              >
                {selectedSort}
                <ChevronDown className={`w-4 h-4 text-[#3d6b45] transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-[#c8d9c0] rounded-xl shadow-lg z-50 w-48 py-1 overflow-hidden">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSelectedSort(opt); setSortOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f4ee] hover:text-[#3d6b45] flex items-center justify-between transition-colors"
                    >
                      {opt}
                      {selectedSort === opt && (
                        <svg className="w-4 h-4 text-[#3d6b45]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400 text-sm">Loading products...</div>
          ) : filtered.length > 0 ? (
            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 relative z-0">
              {filtered.map((product, i) => (
                <Link
                  to={`/plants/${product._id}`}
                  key={product._id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group opacity-100 translate-y-0`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex flex-row sm:flex-col">
                    <div className="relative w-36 h-36 shrink-0 sm:w-full sm:h-52 bg-[#f0f4ee] overflow-hidden sm:rounded-none rounded-l-2xl">
                      {/* ✅ Use first image from array, fallback to placeholder */}
                      <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* ✅ Show image count badge if more than 1 image */}
                      {product.images?.length > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                          +{product.images.length - 1}
                        </span>
                      )}
                      <span className="absolute top-2 left-2 bg-[#f0f4ee] text-[#3d6b45] text-xs font-semibold px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between flex-1 px-4 py-4 sm:pt-4 sm:pb-5">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{product.name}</h3>
                        <p className="text-xs text-gray-400">{product.nursery || "GreenNest"}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-medium text-gray-600">{product.rating || "New"}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <span className="text-base sm:text-lg font-bold text-gray-900">₹{product.price}</span>
                        <button
                          onClick={(e) => handleAddToCart(e, product._id)}
                          disabled={addingId === product._id}
                          className="flex items-center gap-1 sm:gap-1.5 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                          <ShoppingCart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${addingId === product._id ? "animate-bounce" : ""}`} />
                          {addingId === product._id ? "Adding..." : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-gray-400 text-lg font-medium">No products found</p>
              <p className="text-gray-300 text-sm">Try adjusting your search or filters</p>
            </div>
          )}

        </div>
      </section>
      <Footer />
    </>
  );
}