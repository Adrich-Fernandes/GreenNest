import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useRole } from "../context/RoleContext";

const GARDENER_ROUTES = ["/gardener/dashboard", "/gardener/services"];
const ADMIN_ROUTES = ["/", "/products", "/gardeners", "/orders", "/returns"];

// Normalize role — handles both "gardner" and "gardener" spellings from DB
const normalizeRole = (role) => {
  if (!role) return null;
  const r = role.toLowerCase().trim();
  if (r === "gardner" || r === "gardener") return "gardener";
  if (r === "admin") return "admin";
  return r; // "user" or anything else
};

export default function RoleGate({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const { role: rawRole, loading } = useRole();
  const location = useLocation();

  // Normalize once — maps "gardner" → "gardener" etc.
  const role = normalizeRole(rawRole);

  // 1. Wait for Clerk + role fetch
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#f7f9f6] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#3d6b45] animate-spin" />
        <p className="text-sm font-bold text-[#3d6b45] tracking-widest uppercase animate-pulse">
          Verifying Access...
        </p>
      </div>
    );
  }

  // 2. Not signed in → send to login (skip for /login itself)
  if (!isSignedIn && location.pathname !== "/login") {
    return <RedirectToSignIn />;
  }

  // 3. Already signed in but on /login → redirect by role
  if (isSignedIn && location.pathname === "/login") {
    if (role === "gardener") return <Navigate to="/gardener/dashboard" replace />;
    if (role === "admin")    return <Navigate to="/" replace />;
  }

  // 4. GARDENER — can ONLY access gardener routes
  if (role === "gardener") {
    const isGardenerRoute = GARDENER_ROUTES.some((r) => location.pathname === r);
    if (!isGardenerRoute) {
      return <Navigate to="/gardener/dashboard" replace />;
    }
  }

  // 5. ADMIN — blocked from gardener routes
  if (role === "admin") {
    const isGardenerRoute = GARDENER_ROUTES.some((r) => location.pathname === r);
    if (isGardenerRoute) {
      return <Navigate to="/" replace />;
    }
  }

  // 6. Regular user or unknown role — no access to this panel
  if (isSignedIn && role !== "gardener" && role !== "admin" && location.pathname !== "/login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
          <span className="text-3xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Unauthorized</h1>
        <p className="text-slate-400 max-w-sm mb-8 font-medium">
          Your account does not have access to this portal.
        </p>
        <button
          onClick={() => (window.location.href = import.meta.env.VITE_STORE_URL || "/")}
          className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return children;
}
