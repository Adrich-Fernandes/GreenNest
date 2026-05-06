import { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";
import Nav from "./AdminNavBar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f7f9f6] overflow-hidden">
      <Nav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#e8ede6] px-6 h-16 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-gray-500 hover:text-[#3d6b45] rounded-lg hover:bg-[#f0f4ee] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-[#f7f9f6] border border-[#e8ede6] rounded-xl px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                placeholder="Search..."
                className="text-sm text-gray-600 bg-transparent outline-none placeholder-gray-400 flex-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-[#3d6b45] rounded-lg hover:bg-[#f0f4ee] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#3d6b45] rounded-full" />
            </button>
            
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 bg-[#3d6b45] text-white text-xs font-semibold rounded-lg hover:bg-[#345c3c] transition-colors">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
