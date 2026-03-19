import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Leaf, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Plants & Products", to: "/products" },
  { label: "Gardeners", to: "/gardeners" },
];

export default function UserNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(2);
  const location = useLocation();

  return (
    <>
      <nav className="bg-white/70 backdrop-blur-md border-b border-gray-100/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Left: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
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
                        ? "bg-green-50 text-green-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
            <button className="relative p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="px-4 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors duration-150">
              Login
            </button>
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-gray-900 font-semibold text-base tracking-tight">GreenNest</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
                    ? "bg-green-50 text-green-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="px-4 py-5 border-t border-gray-100">
          <button className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors duration-150">
            Login
          </button>
        </div>
      </div>
    </>
  );
}