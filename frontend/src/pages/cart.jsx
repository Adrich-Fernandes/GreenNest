import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, Minus, ShoppingBag, Leaf, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";

import { useAuth } from "@clerk/clerk-react";

const API_BASE = "http://localhost:8000/api/cart";

export default function Cart() {
  const { getToken } = useAuth();
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [mounted, setMounted]       = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError]           = useState("");

  // ── Fetch cart from backend ────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const res  = await fetch(API_BASE, { 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        } 
      });
      const data = await res.json();
      if (data.success) setItems(data.data ?? []);
      else setError(data.message || "Failed to load cart");
    } catch {
      setError("Could not reach server. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMounted(true), 50);
    }
  }, [getToken]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // ── Update quantity (optimistic) ───────────────────────────────────────────
  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(productId);
    const oldItems = [...items];
    setItems((prev) =>
      prev.map((i) => (productOf(i)._id === productId ? { ...i, qty: newQty, quantity: newQty } : i))
    );
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ qty: newQty }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
    } catch {
      setItems(oldItems); // rollback
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Remove item ────────────────────────────────────────────────────────────
  const removeItem = async (productId) => {
    setRemovingId(productId);
    const oldItems = [...items];
    await new Promise((r) => setTimeout(r, 280)); // let animation play
    setItems((prev) => prev.filter((i) => productOf(i)._id !== productId));
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = await res.json();
      if (!data.success) throw new Error();
    } catch {
      setItems(oldItems);
    } finally {
      setRemovingId(null);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  // Backend returns { product: {...}, quantity: 1 }
  const productOf  = (item) => item.product ?? item;
  const getQty     = (item) => item.quantity ?? item.qty ?? 1;
  const subtotal   = items.reduce((s, i) => s + (productOf(i).price ?? 0) * getQty(i), 0);
  const delivery   = subtotal === 0 ? 0 : subtotal >= 599 ? 0 : 49;
  const total      = subtotal + delivery;
  const totalUnits = items.reduce((s, i) => s + getQty(i), 0);

  return (
    <>
      <UserNavBar />

      <section className="w-full min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className={`mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Your Cart</h1>
            <p className="text-gray-400 text-sm mt-1">
              {loading
                ? "Loading…"
                : items.length === 0
                ? "Your cart is empty"
                : `${totalUnits} item${totalUnits !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-[#e8ede6] p-4 flex gap-4 animate-pulse">
                  <div className="w-20 h-20 rounded-xl bg-[#f0f4ee] shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <div className="h-3 bg-[#f0f4ee] rounded-full w-2/5" />
                    <div className="h-2.5 bg-[#f0f4ee] rounded-full w-1/4" />
                    <div className="h-2.5 bg-[#f0f4ee] rounded-full w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>

          ) : items.length === 0 ? (
            /* Empty state */
            <div className={`flex flex-col items-center justify-center py-28 gap-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="relative">
                <div className="w-36 h-36 rounded-full bg-[#f0f4ee] flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-[#3d6b45] opacity-20" />
                </div>
                <span className="absolute -top-2 -right-2 text-3xl" style={{ animation: "floatA 3s ease-in-out infinite" }}>🌿</span>
                <span className="absolute -bottom-1 -left-3 text-2xl opacity-70" style={{ animation: "floatB 4s ease-in-out infinite" }}>🍃</span>
                <span className="absolute top-4 -left-4 text-xl opacity-50" style={{ animation: "floatA 5s ease-in-out infinite 0.5s" }}>🌱</span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">Nothing planted yet</p>
                <p className="text-gray-400 text-sm mt-1.5 max-w-xs">
                  Your cart is waiting for some greenery. Browse our collection and bring nature home.
                </p>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white font-semibold px-7 py-3 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <Leaf className="w-4 h-4" />
                Explore Plants
              </Link>

              <style>{`
                @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(8deg)} }
                @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(-6deg)} }
              `}</style>
            </div>

          ) : (
            /* Main layout */
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* Item list */}
              <div className="flex-1 flex flex-col gap-3">

                {/* Free delivery progress */}
                {subtotal < 599 ? (
                  <div className="bg-white rounded-2xl border border-[#e8ede6] px-5 py-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>
                        Add <span className="font-bold text-[#3d6b45]">₹{599 - subtotal}</span> more for free delivery
                      </span>
                      <span className="text-gray-300">₹599</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#f0f4ee] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3d6b45] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 599) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#f0f4ee] border border-[#c8d9c0] rounded-2xl px-5 py-3 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#3d6b45]" />
                    <p className="text-xs font-semibold text-[#3d6b45]">You've unlocked free delivery! 🎉</p>
                  </div>
                )}

                {/* Cards */}
                {items.map((item, i) => {
                  const p          = productOf(item);
                  const pid        = p._id;
                  const isRemoving = removingId === pid;
                  const isUpdating = updatingId === pid;

                  return (
                    <div
                      key={pid}
                      className={`bg-white rounded-2xl border border-[#e8ede6] overflow-hidden transition-all duration-300 ${
                        isRemoving
                          ? "opacity-0 scale-95 -translate-x-4"
                          : mounted
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                      style={{ transitionDelay: isRemoving ? "0ms" : `${i * 50}ms` }}
                    >
                      <div className="flex items-center gap-4 p-4">

                        {/* Thumbnail */}
                        <Link to={`/plants/${pid}`} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#f0f4ee] block">
                          <img
                            src={p.images?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80"}
                            alt={p.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link to={`/plants/${pid}`}>
                                <h3 className="font-bold text-gray-900 text-sm leading-snug hover:text-[#3d6b45] transition-colors truncate">
                                  {p.name}
                                </h3>
                              </Link>
                              <p className="text-xs text-gray-400 mt-0.5">{p.nursery || "GreenNest"}</p>
                              <span className="inline-block mt-1.5 text-[10px] font-semibold text-[#3d6b45] bg-[#f0f4ee] px-2 py-0.5 rounded-full">
                                {p.category}
                              </span>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeItem(pid)}
                              disabled={isRemoving}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors shrink-0 disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Qty stepper */}
                            <div className={`flex items-center gap-1 bg-[#f7f9f6] border border-[#e8ede6] rounded-xl px-1 py-1 transition-opacity ${isUpdating ? "opacity-60" : "opacity-100"}`}>
                              <button
                                onClick={() => updateQty(pid, item.qty - 1)}
                                disabled={item.qty <= 1 || isUpdating}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#3d6b45] disabled:opacity-30 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <span className="w-7 text-center text-sm font-bold text-gray-800 flex items-center justify-center">
                                {isUpdating
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3d6b45]" />
                                  : item.qty}
                              </span>

                              <button
                                onClick={() => updateQty(pid, item.qty + 1)}
                                disabled={item.qty >= (p.stock ?? 99) || isUpdating}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#3d6b45] disabled:opacity-30 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Line price */}
                            <div className="text-right">
                              <p className="font-bold text-gray-900 text-base">
                                ₹{(p.price * item.qty).toLocaleString("en-IN")}
                              </p>
                              {item.qty > 1 && (
                                <p className="text-xs text-gray-400">₹{p.price.toLocaleString("en-IN")} each</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order summary */}
              <div
                className={`w-full lg:w-80 shrink-0 flex flex-col gap-3 lg:sticky lg:top-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "220ms" }}
              >
                <div className="bg-white rounded-2xl border border-[#e8ede6] p-5 flex flex-col gap-4">
                  <h2 className="font-bold text-gray-900 text-base">Order Summary</h2>

                  <div className="flex flex-col gap-2.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal ({totalUnits} item{totalUnits !== 1 ? "s" : ""})</span>
                      <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery</span>
                      {delivery === 0
                        ? <span className="text-[#3d6b45] font-semibold">Free</span>
                        : <span className="font-semibold text-gray-800">₹{delivery}</span>
                      }
                    </div>
                    <div className="border-t border-[#f0f4ee] pt-3 flex justify-between font-bold text-gray-900 text-base">
                      <span>Total</span>
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Checkout — placeholder */}
                  <button
                    onClick={() => alert("Checkout coming soon! 🌿")}
                    className="w-full bg-[#3d6b45] hover:bg-[#345c3c] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    to="/products"
                    className="text-center text-xs text-[#3d6b45] hover:underline font-medium"
                  >
                    ← Continue Shopping
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="bg-white rounded-2xl border border-[#e8ede6] px-5 py-4 flex flex-col gap-2.5">
                  {[
                    { icon: "🌿", label: "100% natural & healthy plants" },
                    { icon: "📦", label: "Safe, eco-friendly packaging"  },
                    { icon: "↩️", label: "Easy 7-day returns"            },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-xs text-gray-400">
                      <span className="text-base">{icon}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}