import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';

export default function UserSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !syncedRef.current) {
      const syncUser = async () => {
        try {
          const res = await fetch("http://localhost:8000/api/user/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              clerkId: user.id,
              name: user.fullName || user.firstName || "User",
              email: user.primaryEmailAddress?.emailAddress
            })
          });
          const data = await res.json();
          if (data.success) {
            syncedRef.current = true;
            // Optionally dispatch an event or set some global state to notify Guards
            window.dispatchEvent(new Event("user-synced"));
          }
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      };
      syncUser();
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
