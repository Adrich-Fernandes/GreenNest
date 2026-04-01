import { useState, useEffect, useRef } from "react";
import { Search, Star, MapPin, Clock, ChevronDown, User } from "lucide-react";
import { Link } from "react-router-dom";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";

// Using predefined specialties for filter options
const serviceOptions = ["All Specialties", "Lawn Maintenance", "Home Gardening", "Landscaping", "Plant Care & Pruning", "Irrigation Setup", "Pest Control", "Seasonal Cleanup"];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function Gardeners() {
  const [gardeners, setGardeners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("All Specialties");
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cardsRef, cardsInView] = useInView(0.05);

  useEffect(() => {
    fetchGardeners();
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const fetchGardeners = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/gardener");
      const result = await res.json();
      if (result.success) {
        setGardeners(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch gardeners:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = gardeners.filter((g) => {
    const matchesSearch =
      (g.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (g.location || "").toLowerCase().includes(search.toLowerCase());
    
    const gardenerSpecialties = g.specialties || [];
    const matchesService =
      selectedService === "All Specialties" || gardenerSpecialties.includes(selectedService);
      
    return matchesSearch && matchesService;
  });

  return (
    <>
      <UserNavBar />
      <section className="w-full min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          <div className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Find a Gardener</h1>
            <p className="text-gray-400 text-sm mt-1">Book verified professionals for your gardening needs</p>
          </div>

          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all duration-700 relative z-30 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="flex items-center gap-3 bg-white border border-[#c8d9c0] rounded-xl px-4 py-3 flex-1 shadow-sm focus-within:border-[#3d6b45] focus-within:ring-2 focus-within:ring-[#f0f4ee] transition-all duration-200">
              <Search className="w-4 h-4 text-[#3d6b45] shrink-0" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>

            <div className="relative z-30">
              <button
                onClick={() => setServiceOpen(!serviceOpen)}
                className="flex items-center gap-2 bg-white border border-[#c8d9c0] rounded-xl px-4 py-3 text-sm text-gray-700 font-medium shadow-sm hover:border-[#3d6b45] transition-colors w-full sm:w-52 justify-between"
              >
                {selectedService}
                <ChevronDown className={`w-4 h-4 text-[#3d6b45] transition-transform duration-200 ${serviceOpen ? "rotate-180" : ""}`} />
              </button>
              {serviceOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-[#c8d9c0] rounded-xl shadow-lg z-50 w-52 py-1 overflow-hidden">
                  {serviceOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSelectedService(opt); setServiceOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f4ee] hover:text-[#3d6b45] flex items-center justify-between transition-colors"
                    >
                      {opt}
                      {selectedService === opt && (
                        <svg className="w-4 h-4 text-[#3d6b45]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
               {[1, 2, 3].map((n) => (
                 <div key={n} className="bg-white rounded-2xl p-6 h-64 animate-pulse border border-[#e8ede6]">
                   <div className="flex gap-4">
                     <div className="w-14 h-14 bg-gray-100 rounded-full" />
                     <div className="flex-1 space-y-3 py-1">
                       <div className="h-4 bg-gray-100 rounded w-3/4" />
                       <div className="h-3 bg-gray-100 rounded w-1/2" />
                     </div>
                   </div>
                   <div className="mt-6 space-y-3">
                     <div className="h-3 bg-gray-100 rounded" />
                     <div className="h-3 bg-gray-100 rounded w-5/6" />
                   </div>
                 </div>
               ))}
             </div>
          ) : filtered.length > 0 ? (
            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 relative z-0">
              {filtered.map((gardener, i) => (
                <div
                  key={gardener._id}
                  className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 opacity-100 translate-y-0`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#f0f4ee] rounded-full flex items-center justify-center shrink-0">
                      <User className="w-7 h-7 text-[#3d6b45]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-bold text-gray-900 leading-tight">{gardener.name}</h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-semibold text-gray-700">{gardener.rating || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs">{gardener.location || "Available"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">{gardener.experience || 0} yrs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{gardener.bio || "No description provided."}</p>

                  <div className="flex flex-wrap gap-2">
                    {/* ... (specialties mapping) */}
                    {(gardener.specialties || []).slice(0, 3).map((spec, idx) => (
                      <span key={idx} className="text-xs font-medium text-[#3d6b45] bg-[#f0f4ee] border border-[#c8d9c0] px-3 py-1 rounded-full">
                        {spec}
                      </span>
                    ))}
                    {gardener.specialties?.length > 3 && (
                      <span className="text-[10px] text-gray-400 font-medium py-1">
                        +{gardener.specialties.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        ₹{gardener.basePrice || 0}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">/hr</span>
                    </div>
                    <Link
                      to={`/gardeners/${gardener._id}`}
                      className="bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 text-center"
                    >
                      Book Gardener
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-gray-400 text-lg font-medium">No gardeners found</p>
              <p className="text-gray-300 text-sm">Try adjusting your search or filters</p>
            </div>
          )}

        </div>
      </section>
      <Footer />
    </>
  );
}