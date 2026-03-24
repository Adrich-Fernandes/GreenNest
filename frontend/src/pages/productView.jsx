import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck, BookOpen, Leaf } from "lucide-react";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";

const API_BASE = "http://localhost:5000/api/product";

export default function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Fetch all and find by _id (no single-product route exists per your routes file)
        const res = await fetch(`${API_BASE}/allProducts`);
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((p) => p._id === id);
          setProduct(found || null);
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
        <div className="min-h-screen bg-[#f7f9f6] flex items-center justify-center text-gray-400 text-sm">
          Loading product...
        </div>
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

            {/* LEFT — Image */}
            <div className="w-full md:w-1/2 rounded-3xl overflow-hidden bg-[#f0f4ee] aspect-square">
              <img
                src={product.image || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
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
              <p className="text-4xl font-black text-[#3d6b45]">₹{product.price}</p>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 border border-[#c8d9c0] rounded-xl px-4 py-2.5 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-gray-500 hover:text-[#3d6b45] font-bold text-lg w-5 h-5 flex items-center justify-center transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-gray-900 w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-gray-500 hover:text-[#3d6b45] font-bold text-lg w-5 h-5 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-[1.02] active:scale-95 ${
                    product.inStock
                      ? "bg-[#3d6b45] hover:bg-[#345c3c] text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
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