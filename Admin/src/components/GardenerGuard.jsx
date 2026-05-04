import { useUser, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { Leaf, Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function GardenerGuard({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [dbRole, setDbRole] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setDbRole(data.data.role);
          }
        } catch (err) {
          console.error("Failed to verify role", err);
        } finally {
          setChecking(false);
        }
      } else if (isLoaded) {
        setChecking(false);
      }
    };
    fetchRole();
  }, [isSignedIn, isLoaded, getToken]);

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen bg-[#f7f9f6] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#3d6b45] animate-spin" />
        <p className="text-sm font-bold text-[#3d6b45] tracking-widest uppercase animate-pulse">Confirming Profile...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const role = dbRole;

  if (role === "admin") {
    // If admin tries to access gardener routes, redirect to admin dashboard
    return <Navigate to="/" replace />;
  }

  if (role !== "gardener") {
    return (
      <div className="min-h-screen bg-[#f7f9f6] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100 uppercase tracking-tighter">
           <Leaf className="w-8 h-8 text-red-500 opacity-20" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 max-w-sm mb-8">
          This system database does not recognize you as a professional gardener. 
          Please contact support to register.
        </p>
        <button 
          onClick={() => window.location.href = import.meta.env.VITE_STORE_URL || "/"} // Link back to main store
          className="px-6 py-2.5 bg-[#3d6b45] text-white font-semibold rounded-xl hover:bg-[#345c3c] transition-all"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return children;
}
