import { createContext, useContext, useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

const RoleContext = createContext({ role: null, loading: true });

export function RoleProvider({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async () => {
    if (!isSignedIn) {
      setRole(null);
      setLoading(false);
      return;
    }
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRole(data.data.role);
      }
    } catch (err) {
      console.error("RoleProvider: failed to fetch role", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    setLoading(true);
    fetchRole();

    // Re-check after UserSync completes
    window.addEventListener("user-synced", fetchRole);
    return () => window.removeEventListener("user-synced", fetchRole);
  }, [isLoaded, isSignedIn, user?.id]);

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
