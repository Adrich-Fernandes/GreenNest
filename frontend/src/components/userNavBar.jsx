import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Leaf, Menu, X } from "lucide-react";

const navLinks = [
    { label: "Home", to: "/" },
    { label: "Plants & Products", to: "/plants" },
    { label: "Gardeners", to: "/gardeners" },
];

export default function UserNavBar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("Home");
    const [cartCount] = useState(2);

    const handleLinkClick = (label) => {
        setActiveLink(label);
        setMobileOpen(false);
    };

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                        <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-gray-900 font-semibold text-lg tracking-tight">
                        GreenNest
                    </span>
                </Link>

                {/* Desktop Nav Links — centered */}
                <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
                    {navLinks.map((link) => {
                        const isActive = activeLink === link.label;
                        return (
                            <li key={link.label}>
                                <Link
                                    to={link.to}
                                    onClick={() => handleLinkClick(link.label)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${isActive
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

                {/* Right Actions — always visible */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Cart */}
                    <button className="relative p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-50">
                        <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Login Button */}
                    <button className="px-4 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors duration-150">
                        Login
                    </button>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-50"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu — only nav links */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-6 py-3 flex flex-col gap-1">
                    {navLinks.map((link) => {
                        const isActive = activeLink === link.label;
                        return (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={() => handleLinkClick(link.label)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
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
