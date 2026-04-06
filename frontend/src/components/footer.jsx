import { Leaf, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [formData, setFormData] = useState({ name: "", email: "", query: "" });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || ""
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("http://localhost:8000/api/queries/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          clerkId: user?.id || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setFormData(prev => ({ ...prev, query: "" }));
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <footer className="w-full bg-[#1e3a22] px-6 md:px-16 pt-14 pb-8 overflow-hidden relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -ml-24 -mb-24" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Link to="/" className="flex items-center gap-3 w-fit group">
                <div className="w-11 h-11 bg-[#3d6b45] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-white font-black text-2xl tracking-tighter uppercase italic">GreenNest</span>
              </Link>
              <p className="text-[#a8c4a0] text-sm leading-relaxed max-w-sm font-medium opacity-80">
                Your one-stop destination for quality plants, gardening products, and professional gardening services. Bringing nature closer to your home with expert care.
              </p>
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-bold text-xs uppercase tracking-widest opacity-40">Contact Support</h4>
                <div className="flex flex-col gap-2">
                  <Link to="mailto:help@greennest.com" className="text-[#a8c4a0] text-sm hover:text-white transition-colors">help@greennest.com</Link>
                  <Link to="tel:+918888888888" className="text-[#a8c4a0] text-sm hover:text-white transition-colors">+91 88888 88888</Link>
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-8">
              <div className="flex flex-col gap-5">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Navigation</h3>
                <ul className="flex flex-col gap-3">
                  <li><Link to="/products" className="text-[#a8c4a0] text-sm hover:text-white transition-all hover:translate-x-1 inline-block">Browse Plants</Link></li>
                  <li><Link to="/gardeners" className="text-[#a8c4a0] text-sm hover:text-white transition-all hover:translate-x-1 inline-block">Find Gardeners</Link></li>
                  <li><Link to="/orders" className="text-[#a8c4a0] text-sm hover:text-white transition-all hover:translate-x-1 inline-block">My Orders</Link></li>
                </ul>
              </div>
              <div className="flex flex-col gap-5 lg:mt-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Company</h3>
                <ul className="flex flex-col gap-3">
                  <li><Link to="/about" className="text-[#a8c4a0] text-sm hover:text-white transition-all hover:translate-x-1 inline-block">About Us</Link></li>
                  <li><Link to="/terms" className="text-[#a8c4a0] text-sm hover:text-white transition-all hover:translate-x-1 inline-block">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            {/* Inquiry Form Section */}
            <div className="lg:col-span-5">
              <div className="bg-[#2a4a30] p-7 rounded-[32px] border border-emerald-800/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Send className="w-24 h-24 text-white -rotate-12" />
                </div>
                
                <h3 className="text-white font-bold text-lg mb-1 tracking-tight">Need expert advice?</h3>
                <p className="text-[#a8c4a0] text-xs mb-6 font-medium">Send us your query and we'll help you grow.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      disabled={isSignedIn || status === "loading"}
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-[#1e3a22] border border-emerald-900/50 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all disabled:opacity-60"
                      required
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      disabled={isSignedIn || status === "loading"}
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-[#1e3a22] border border-emerald-900/50 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all disabled:opacity-60"
                      required
                    />
                  </div>
                  <textarea 
                    placeholder="Describe your query..."
                    value={formData.query}
                    disabled={status === "loading"}
                    onChange={(e) => setFormData(prev => ({ ...prev, query: e.target.value }))}
                    className="bg-[#1e3a22] border border-emerald-900/50 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all h-24 resize-none"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className={`h-11 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${
                      status === "success" 
                        ? "bg-emerald-500 text-white" 
                        : status === "error"
                        ? "bg-red-500 text-white"
                        : "bg-white text-[#1e3a22] hover:bg-[#f0f4ee]"
                    }`}
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : status === "success" ? (
                      <><CheckCircle2 className="w-4 h-4" /> Message Sent!</>
                    ) : status === "error" ? (
                      "Try Again"
                    ) : (
                      <><Send className="w-4 h-4" /> Send Inquiry</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2e5235] opacity-50" />
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#7aa882] text-xs font-medium tracking-tight">© 2026 GreenNest. Handcrafted for plant lovers.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-[#7aa882] text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-[#7aa882] text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
  );
}