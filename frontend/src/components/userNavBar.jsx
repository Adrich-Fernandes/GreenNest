import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Leaf, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Plants & Products", to: "/products" },
  { label: "Gardeners", to: "/gardeners" },
];

export default function UserNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(0);
  const location = useLocation();

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#c8d9c0]/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Left: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-[#3d6b45] hover:text-[#345c3c] rounded-lg hover:bg-[#f0f4ee] transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-[#3d6b45] rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-gray-900 font-semibold text-lg tracking-tight">
                GreenNest
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-[#f0f4ee] text-[#3d6b45]"
                        : "text-gray-600 hover:text-[#3d6b45] hover:bg-[#f0f4ee]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: Cart + Login */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-[#3d6b45] rounded-lg hover:bg-[#f0f4ee] transition-colors">
              <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#3d6b45] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 rounded-lg bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-medium transition-colors duration-150">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#c8d9c0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3d6b45] rounded-xl flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-gray-900 font-semibold text-base tracking-tight">GreenNest</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-gray-400 hover:text-[#3d6b45] rounded-lg hover:bg-[#f0f4ee] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex flex-col gap-1 px-4 py-4 flex-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#f0f4ee] text-[#3d6b45]"
                    : "text-gray-600 hover:bg-[#f0f4ee] hover:text-[#3d6b45]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="px-4 py-5 border-t border-[#c8d9c0]">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full py-3 rounded-xl bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold transition-colors duration-150">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center justify-between px-4 py-2 border border-[#c8d9c0]/50 rounded-xl bg-[#f0f4ee]/30">
              <span className="text-sm font-medium text-gray-700">Account</span>
              <UserButton showName />
            </div>
          </SignedIn>
        </div>
      </div>
    </>
  );
}