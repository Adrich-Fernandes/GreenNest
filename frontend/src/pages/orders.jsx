import { useState, useEffect, useRef } from "react";
import {
  Package, Leaf, ArrowRight, ChevronDown, ChevronUp,
  RotateCcw, Truck, CheckCircle2, Clock, XCircle,
  MapPin, Phone, Star, AlertCircle, ChevronRight,
  CalendarDays, RefreshCw, PackageCheck, PackageX
} from "lucide-react";
import { Link } from "react-router-dom";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";
import { useAuth } from "@clerk/clerk-react";

// ── useInView hook (same as hero page) ────────────────────────────────────────
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

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    _id: "ORD-20240501-001",
    createdAt: "2024-05-01T10:30:00Z",
    status: "Out for Delivery",
    statusKey: "out_for_delivery",
    items: [
      { _id: "p1", name: "Monstera Deliciosa", category: "Indoor Plants", price: 349, qty: 1, image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=200&q=80" },
      { _id: "p2", name: "Peace Lily", category: "Flowering", price: 199, qty: 2, image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=200&q=80" },
    ],
    address: { fullname: "Rahul Sharma", addressline1: "12, MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "9876543210" },
    subtotal: 747, delivery: 0, total: 747,
    tracking: [
      { label: "Order Placed", done: true,  time: "May 1, 10:30 AM" },
      { label: "Confirmed",    done: true,  time: "May 1, 11:00 AM" },
      { label: "Packed",       done: true,  time: "May 2, 9:15 AM"  },
      { label: "Dispatched",   done: true,  time: "May 2, 2:00 PM"  },
      { label: "Delivered",    done: false, time: "Expected May 3"  },
    ],
    canReturn: false, canCancel: false,
  },
  {
    _id: "ORD-20240420-002",
    createdAt: "2024-04-20T14:00:00Z",
    status: "Delivered",
    statusKey: "delivered",
    items: [
      { _id: "p3", name: "Snake Plant", category: "Indoor Plants", price: 289, qty: 1, image: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=200&q=80" },
    ],
    address: { fullname: "Rahul Sharma", addressline1: "12, MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "9876543210" },
    subtotal: 289, delivery: 49, total: 338,
    tracking: [
      { label: "Order Placed", done: true, time: "Apr 20, 2:00 PM"  },
      { label: "Confirmed",    done: true, time: "Apr 20, 2:30 PM"  },
      { label: "Packed",       done: true, time: "Apr 21, 8:00 AM"  },
      { label: "Dispatched",   done: true, time: "Apr 21, 12:30 PM" },
      { label: "Delivered",    done: true, time: "Apr 22, 11:00 AM" },
    ],
    canReturn: true, canCancel: false,
    returnStatus: null,
  },
  {
    _id: "ORD-20240410-003",
    createdAt: "2024-04-10T09:00:00Z",
    status: "Return Requested",
    statusKey: "return_requested",
    items: [
      { _id: "p4", name: "Fiddle Leaf Fig", category: "Indoor Plants", price: 599, qty: 1, image: "https://images.unsplash.com/photo-1597055181449-3a5028e8a746?w=200&q=80" },
    ],
    address: { fullname: "Rahul Sharma", addressline1: "12, MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "9876543210" },
    subtotal: 599, delivery: 0, total: 599,
    tracking: [
      { label: "Order Placed", done: true, time: "Apr 10, 9:00 AM"  },
      { label: "Confirmed",    done: true, time: "Apr 10, 9:30 AM"  },
      { label: "Packed",       done: true, time: "Apr 11, 8:00 AM"  },
      { label: "Dispatched",   done: true, time: "Apr 11, 1:00 PM"  },
      { label: "Delivered",    done: true, time: "Apr 12, 10:00 AM" },
    ],
    canReturn: false, canCancel: false,
    returnStatus: "return_requested",
    pickupDate: "May 5, 2024",
  },
  {
    _id: "ORD-20240401-004",
    createdAt: "2024-04-01T16:00:00Z",
    status: "Cancelled",
    statusKey: "cancelled",
    items: [
      { _id: "p5", name: "Areca Palm", category: "Outdoor Plants", price: 450, qty: 1, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
    ],
    address: { fullname: "Rahul Sharma", addressline1: "12, MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "9876543210" },
    subtotal: 450, delivery: 49, total: 499,
    tracking: [
      { label: "Order Placed", done: true,  time: "Apr 1, 4:00 PM"  },
      { label: "Confirmed",    done: false, time: ""                 },
      { label: "Packed",       done: false, time: ""                 },
      { label: "Dispatched",   done: false, time: ""                 },
      { label: "Delivered",    done: false, time: ""                 },
    ],
    canReturn: false, canCancel: false,
  },
];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  ordered:          { color: "text-amber-600",    bg: "bg-amber-50",  border: "border-amber-200",  dot: "bg-amber-500",  icon: Package,       label: "Ordered"          },
  shipped:          { color: "text-purple-600",   bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-500", icon: Truck,         label: "Shipped"          },
  out_for_delivery: { color: "text-blue-600",     bg: "bg-blue-50",   border: "border-blue-200",   dot: "bg-blue-500",   icon: Truck,         label: "Out for Delivery" },
  delivered:        { color: "text-[#3d6b45]",    bg: "bg-[#f0f4ee]", border: "border-[#c8d9c0]",  dot: "bg-[#3d6b45]", icon: CheckCircle2,  label: "Delivered"        },
  return_requested: { color: "text-orange-600",   bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500", icon: RefreshCw,     label: "Return Requested" },
  return_confirmed: { color: "text-[#3d6b45]",    bg: "bg-[#f0f4ee]", border: "border-[#c8d9c0]",  dot: "bg-[#3d6b45]", icon: PackageCheck,   label: "Return Confirmed" },
  refunded:         { color: "text-blue-600",     bg: "bg-blue-50",   border: "border-blue-200",   dot: "bg-blue-500",   icon: CheckCircle2,  label: "Refunded"         },
  cancelled:        { color: "text-red-500",      bg: "bg-red-50",    border: "border-red-200",    dot: "bg-red-400",    icon: XCircle,       label: "Cancelled"        },
  cancel_requested: { color: "text-red-400",      bg: "bg-red-50",    border: "border-red-100",    dot: "bg-red-300",    icon: Clock,         label: "Cancel Requested" },
};

const FILTER_TABS = ["All", "Active", "Delivered", "Returns", "Cancelled"];

// ── Return modal ──────────────────────────────────────────────────────────────
function ReturnModal({ order, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const reasons = ["Plant arrived damaged", "Wrong plant delivered", "Plant is unhealthy/wilting", "Changed my mind", "Other"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5 z-10 animate-in"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.25s ease-out" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Request a Return</h3>
            <p className="text-xs text-gray-400">Order #{order._id.slice(-6)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Reason for Return</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e8ede6] focus:outline-none focus:ring-2 focus:ring-[#c8d9c0] bg-white"
          >
            <option value="">Select a reason…</option>
            {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Additional Details (optional)</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            placeholder="Tell us more about the issue…"
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e8ede6] focus:outline-none focus:ring-2 focus:ring-[#c8d9c0] resize-none placeholder:text-gray-300"
          />
        </div>

        <div className="bg-[#f7f9f6] border border-[#e8ede6] rounded-xl px-4 py-3 flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-[#3d6b45] mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 leading-relaxed">
            A pickup will be scheduled within <strong className="text-gray-700">2 business days</strong>. Refund is processed after inspection.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#e8ede6] text-sm font-semibold text-gray-500 hover:bg-[#f7f9f6] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!reason}
            onClick={() => onSubmit(reason, details)}
            className="flex-1 py-2.5 rounded-xl bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-bold disabled:opacity-40 transition-colors"
          >
            Submit Return
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}

// ── Rating modal ──────────────────────────────────────────────────────────────
function RatingModal({ order, onClose }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5 z-10"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.25s ease-out" }}
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 bg-[#f0f4ee] rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#3d6b45]" />
            </div>
            <p className="font-bold text-gray-900">Thanks for your review!</p>
            <p className="text-xs text-gray-400 text-center">Your feedback helps other plant lovers.</p>
            <button onClick={onClose} className="mt-2 text-[#3d6b45] font-semibold text-sm hover:underline">Close</button>
          </div>
        ) : (
          <>
            <div className="text-center flex flex-col gap-1">
              <Leaf className="w-7 h-7 text-[#3d6b45] mx-auto" />
              <h3 className="font-bold text-gray-900 text-base">Rate your order</h3>
              <p className="text-xs text-gray-400">How was your experience?</p>
            </div>
            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setStars(s)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 transition-colors ${(hover || stars) >= s ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                </button>
              ))}
            </div>
            <button
              disabled={!stars}
              onClick={() => setSubmitted(true)}
              className="w-full py-2.5 rounded-xl bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-bold disabled:opacity-40 transition-colors"
            >
              Submit Review
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Tracking stepper ──────────────────────────────────────────────────────────
function TrackingSteps({ steps, statusKey }) {
  const isCancelled = statusKey === "cancelled";
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const active = step.done && !isCancelled;
        return (
          <div key={step.label} className="flex gap-3 items-start">
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                isCancelled && i > 0
                  ? "border-gray-200 bg-white"
                  : active
                  ? "border-[#3d6b45] bg-[#3d6b45]"
                  : "border-gray-200 bg-white"
              }`}>
                {active && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                {isCancelled && i === 0 && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              {!isLast && <div className={`w-0.5 h-7 mt-0.5 transition-colors ${active && !isCancelled ? "bg-[#3d6b45]/30" : "bg-gray-100"}`} />}
            </div>
            <div className="pb-6">
              <p className={`text-xs font-semibold leading-none ${active ? "text-gray-800" : "text-gray-300"}`}>{step.label}</p>
              {step.time && <p className={`text-[10px] mt-1 ${active ? "text-gray-400" : "text-gray-200"}`}>{step.time}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ order, index, mounted, onReturnRequest }) {
  const [expanded, setExpanded] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const cfg = STATUS_CONFIG[order.statusKey] || STATUS_CONFIG.processing;
  const StatusIcon = cfg.icon;

  return (
    <>
      <div
        className={`bg-white rounded-2xl border border-[#e8ede6] overflow-hidden transition-all duration-500 hover:shadow-md ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
          onClick={() => setExpanded((e) => !e)}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail stack */}
            <div className="flex -space-x-2 shrink-0">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={item._id} className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white bg-[#f0f4ee]" style={{ zIndex: 3 - i }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-10 h-10 rounded-xl bg-[#f0f4ee] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#3d6b45]">
                  +{order.items.length - 3}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">#{order._id.slice(-9)}</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {order.items.map((i) => i.name).join(", ")}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString("en-IN")}</p>
              <p className="text-[11px] text-gray-400">{order.items.reduce((s, i) => s + i.qty, 0)} item{order.items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}</p>
            </div>
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="border-t border-[#f0f4ee] px-5 py-5 flex flex-col gap-5">

            {/* Items list */}
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f0f4ee] shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.category} · Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 shrink-0">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              {/* Tracking */}
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#3d6b45]" /> Tracking
                </p>
                <TrackingSteps steps={order.tracking} statusKey={order.statusKey} />
              </div>

              {/* Address + pricing */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-[#f7f9f6] border border-[#e8ede6] rounded-xl p-3">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#3d6b45]" /> Delivery Address
                  </p>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    <p className="font-semibold text-gray-800">{order.address.fullname}</p>
                    <p>{order.address.addressline1}</p>
                    <p>{order.address.city}, {order.address.state} – {order.address.pincode}</p>
                    <p className="text-gray-400 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {order.address.phone}</p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span><span className="font-medium text-gray-700">₹{order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    {order.delivery === 0
                      ? <span className="text-[#3d6b45] font-semibold">Free</span>
                      : <span className="font-medium text-gray-700">₹{order.delivery}</span>}
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-[#f0f4ee]">
                    <span>Total</span><span>₹{order.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Return / pickup / rate actions */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-[#f0f4ee]">
              {/* Rate order */}
              {order.statusKey === "delivered" && (
                <button
                  onClick={() => setShowRating(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Rate Order
                </button>
              )}

              {/* Request return */}
              {order.canReturn && (
                <button
                  onClick={() => onReturnRequest(order)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-2 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Request Return
                </button>
              )}

              {/* Return requested + pickup info */}
              {order.returnStatus === "return_requested" && (
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-2 rounded-xl">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Return Requested</span>
                  {order.pickupDate && (
                    <>
                      <span className="text-orange-300">·</span>
                      <span className="flex items-center gap-1 text-orange-500">
                        <PackageCheck className="w-3.5 h-3.5" /> Pickup: {order.pickupDate}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Cancel order */}
              {order.canCancel && (
                <button
                  onClick={() => onCancel(order._id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel Order
                </button>
              )}

              {/* Cancelled badge */}
              {(order.statusKey === "cancelled" || order.statusKey === "cancel_requested") && (
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border ${order.statusKey === 'cancelled' ? 'text-red-500 bg-red-50 border-red-200' : 'text-red-400 bg-red-50 border-red-100'}`}>
                  {order.statusKey === 'cancelled' ? <PackageX className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>{order.status}</span>
                </div>
              )}

            </div>

          </div>
        )}
      </div>

      {showRating && <RatingModal order={order} onClose={() => setShowRating(false)} />}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Orders() {
  const { getToken } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [filter, setFilter]   = useState("All");
  const [orders, setOrders]   = useState([]);
  const [returnModal, setReturnModal] = useState(null);
  const [headerRef, headerInView] = useInView(0.1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:8000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.message || "Failed to load orders");
        }
      } catch (err) {
        setError("Server connection failed");
      } finally {
        setLoading(false);
        setTimeout(() => setMounted(true), 50);
      }
    };
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = orders.filter((o) => {
    if (filter === "All")       return true;
    if (filter === "Active")    return ["ordered", "shipped", "out_for_delivery"].includes(o.statusKey);
    if (filter === "Delivered") return o.statusKey === "delivered";
    if (filter === "Returns")   return o.statusKey === "return_requested" || o.returnStatus;
    if (filter === "Cancelled") return o.statusKey === "cancelled";
    return true;
  });

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => o._id === orderId ? data.data : o));
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const handleReturnSubmit = async (reason, details) => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/api/orders/${returnModal._id}/return`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason, details })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === returnModal._id ? data.data : o
          )
        );
      } else {
        alert(data.message || "Failed to submit return request");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setReturnModal(null);
    }
  };

  return (
    <>
      <UserNavBar />

      <section className="w-full min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div
            ref={headerRef}
            className={`mb-8 transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                <p className="text-gray-400 text-sm mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-2 text-sm font-semibold text-[#3d6b45] bg-white border border-[#e8ede6] px-4 py-2.5 rounded-xl hover:border-[#c8d9c0] hover:bg-[#f0f4ee] transition-all"
              >
                <Leaf className="w-4 h-4" /> Shop More Plants
              </Link>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mt-6 overflow-x-auto pb-1 scrollbar-hide">
              {FILTER_TABS.map((tab) => {
                const count = tab === "All" ? orders.length
                  : tab === "Active"    ? orders.filter((o) => ["ordered", "shipped", "out_for_delivery"].includes(o.statusKey)).length
                  : tab === "Delivered" ? orders.filter((o) => o.statusKey === "delivered").length
                  : tab === "Returns"   ? orders.filter((o) => o.statusKey === "return_requested" || o.returnStatus).length
                  : orders.filter((o) => o.statusKey === "cancelled").length;

                return (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`flex items-center gap-1.5 shrink-0 text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-150 ${
                      filter === tab
                        ? "bg-[#3d6b45] text-white border-[#3d6b45]"
                        : "bg-white text-gray-500 border-[#e8ede6] hover:border-[#c8d9c0]"
                    }`}
                  >
                    {tab}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filter === tab ? "bg-white/20 text-white" : "bg-[#f0f4ee] text-gray-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          {/* Order list */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-[#e8ede6] p-4 flex gap-4 animate-pulse h-32" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-24 gap-5 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="w-28 h-28 rounded-full bg-[#f0f4ee] flex items-center justify-center">
                <Package className="w-12 h-12 text-[#3d6b45] opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">No orders here</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">You don't have any {filter !== "All" ? filter.toLowerCase() : ""} orders yet.</p>
              </div>
              <Link to="/products" className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95">
                <Leaf className="w-4 h-4" /> Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((order, i) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  index={i}
                  mounted={mounted}
                  onReturnRequest={(o) => setReturnModal(o)}
                  onCancel={handleCancelOrder}
                />
              ))}
            </div>
          )}


        </div>
      </section>

      <Footer />

      {/* Return modal */}
      {returnModal && (
        <ReturnModal
          order={returnModal}
          onClose={() => setReturnModal(null)}
          onSubmit={handleReturnSubmit}
        />
      )}
    </>
  );
}