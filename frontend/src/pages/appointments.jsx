import { useState, useEffect } from "react";
import {
  CalendarDays, Clock, MapPin, Star, Sprout,
  Scissors, Home, Trees, Search, Loader2, Leaf, X
} from "lucide-react";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";
import { useUser, useAuth } from "@clerk/clerk-react";

/* ── Status config ── */
const STATUS_CFG = {
  Pending:     { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  Accepted:    { color: "text-[#3d6b45]",   bg: "bg-[#f0f4ee]",  border: "border-[#c8d9c0]"  },
  Completed:   { color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200"    },
  Canceled:    { color: "text-red-500",     bg: "bg-red-50",     border: "border-red-200"     },
  Rescheduled: { color: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200"  },
};

const SERVICE_ICONS = {
  "Home Gardening":     Home,
  "Lawn Maintenance":   Trees,
  "Plant Care & Pruning": Scissors,
};

const FILTERS = ["All", "Pending", "Accepted", "Completed", "Canceled", "Rescheduled"];

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM",
];

export default function Appointments() {
  const { user, isLoaded } = useUser();
  const { isSignedIn, getToken } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [cancelling, setCancelling] = useState(null);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn && user) fetchAppointments();
    else if (isLoaded) setLoading(false);
  }, [isLoaded, isSignedIn, user]);

  const fetchAppointments = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/api/gardener/my-appointments/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setAppointments(result.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (apt) => {
    setCancelling(apt._id);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/api/gardener/cancel-appointment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gardenerId: apt.gardenerId, appointmentId: apt._id }),
      });
      const result = await res.json();
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) => a._id === apt._id ? { ...a, status: "Canceled" } : a)
        );
      }
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setCancelling(null);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      setRescheduleError("Please select both date and time");
      return;
    }
    setRescheduling(true);
    setRescheduleError("");
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/api/gardener/reschedule-appointment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          gardenerId: rescheduleData.apt.gardenerId, 
          appointmentId: rescheduleData.apt._id,
          date: rescheduleData.date,
          time: rescheduleData.time
        }),
      });
      const result = await res.json();
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) => a._id === rescheduleData.apt._id ? { ...a, status: "Rescheduled", date: rescheduleData.date, time: rescheduleData.time } : a)
        );
        setRescheduleData(null);
      } else {
        setRescheduleError(result.message || "Failed to reschedule");
      }
    } catch (err) {
      console.error("Reschedule failed:", err);
      setRescheduleError("An error occurred");
    } finally {
      setRescheduling(false);
    }
  };

  const filtered = appointments.filter((apt) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (apt.gardenerName || "").toLowerCase().includes(q) ||
      (apt.service || "").toLowerCase().includes(q);
    const matchStatus = filter === "All" || apt.status === filter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <UserNavBar />
      <section className="min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-sm text-gray-400 mt-1">Track and manage your gardening bookings</p>
          </div>

          {/* Search + Filters */}
          <div className="bg-white p-4 rounded-2xl border border-[#e8ede6] flex flex-wrap gap-3 items-center shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="text"
                placeholder="Search by gardener or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#e8ede6] rounded-xl outline-none focus:ring-2 focus:ring-[#c8d9c0] focus:border-[#3d6b45] transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                    filter === f
                      ? "bg-[#3d6b45] text-white border-[#3d6b45]"
                      : "bg-white text-gray-500 border-[#e8ede6] hover:border-[#3d6b45] hover:text-[#3d6b45]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 text-[#3d6b45] animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading your appointments...</p>
            </div>
          ) : !isSignedIn ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Leaf className="w-10 h-10 text-[#c8d9c0]" />
              <p className="text-gray-500 font-semibold">Please sign in to view your appointments</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-16 h-16 bg-[#f0f4ee] rounded-2xl flex items-center justify-center border border-[#c8d9c0]">
                <CalendarDays className="w-8 h-8 text-[#3d6b45] opacity-40" />
              </div>
              <p className="text-gray-500 font-semibold">No appointments found</p>
              <p className="text-gray-400 text-sm">
                {filter !== "All" ? `No ${filter.toLowerCase()} appointments` : "Book your first gardening service!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((apt) => {
                const cfg = STATUS_CFG[apt.status] || STATUS_CFG.Pending;
                const ServiceIcon = SERVICE_ICONS[apt.service] || Sprout;

                return (
                  <div
                    key={apt._id}
                    className="bg-white rounded-2xl border border-[#e8ede6] shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition"
                  >
                    {/* Top */}
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-[#f0f4ee] rounded-xl flex items-center justify-center shrink-0">
                          <ServiceIcon className="w-5 h-5 text-[#3d6b45]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{apt.service}</p>
                          <p className="text-xs text-gray-400 font-mono">#{apt._id?.slice(-6)}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        {apt.status}
                      </span>
                    </div>

                    {/* Gardener */}
                    <div className="bg-[#f7f9f6] rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Gardener</p>
                        <p className="text-sm font-bold text-gray-900">{apt.gardenerName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{apt.gardenerRating}</span>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-[#3d6b45]" />
                        {new Date(apt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#3d6b45]" />
                        {apt.time}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex gap-2 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-[#3d6b45] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{apt.location}</span>
                    </div>

                    {/* Note */}
                    {apt.note && (
                      <p className="text-xs text-gray-400 italic border-t border-[#f0f4ee] pt-3 line-clamp-2">
                        "{apt.note}"
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-1 border-t border-[#f0f4ee]">
                      <span className="text-xs text-gray-400">
                        {new Date(apt.createdAt).toLocaleDateString("en-IN")}
                      </span>
                      {(apt.status === "Pending" || apt.status === "Accepted" || apt.status === "Rescheduled") && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setRescheduleData({ apt, date: "", time: "" })}
                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(apt)}
                            disabled={cancelling === apt._id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium transition-colors disabled:opacity-50"
                          >
                            {cancelling === apt._id ? "Cancelling..." : "Cancel"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />

      {/* Reschedule Modal */}
      {rescheduleData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Reschedule</h3>
                <p className="text-xs text-gray-500 mt-1">Select a new date and time</p>
              </div>
              <button onClick={() => setRescheduleData(null)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">New Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split("T")[0]}
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData(prev => ({...prev, date: e.target.value}))}
                  className="w-full border border-[#c8d9c0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#3d6b45] focus:ring-1 focus:ring-[#3d6b45]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">New Time</label>
                <select 
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData(prev => ({...prev, time: e.target.value}))}
                  className="w-full border border-[#c8d9c0] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#3d6b45] focus:ring-1 focus:ring-[#3d6b45]"
                >
                  <option value="">Select a time...</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {rescheduleError && <p className="text-xs text-red-500">{rescheduleError}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => setRescheduleData(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleReschedule}
                disabled={rescheduling}
                className="px-4 py-2 text-sm font-semibold bg-[#3d6b45] text-white rounded-xl hover:bg-[#345c3c] disabled:opacity-50 transition-colors"
              >
                {rescheduling ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}