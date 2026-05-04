import { useState, useEffect, useCallback } from "react";
import {
  Trash2, Plus, Minus, ShoppingBag, Leaf, ArrowRight,
  Loader2, MapPin, ChevronDown, ChevronUp, Check, X,
  Banknote, CreditCard
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";
import { CartItemSkeleton } from "../components/Skeleton";
import { useAuth } from "@clerk/clerk-react";

const API_BASE      = `${import.meta.env.VITE_API_BASE_URL}/api/cart`;
const USER_API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/user`;
const ORDER_API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
];

const EMPTY_FORM = {
  fullname: "", addressline1: "", addressline2: "",
  city: "", state: "", pincode: "", phone: "", isDefault: false
};

// ── Small reusable helpers ─────────────────────────────────────────────────────
function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

function inputCls(error = "") {
  return `w-full text-xs px-3 py-2 rounded-lg border ${
    error ? "border-red-300 focus:ring-red-200" : "border-[#e8ede6] focus:ring-[#c8d9c0]"
  } focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300`;
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Cart() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // Cart state
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError]           = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Address state
  const [addressOpen, setAddressOpen]       = useState(false);
  const [addresses, setAddresses]           = useState([]);
  const [addrLoading, setAddrLoading]       = useState(false);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [showForm, setShowForm]             = useState(false);
  const [formData, setFormData]             = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]         = useState({});
  const [formSaving, setFormSaving]         = useState(false);
  const [deletingId, setDeletingId]         = useState(null);

  // ── Fetch cart ───────────────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = await getToken();
      const res   = await fetch(API_BASE, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      const data  = await res.json();
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

  // ── Fetch addresses ──────────────────────────────────────────────────────────
  const fetchAddresses = useCallback(async () => {
    setAddrLoading(true);
    try {
      const token = await getToken();
      const res   = await fetch(`${USER_API_BASE}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data  = await res.json();
      if (data.success) {
        const list = data.data ?? [];
        setAddresses(list);
        // auto-select default if nothing selected yet
        if (!selectedAddrId) {
          const def = list.find((a) => a.isDefault);
          if (def) setSelectedAddrId(def._id);
        }
      }
    } catch { /* silent */ }
    finally  { setAddrLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  useEffect(() => { if (addressOpen) fetchAddresses(); }, [addressOpen, fetchAddresses]);

  // ── Cart helpers ─────────────────────────────────────────────────────────────
  const productOf  = (item) => item.product ?? item;
  const getQty     = (item) => item.quantity ?? item.qty ?? 1;
  const subtotal   = items.reduce((s, i) => s + (productOf(i).price ?? 0) * getQty(i), 0);
  const delivery   = subtotal === 0 ? 0 : subtotal >= 599 ? 0 : 49;
  const total      = subtotal + delivery;
  const totalUnits = items.reduce((s, i) => s + getQty(i), 0);
  const selectedAddress = addresses.find((a) => a._id === selectedAddrId);

  // ── Update qty ───────────────────────────────────────────────────────────────
  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(productId);
    const oldItems = [...items];
    setItems((prev) =>
      prev.map((i) => productOf(i)._id === productId ? { ...i, quantity: newQty } : i)
    );
    try {
      const token = await getToken();
      const res   = await fetch(`${API_BASE}/update/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ qty: newQty }),
      });
      const data  = await res.json();
      if (!data.success) throw new Error();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { setItems(oldItems); }
    finally  { setUpdatingId(null); }
  };

  // ── Remove item ──────────────────────────────────────────────────────────────
  const removeItem = async (productId) => {
    setRemovingId(productId);
    const oldItems = [...items];
    await new Promise((r) => setTimeout(r, 280));
    setItems((prev) => prev.filter((i) => productOf(i)._id !== productId));
    try {
      const token = await getToken();
      const res   = await fetch(`${API_BASE}/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (!data.success) throw new Error();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { setItems(oldItems); }
    finally  { setRemovingId(null); }
  };

  // ── Address form validation ───────────────────────────────────────────────────
  const validateForm = () => {
    const errs = {};
    if (!formData.fullname.trim())          errs.fullname     = "Full name is required";
    if (!formData.addressline1.trim())      errs.addressline1 = "Address is required";
    if (!formData.city.trim())              errs.city         = "City is required";
    if (!formData.state)                    errs.state        = "State is required";
    if (!/^\d{6}$/.test(formData.pincode)) errs.pincode      = "Enter a valid 6-digit pincode";
    if (!/^\d{10}$/.test(formData.phone))  errs.phone        = "Enter a valid 10-digit phone number";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save address ─────────────────────────────────────────────────────────────
  const saveAddress = async () => {
    if (!validateForm()) return;
    setFormSaving(true);
    try {
      const token = await getToken();
      const res   = await fetch(`${USER_API_BASE}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data  = await res.json();
      if (data.success) {
        await fetchAddresses();
        setShowForm(false);
        setFormData(EMPTY_FORM);
        setFormErrors({});
        if (data.data?._id) setSelectedAddrId(data.data._id);
      }
    } catch { /* silent */ }
    finally  { setFormSaving(false); }
  };

  // ── Delete address ────────────────────────────────────────────────────────────
  const deleteAddress = async (id) => {
    setDeletingId(id);
    try {
      const token = await getToken();
      const res   = await fetch(`${USER_API_BASE}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data.success) {
        setAddresses((prev) => prev.filter((a) => a._id !== id));
        if (selectedAddrId === id) setSelectedAddrId(null);
      }
    } catch { /* silent */ }
    finally  { setDeletingId(null); }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Place order ──────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!selectedAddress) { setAddressOpen(true); return; }
    if (!paymentMethod) { alert("Please select a payment method (Cash or Online)"); return; }
    setPlacingOrder(true);
    try {
      const token = await getToken();
      const res = await fetch(`${ORDER_API_BASE}/place`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          address: selectedAddress,
          paymentMethod 
        })
      });
      const data = await res.json();
      if (data.success) {
        navigate("/orders");
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (e) {
      alert("Something went wrong. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <UserNavBar />

      <section className="w-full min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className={`mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Your Cart</h1>
            <p className="text-gray-400 text-sm mt-1">
              {loading ? "Loading…" : items.length === 0 ? "Your cart is empty" : `${totalUnits} item${totalUnits !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3">{error}</div>
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
              <Link to="/products" className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white font-semibold px-7 py-3 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95">
                <Leaf className="w-4 h-4" /> Explore Plants
              </Link>
              <style>{`
                @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(8deg)} }
                @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(-6deg)} }
              `}</style>
            </div>

          ) : (
            /* Main layout */
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* ── Item list ── */}
              <div className="flex-1 flex flex-col gap-3">

                {/* Free delivery progress */}
                {subtotal < 599 ? (
                  <div className="bg-white rounded-2xl border border-[#e8ede6] px-5 py-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Add <span className="font-bold text-[#3d6b45]">₹{599 - subtotal}</span> more for free delivery</span>
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

                {/* Item cards */}
                {items.map((item, i) => {
                  const p          = productOf(item);
                  const pid        = p._id;
                  const qty        = getQty(item);
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
                        <Link to={`/plants/${pid}`} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#f0f4ee] block">
                          <img
                            src={p.images?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80"}
                            alt={p.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link to={`/plants/${pid}`}>
                                <h3 className="font-bold text-gray-900 text-sm leading-snug hover:text-[#3d6b45] transition-colors truncate">{p.name}</h3>
                              </Link>
                              <p className="text-xs text-gray-400 mt-0.5">{p.nursery || "GreenNest"}</p>
                              <span className="inline-block mt-1.5 text-[10px] font-semibold text-[#3d6b45] bg-[#f0f4ee] px-2 py-0.5 rounded-full">{p.category}</span>
                            </div>
                            <button
                              onClick={() => removeItem(pid)}
                              disabled={isRemoving}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors shrink-0 disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className={`flex items-center gap-1 bg-[#f7f9f6] border border-[#e8ede6] rounded-xl px-1 py-1 transition-opacity ${isUpdating ? "opacity-60" : "opacity-100"}`}>
                              <button
                                onClick={() => updateQty(pid, qty - 1)}
                                disabled={qty <= 1 || isUpdating}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#3d6b45] disabled:opacity-30 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-bold text-gray-800 flex items-center justify-center">
                                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3d6b45]" /> : qty}
                              </span>
                              <button
                                onClick={() => updateQty(pid, qty + 1)}
                                disabled={qty >= (p.stock ?? 99) || isUpdating}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#3d6b45] disabled:opacity-30 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 text-base">₹{(p.price * qty).toLocaleString("en-IN")}</p>
                              {qty > 1 && <p className="text-xs text-gray-400">₹{p.price.toLocaleString("en-IN")} each</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Right column: Summary + Address ── */}
              <div
                className={`w-full lg:w-80 shrink-0 flex flex-col gap-3 lg:sticky lg:top-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "220ms" }}
              >
                {/* Order summary card */}
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
                        : <span className="font-semibold text-gray-800">₹{delivery}</span>}
                    </div>
                    <div className="border-t border-[#f0f4ee] pt-3 flex justify-between font-bold text-gray-900 text-base">
                      <span>Total</span>
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Selected address mini-preview */}
                  {selectedAddress && (
                    <div className="bg-[#f7f9f6] border border-[#e8ede6] rounded-xl px-3 py-2.5 flex gap-2 items-start">
                      <MapPin className="w-3.5 h-3.5 text-[#3d6b45] mt-0.5 shrink-0" />
                      <div className="text-xs text-gray-600 leading-relaxed">
                        <p className="font-semibold text-gray-800">{selectedAddress.fullname}</p>
                        <p>{selectedAddress.addressline1}{selectedAddress.addressline2 ? `, ${selectedAddress.addressline2}` : ""}</p>
                        <p>{selectedAddress.city}, {selectedAddress.state} – {selectedAddress.pincode}</p>
                        <p className="text-gray-400">{selectedAddress.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  {selectedAddress && (
                    <div className="flex flex-col gap-2 pt-1">
                      <h3 className="font-bold text-gray-900 text-xs">Payment Method <span className="text-red-500">*</span></h3>
                      <div className="grid grid-cols-2 gap-2">
                        <label className={`cursor-pointer rounded-xl border flex flex-col items-center justify-center p-3 transition-all ${paymentMethod === 'cash' ? 'border-[#3d6b45] bg-[#f0f4ee] text-[#3d6b45]' : 'border-[#e8ede6] bg-[#f7f9f6] text-gray-400 hover:border-[#b8d4bc]'}`}>
                           <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod==='cash'} onChange={(e)=>setPaymentMethod(e.target.value)} className="hidden"/>
                           <Banknote className="w-5 h-5 mb-1" />
                           <span className="font-semibold text-xs">Cash on Delivery</span>
                        </label>
                        <label className={`cursor-pointer rounded-xl border flex flex-col items-center justify-center p-3 transition-all ${paymentMethod === 'online' ? 'border-[#3d6b45] bg-[#f0f4ee] text-[#3d6b45]' : 'border-[#e8ede6] bg-[#f7f9f6] text-gray-400 hover:border-[#b8d4bc]'}`}>
                           <input type="radio" name="paymentMethod" value="online" checked={paymentMethod==='online'} onChange={(e)=>setPaymentMethod(e.target.value)} className="hidden"/>
                           <CreditCard className="w-5 h-5 mb-1" />
                           <span className="font-semibold text-xs">Pay Online</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Checkout button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="w-full bg-[#3d6b45] hover:bg-[#345c3c] disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {placingOrder ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> processing…</>
                    ) : (
                      <>
                        {selectedAddress ? "buy now" : "Select Delivery Address"}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Toggle address panel */}
                  <button
                    onClick={() => setAddressOpen((o) => !o)}
                    className="flex items-center justify-between w-full text-xs text-[#3d6b45] font-semibold hover:underline"
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedAddress ? "Change delivery address" : "Add / select delivery address"}
                    </span>
                    {addressOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* ── Address panel (expands below) ── */}
                {addressOpen && (
                  <div className="bg-white rounded-2xl border border-[#e8ede6] p-5 flex flex-col gap-4">

                    {/* Panel header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-sm">Delivery Addresses</h3>
                      {!showForm && (
                        <button
                          onClick={() => { setShowForm(true); setFormData(EMPTY_FORM); setFormErrors({}); }}
                          className="text-xs text-[#3d6b45] font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add new
                        </button>
                      )}
                    </div>

                    {/* Saved addresses */}
                    {addrLoading ? (
                      <div className="flex flex-col gap-2">
                        {[1, 2].map((n) => <div key={n} className="h-20 rounded-xl bg-[#f0f4ee] animate-pulse" />)}
                      </div>
                    ) : addresses.length === 0 && !showForm ? (
                      <div className="text-center py-6">
                        <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No saved addresses yet.</p>
                        <button
                          onClick={() => { setShowForm(true); setFormData(EMPTY_FORM); setFormErrors({}); }}
                          className="mt-2 text-xs text-[#3d6b45] font-semibold hover:underline"
                        >
                          + Add your first address
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddrId === addr._id;
                          const isDeleting = deletingId === addr._id;
                          return (
                            <div
                              key={addr._id}
                              onClick={() => setSelectedAddrId(addr._id)}
                              className={`relative cursor-pointer rounded-xl border p-3 transition-all duration-200 ${
                                isSelected
                                  ? "border-[#3d6b45] bg-[#f0f4ee]"
                                  : "border-[#e8ede6] bg-[#f7f9f6] hover:border-[#b8d4bc]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex gap-2 items-start flex-1 min-w-0">
                                  {/* Radio circle */}
                                  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                                    isSelected ? "border-[#3d6b45] bg-[#3d6b45]" : "border-gray-300"
                                  }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                  </div>

                                  <div className="text-xs text-gray-600 leading-relaxed min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                      <p className="font-bold text-gray-800">{addr.fullname}</p>
                                      {addr.isDefault && (
                                        <span className="text-[10px] bg-[#3d6b45] text-white px-1.5 py-0.5 rounded-full font-semibold">Default</span>
                                      )}
                                    </div>
                                    <p className="truncate">{addr.addressline1}{addr.addressline2 ? `, ${addr.addressline2}` : ""}</p>
                                    <p>{addr.city}, {addr.state} – {addr.pincode}</p>
                                    <p className="text-gray-400">{addr.phone}</p>
                                  </div>
                                </div>

                                {/* Delete button */}
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteAddress(addr._id); }}
                                  disabled={isDeleting}
                                  className="p-1 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition-colors shrink-0 disabled:opacity-40"
                                >
                                  {isDeleting
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* ── Add address form ── */}
                    {showForm && (
                      <div className="border-t border-[#f0f4ee] pt-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-gray-800">New Address</p>
                          <button
                            onClick={() => { setShowForm(false); setFormErrors({}); }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <FormField label="Full Name" error={formErrors.fullname}>
                          <input
                            type="text"
                            placeholder="Rahul Sharma"
                            value={formData.fullname}
                            onChange={(e) => handleFormChange("fullname", e.target.value)}
                            className={inputCls(formErrors.fullname)}
                          />
                        </FormField>

                        <FormField label="Phone Number" error={formErrors.phone}>
                          <div className="flex">
                            <span className="flex items-center px-3 bg-[#f0f4ee] border border-r-0 border-[#e8ede6] rounded-l-lg text-xs text-gray-500 font-semibold whitespace-nowrap">
                              🇮🇳 +91
                            </span>
                            <input
                              type="tel"
                              placeholder="9876543210"
                              maxLength={10}
                              value={formData.phone}
                              onChange={(e) => handleFormChange("phone", e.target.value.replace(/\D/g, ""))}
                              className={inputCls(formErrors.phone) + " rounded-l-none"}
                            />
                          </div>
                        </FormField>

                        <FormField label="Address Line 1" error={formErrors.addressline1}>
                          <input
                            type="text"
                            placeholder="House no, Street, Area"
                            value={formData.addressline1}
                            onChange={(e) => handleFormChange("addressline1", e.target.value)}
                            className={inputCls(formErrors.addressline1)}
                          />
                        </FormField>

                        <FormField label="Address Line 2 (optional)">
                          <input
                            type="text"
                            placeholder="Landmark, Colony"
                            value={formData.addressline2}
                            onChange={(e) => handleFormChange("addressline2", e.target.value)}
                            className={inputCls()}
                          />
                        </FormField>

                        <div className="grid grid-cols-2 gap-2">
                          <FormField label="City" error={formErrors.city}>
                            <input
                              type="text"
                              placeholder="Bengaluru"
                              value={formData.city}
                              onChange={(e) => handleFormChange("city", e.target.value)}
                              className={inputCls(formErrors.city)}
                            />
                          </FormField>
                          <FormField label="Pincode" error={formErrors.pincode}>
                            <input
                              type="text"
                              placeholder="560001"
                              maxLength={6}
                              value={formData.pincode}
                              onChange={(e) => handleFormChange("pincode", e.target.value.replace(/\D/g, ""))}
                              className={inputCls(formErrors.pincode)}
                            />
                          </FormField>
                        </div>

                        <FormField label="State" error={formErrors.state}>
                          <select
                            value={formData.state}
                            onChange={(e) => handleFormChange("state", e.target.value)}
                            className={inputCls(formErrors.state) + " bg-white"}
                          >
                            <option value="">Select state</option>
                            {INDIAN_STATES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </FormField>

                        {/* Set as default */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <div
                            onClick={() => handleFormChange("isDefault", !formData.isDefault)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                              formData.isDefault ? "border-[#3d6b45] bg-[#3d6b45]" : "border-gray-300"
                            }`}
                          >
                            {formData.isDefault && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          </div>
                          <span className="text-xs text-gray-600">Set as default address</span>
                        </label>

                        <button
                          onClick={saveAddress}
                          disabled={formSaving}
                          className="w-full bg-[#3d6b45] hover:bg-[#345c3c] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 text-sm mt-1"
                        >
                          {formSaving
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                            : "Save Address"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Trust badges */}
                <div className="bg-white rounded-2xl border border-[#e8ede6] px-5 py-4 flex flex-col gap-2.5">
                  {[
                    { icon: "🌿", label: "100% natural & healthy plants" },
                    { icon: "📦", label: "Safe, eco-friendly packaging" },
                    { icon: "↩️", label: "Easy 7-day returns" },
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