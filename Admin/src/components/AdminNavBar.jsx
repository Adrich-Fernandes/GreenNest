import { LayoutDashboard, Package, Users, ShoppingCart, Leaf, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Gardeners", icon: Users, path: "/gardeners" },
  { label: "Orders", icon: ShoppingCart, path: "/orders" },
];

export default function Nav({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e3a22] flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#2a4d2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#3d6b45] rounded-xl flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-tight">GreenNest</span>
              <p className="text-[#7aa882] text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#7aa882] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 w-full text-left ${
                  isActive
                    ? "bg-[#3d6b45] text-white"
                    : "text-[#a8c4a0] hover:bg-[#2a4d2e] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div className="px-4 py-4 border-t border-[#2a4d2e]">
          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton 
                showName 
                appearance={{
                  elements: {
                    userButtonBox: "flex-row-reverse w-full justify-between",
                    userButtonOuterIdentifier: "text-white text-xs font-semibold",
                    userButtonAvatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#a8c4a0] hover:bg-[#2a4d2e] hover:text-white w-full text-left transition-all duration-150">
                <Users className="w-4 h-4 shrink-0" />
                Admin Login
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </aside>
    </>
  );
}