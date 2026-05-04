import { useUser, RedirectToSignIn, useAuth, useClerk } from "@clerk/clerk-react";
import { ShieldAlert, Loader2, LogOut } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminGuard({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [dbRole, setDbRole] = useState(null);
  const [checking, setChecking] = useState(true);

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
          
          // AUTO-SIGNOUT if role is strictly 'user'
          if (data.data.role === "user") {
            await signOut();
          }
        } else {
          console.warn("User profile check returned negative", data.message);
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

  useEffect(() => {
    fetchRole();

    // Listen for sync completion to retry role check
    window.addEventListener("user-synced", fetchRole);
    return () => window.removeEventListener("user-synced", fetchRole);
  }, [isSignedIn, isLoaded]);

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-emerald-800 tracking-widest uppercase animate-pulse">Verifying Credentials...</p>
          <p className="text-[10px] text-slate-400 font-medium">Checking MongoDB Security Policy</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Use DB role as ground truth
  const role = dbRole;

  if (role === "gardener") {
    // If gardener tries to access admin routes, redirect to their dashboard
    return <Navigate to="/gardener/dashboard" replace />;
  }

  if (role === "user" || !role) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm shadow-red-50">
           <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Unauthorized Access</h1>
        <p className="text-slate-400 max-w-sm mb-8 font-medium">
          You have been signed out because your account does not have administrative permissions.
        </p>
        <button 
          onClick={() => window.location.href = import.meta.env.VITE_STORE_URL || "/"} // Link back to main store
          className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return children;
}
