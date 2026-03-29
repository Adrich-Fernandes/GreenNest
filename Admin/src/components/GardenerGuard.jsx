import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { Leaf } from "lucide-react";

export default function GardenerGuard({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f7f9f6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#3d6b45] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const role = user.publicMetadata?.role;

  if (role !== "gardener") {
    return (
      <div className="min-h-screen bg-[#f7f9f6] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100 uppercase tracking-tighter">
           <Leaf className="w-8 h-8 text-red-500 opacity-20" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 max-w-sm mb-8">
          This section is reserved for verified professional gardeners. 
          Please contact support if you believe this is an error.
        </p>
        <button 
          onClick={() => window.location.href = "/"}
          className="px-6 py-2.5 bg-[#3d6b45] text-white font-semibold rounded-xl hover:bg-[#345c3c] transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return children;
}
