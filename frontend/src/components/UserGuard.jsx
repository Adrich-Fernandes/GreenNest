import { useUser, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { UserX, Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function UserGuard({ children }) {
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
          console.error("Failed to verify retail profile", err);
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-sm font-bold text-emerald-600 tracking-widest uppercase animate-pulse">Syncing Store Profile...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Relaxed: Any signed-in user can access their own retail features (Cart, Orders, Appointments)
  // regardless of their DB role.
  return children;
}
