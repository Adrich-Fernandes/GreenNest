import { useUser, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminGuard({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [dbRole, setDbRole] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          const res = await fetch("http://localhost:8000/api/user/me", {
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-sm font-bold text-emerald-800 tracking-widest uppercase animate-pulse">Verifying Credentials...</p>
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

  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
           <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
        <p className="text-gray-400 max-w-sm mb-8 font-medium">
          This system database shows you do not have administrative privileges. 
          Please log in with a valid admin account.
        </p>
        <button 
          onClick={() => window.location.href = "http://localhost:5173"} // Link back to main store
          className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return children;
}
