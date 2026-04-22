import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck, BookOpen, Leaf } from "lucide-react";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";
import { ProductViewSkeleton } from "../components/Skeleton";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = "http://localhost:8000/api/products"; // ✅ fixed port + plural

export default function ProductView() {
  const { getToken, isSignedIn } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      alert("Please login to add items to cart! 🌿");
      return;
    }

    setAdding(true);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id, quantity })
      });
      const data = await res.json();
      if (data.success) {
        alert("Added to cart! 🌿");
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Cart error:", err);
      alert("Could not connect to server");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/product/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <UserNavBar />
        <div className="min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-10">
          <div className="max-w-7xl mx-auto">
            <ProductViewSkeleton />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <UserNavBar />
        <div className="min-h-screen bg-[#f7f9f6] flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-lg">Product not found.</p>
          <Link to="/products" className="text-[#3d6b45] font-semibold hover:underline">
            Back to Products
          </Link>
        </div>
      </>
    );
  }

  // ✅ images fallback
  const images = product.images && product.images.length > 0 ? product.images : [product.image || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"];

  return (
    <>
      <UserNavBar />
      <section className="w-full min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* Back Link */}
          <Link
            to="/products"
            className="flex items-center gap-2 text-gray-400 hover:text-[#3d6b45] text-sm font-medium transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-10 items-start">

            {/* LEFT — Images */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="rounded-3xl overflow-hidden bg-[#f0f4ee] aspect-square shadow-sm">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* ✅ Thumbnails if multiple images */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === idx ? "border-[#3d6b45]" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Details */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#3d6b45] bg-[#f0f4ee] border border-[#c8d9c0] px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  product.inStock
                    ? "text-[#3d6b45] bg-[#f0f4ee] border-[#c8d9c0]"
                    : "text-red-500 bg-red-50 border-red-200"
                }`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Name + Nursery */}
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-400">by {product.nursery || "GreenNest"}</p>
              </div>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between">
                <p className="text-4xl font-black text-[#3d6b45]">₹{product.price}</p>
                {product.stock <= 10 && product.stock > 0 && (
                  <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 animate-pulse">
                    Only {product.stock} left in stock!
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-3 border border-[#c8d9c0] rounded-xl px-4 py-2.5 bg-white ${product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={product.stock <= 0}
                    className="text-gray-500 hover:text-[#3d6b45] font-bold text-lg w-5 h-5 flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-gray-900 w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={product.stock <= 0}
                    className="text-gray-500 hover:text-[#3d6b45] font-bold text-lg w-5 h-5 flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || adding}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-[1.02] active:scale-95 ${
                    product.stock > 0 && !adding
                      ? "bg-[#3d6b45] hover:bg-[#345c3c] text-white shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className={`w-4 h-4 ${adding ? "animate-bounce" : ""}`} />
                  {product.stock <= 0 ? "Sold Out" : adding ? "Adding..." : "Add to Cart"}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 flex-wrap pt-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Truck className="w-4 h-4 text-[#3d6b45]" />
                  Free Delivery
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#3d6b45]" />
                  Quality Assured
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <BookOpen className="w-4 h-4 text-[#3d6b45]" />
                  Care Guide
                </div>
              </div>

              {/* Care Instructions */}
              {product.careInstructions && (
                <div className="bg-[#f0f4ee] border border-[#c8d9c0] rounded-2xl px-5 py-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#3d6b45]" />
                    <h3 className="text-sm font-bold text-[#3d6b45]">Care Instructions</h3>
                  </div>
                  <p className="text-sm text-[#4a7c52] leading-relaxed">{product.careInstructions}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}