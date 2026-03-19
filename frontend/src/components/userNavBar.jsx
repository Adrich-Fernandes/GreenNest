import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Leaf, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Plants & Products", to: "/plants" },
  { label: "Gardeners", to: "/gardeners" },
];

export default function UserNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(2);
  const location = useLocation();

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-gray-100/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-gray-900 font-semibold text-lg tracking-tight">
            GreenNest
          </span>
        </Link>

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

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cart */}
          <button className="relative p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Login */}
          <button className="px-4 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors duration-150">
            Login
          </button>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/70 backdrop-blur-md px-6 py-3 flex flex-col items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`w-full text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}