import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Leaf, Menu, X, Search } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Plants & Products", to: "/products" },
  { label: "Gardeners", to: "/gardeners" },
  { label: "Orders", to: "/orders" },
];

const API_BASE = "http://localhost:8000/api/products";

export default function UserNavBar() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [cartCount]                        = useState(0);
  const [searchOpen, setSearchOpen]        = useState(false);
  const [query, setQuery]                  = useState("");
  const [results, setResults]              = useState([]);
  const [searching, setSearching]          = useState(false);
  const [showDropdown, setShowDropdown]    = useState(false);
  const desktopSearchRef                   = useRef(null);
  const mobileSearchRef                    = useRef(null);
  const inputRef                           = useRef(null);
  const location                           = useLocation();
  const navigate                           = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      const insideDesktop = desktopSearchRef.current && desktopSearchRef.current.contains(e.target);
      const insideMobile  = mobileSearchRef.current && mobileSearchRef.current.contains(e.target);
      
      if (!insideDesktop && !insideMobile) {
        setShowDropdown(false);
        setSearchOpen(false);
        setQuery("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowDropdown(false); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res  = await fetch(`${API_BASE}/allProducts`);
        const data = await res.json();
        if (data.success) {
          const filtered = data.data
            .filter((p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              (p.category || "").toLowerCase().includes(query.toLowerCase()) ||
              (p.nursery  || "").toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 6); // max 6 suggestions
          setResults(filtered);
          setShowDropdown(true);
        }
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // handleSelect is no longer needed as we use Link components

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setShowDropdown(false);
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#c8d9c0]/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* Left: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-3 shrink-0">
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
              <span className="text-gray-900 font-semibold text-lg tracking-tight hidden sm:block">
                GreenNest
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1 shrink-0">
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

          {/* Search bar — desktop (expands inline) */}
          <div ref={desktopSearchRef} className="hidden md:flex flex-1 max-w-xs relative justify-end">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center gap-2 bg-[#f7f9f6] border rounded-xl px-3 py-2 transition-all duration-300 w-full ${
                searchOpen
                  ? "border-[#3d6b45] ring-2 ring-[#3d6b45]/10"
                  : "border-[#e8ede6] hover:border-[#c8d9c0]"
              }`}
            >
              <Search className="w-4 h-4 text-[#3d6b45] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search plants, tools…"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none min-w-0"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setResults([]); setShowDropdown(false); inputRef.current?.focus(); }}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Suggestions dropdown */}
            {showDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-[#e8ede6] rounded-2xl shadow-lg z-50 overflow-hidden">
                {searching ? (
                  <div className="px-4 py-3 text-xs text-gray-400">Searching…</div>
                ) : results.length > 0 ? (
                  <>
                    {results.map((p) => (
                      <Link
                        key={p._id}
                        to={`/plants/${p._id}`}
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchOpen(false);
                          setQuery("");
                          setResults([]);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#f7f9f6] transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#f0f4ee] shrink-0">
                          <img
                            src={p.images?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&q=60"}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate">{p.category} · ₹{p.price}</p>
                        </div>
                      </Link>
                    ))}
                    {/* View all results */}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full px-4 py-2.5 text-xs font-semibold text-[#3d6b45] hover:bg-[#f0f4ee] border-t border-[#f0f4ee] transition-colors text-left flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      See all results for "{query}"
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-3 text-xs text-gray-400">No products found for "{query}"</div>
                )}
              </div>
            )}
          </div>

          {/* Right: Mobile search + Cart + Login */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Mobile search toggle */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-[#3d6b45] rounded-lg hover:bg-[#f0f4ee] transition-colors"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

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

        {/* Mobile search bar — slides down below navbar */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            searchOpen ? "max-h-32 border-t border-[#e8ede6]" : "max-h-0"
          }`}
        >
          <div ref={mobileSearchRef} className="px-4 py-3 relative">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-[#f7f9f6] border border-[#3d6b45] ring-2 ring-[#3d6b45]/10 rounded-xl px-3 py-2.5"
            >
              <Search className="w-4 h-4 text-[#3d6b45] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search plants, tools, seeds…"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                autoFocus={searchOpen}
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setResults([]); setShowDropdown(false); }}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Mobile suggestions dropdown */}
            {showDropdown && results.length > 0 && (
              <div className="absolute left-4 right-4 top-full bg-white border border-[#e8ede6] rounded-2xl shadow-lg z-50 overflow-hidden">
                {results.map((p) => (
                  <Link
                    key={p._id}
                    to={`/plants/${p._id}`}
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchOpen(false);
                      setQuery("");
                      setResults([]);
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#f7f9f6] transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#f0f4ee] shrink-0">
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&q=60"}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.category} · ₹{p.price}</p>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleSearchSubmit}
                  className="w-full px-4 py-2.5 text-xs font-semibold text-[#3d6b45] hover:bg-[#f0f4ee] border-t border-[#f0f4ee] transition-colors text-left flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  See all results for "{query}"
                </button>
              </div>
            )}
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