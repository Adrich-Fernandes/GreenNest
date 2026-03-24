import { Link } from "react-router-dom";
import { Leaf, LogOut, Bell } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function GardenerNavBar() {
  return (
    <nav className="bg-white border-b border-[#e8ede6] px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#3d6b45] rounded-xl flex items-center justify-center">
          <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-gray-900 font-bold text-lg tracking-tight hidden sm:block">
          GreenNest <span className="text-[#3d6b45] font-medium text-sm ml-1">Gardener</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          to="/gardener/dashboard" 
          className="text-sm font-semibold text-[#3d6b45] border-b-2 border-[#3d6b45] pb-1"
        >
          Appointments
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-400 hover:text-[#3d6b45] rounded-lg hover:bg-[#f0f4ee] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        
        <SignedIn>
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-[#3d6b45] text-white text-sm font-semibold rounded-xl hover:bg-[#345c3c] transition-colors shadow-sm">
              Login
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}
