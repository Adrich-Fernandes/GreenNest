import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import {
  Calendar, Clock, MapPin, User, Check, X, ChevronDown,
  Bell, Leaf, Save, IndianRupee, Phone, FileText, Pickaxe
} from "lucide-react";
import GardenerNavBar from "../components/GardenerNavBar";

// ─── Specialties Data ────────────────────────────────────────────────────────────

const SPECIALTIES = [
  "Lawn Maintenance",
  "Home Gardening",
  "Landscaping",
  "Plant Care & Pruning",
  "Irrigation Setup",
  "Pest Control",
  "Seasonal Cleanup",
];

// ─── Appointment constants ────────────────────────────────────────────────────

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Accepted: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  Canceled: "bg-red-50 text-red-500 border-red-200",
  Rejected: "bg-red-50 text-red-500 border-red-200",
  Completed: "bg-blue-50 text-blue-700 border-blue-200",
  Rescheduled: "bg-purple-50 text-purple-700 border-purple-200",
};

const apptTabs = ["All", "Pending", "Accepted", "Completed", "Canceled", "Rescheduled"];

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM",
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GardnerAppointments() {
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Page-level tab: "appointments" | "profile"
  const page = location.pathname.includes("/profile") || location.pathname.includes("/services") ? "profile" : "appointments";

  // ── Dashboard state ──
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  
  // ── Profile state ──
  const [profile, setProfile] = useState({
    bio: "",
    basePrice: 0,
    location: "",
    phone: "",
    experience: "",
    specialties: []
  });
  const [savingProfile, setSavingProfile] = useState(false);
  
  const [activeTab, setActiveTab] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/gardener`;

  // ── Fetch Data ──
  useEffect(() => {
    if (userLoaded && user) fetchData();
  }, [userLoaded, user]);

  const fetchData = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setAppointments(result.data.appointments || []);
        setProfile({
          bio: result.data.bio || "",
          basePrice: result.data.basePrice || 0,
          location: result.data.location || "",
          phone: result.data.phone || "",
          experience: result.data.experience || "",
          specialties: result.data.specialties || []
        });
      }
    } catch (err) {
      console.error("Failed to fetch gardener data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileBackend = async () => {
    setSavingProfile(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/update-profile`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ clerkId: user.id, ...profile }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Profile saved successfully!");
      } else {
        alert("Failed to save profile: " + result.message);
      }
    } catch (err) {
      console.error("Sync failed:", err);
      alert("Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const updateApptStatusOnBackend = async (payload) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/appointment-status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ clerkId: user.id, ...payload }),
      });
      return await res.json();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // ── Appointment helpers ──
  const filtered = activeTab === "All"
    ? appointments
    : appointments.filter((a) => a.status === activeTab);

  const counts = {
    All: appointments.length,
    Pending: appointments.filter((a) => a.status === "Pending").length,
    Accepted: appointments.filter((a) => a.status === "Accepted").length,
    Completed: appointments.filter((a) => a.status === "Completed").length,
    Canceled: appointments.filter((a) => a.status === "Canceled" || a.status === "Rejected").length,
    Rescheduled: appointments.filter((a) => a.status === "Rescheduled").length,
  };

  const handleAccept = async (id) => {
    const res = await updateApptStatusOnBackend({ appointmentId: id, status: "Accepted" });
    if (res?.success) setAppointments(res.data);
  };

  const handleReject = async (id) => {
    const res = await updateApptStatusOnBackend({ appointmentId: id, status: "Canceled" });
    if (res?.success) setAppointments(res.data);
  };

  const handleReschedule = (appt) => {
    setEditingId(appt._id);
    setEditDate(appt.date);
    setEditTime(appt.time);
    setTimeDropdownOpen(false);
  };

  const handleSaveReschedule = async (id) => {
    const res = await updateApptStatusOnBackend({ 
      appointmentId: id, 
      status: "Rescheduled",
      date: editDate,
      time: editTime
    });
    if (res?.success) setAppointments(res.data);
    setEditingId(null);
  };

  const handleMarkComplete = async (id) => {
    const res = await updateApptStatusOnBackend({ appointmentId: id, status: "Completed" });
    if (res?.success) setAppointments(res.data);
  };

  // ── Profile helpers ──
  const toggleSpecialty = (spec) => {
    setProfile(prev => {
      if (prev.specialties.includes(spec)) {
        return { ...prev, specialties: prev.specialties.filter(s => s !== spec) };
      } else {
        return { ...prev, specialties: [...prev.specialties, spec] };
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────

  if (loading || !userLoaded) {
    return (
      <div className="min-h-screen bg-[#f7f9f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3d6b45] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#3d6b45] font-semibold animate-pulse">Syncing dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9f6]">
      <GardenerNavBar />

      <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-8">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {page === "appointments" ? "My Appointments" : "My Profile"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {page === "appointments"
                ? "Manage and respond to your service requests"
                : "Manage your professional profile and rates"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Page switcher */}
            <div className="flex bg-white border border-[#c8d9c0] rounded-xl overflow-hidden">
              {["appointments", "profile"].map((p) => (
                <button
                  key={p}
                  onClick={() => navigate(p === "appointments" ? "/gardener/dashboard" : "/gardener/profile")}
                  className={`px-4 py-2 text-sm font-semibold transition-colors capitalize ${
                    page === p
                      ? "bg-[#3d6b45] text-white"
                      : "text-gray-500 hover:text-[#3d6b45]"
                  }`}
                >
                  {p === "appointments" ? "Appointments" : "Profile"}
                </button>
              ))}
            </div>

            {page === "appointments" && (
              <div className="relative">
                <button className="relative p-2.5 bg-white border border-[#c8d9c0] rounded-xl text-gray-400 hover:text-[#3d6b45] hover:border-[#3d6b45] transition-colors">
                  <Bell className="w-5 h-5" />
                  {counts.Pending > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#3d6b45] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {counts.Pending}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            APPOINTMENTS VIEW
        ══════════════════════════════════════════════════════════════════════ */}
        {page === "appointments" && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: "Pending", count: counts.Pending, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
                { label: "Booked", count: counts.Accepted, color: "text-[#3d6b45]", bg: "bg-[#f0f4ee] border-[#c8d9c0]" },
                { label: "Completed", count: counts.Completed, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
                { label: "Canceled", count: counts.Canceled, color: "text-red-500", bg: "bg-red-50 border-red-200" },
                { label: "Rescheduled", count: counts.Rescheduled, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-2xl border px-5 py-4 flex flex-col gap-1 transition-all hover:shadow-sm ${stat.bg}`}>
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.count}</span>
                  <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 flex-wrap pb-2">
              {apptTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeTab === tab
                      ? "bg-[#3d6b45] text-white shadow-md shadow-[#3d6b45]/10"
                      : "bg-white border border-[#c8d9c0] text-gray-600 hover:border-[#3d6b45] hover:text-[#3d6b45]"
                  }`}
                >
                  {tab}
                  {counts[tab] > 0 && (
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {counts[tab]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Appointment Cards */}
            <div className="flex flex-col gap-4">
              {filtered.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#c8d9c0] text-gray-400">
                  <Leaf className="w-10 h-10 mx-auto text-[#c8d9c0] mb-3 opacity-50" />
                  <p className="text-lg font-semibold text-gray-900">No appointments found</p>
                  <p className="text-sm mt-1">No {activeTab.toLowerCase()} appointments at the moment</p>
                </div>
              )}

              {filtered.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white rounded-2xl border border-[#e8ede6] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f0f4ee] rounded-2xl flex items-center justify-center shrink-0 border border-[#c8d9c0]/40">
                        <User className="w-6 h-6 text-[#3d6b45]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-base">{appt.customer}</h3>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${statusStyles[appt.status]}`}>
                            {appt.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#3d6b45] font-medium mt-0.5 flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5" /> {appt.serviceRequired}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="font-black text-gray-900 text-lg flex items-center">
                        <IndianRupee className="w-4 h-4" />{appt.price}
                      </span>
                      <button
                        onClick={() => setExpandedId(expandedId === appt._id ? null : appt._id)}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#3d6b45] transition-colors"
                      >
                        {expandedId === appt._id ? "Minimize details" : "View details"}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedId === appt._id ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="px-6 pb-5 flex flex-wrap gap-6 border-b border-[#f0f4ee]/50">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 text-[#3d6b45]" />
                      {editingId === appt._id ? (
                        <input
                          type="date"
                          value={editDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="text-sm border border-[#c8d9c0] rounded-lg px-2 py-1 outline-none focus:border-[#3d6b45] transition-colors bg-[#f7f9f6]"
                        />
                      ) : (
                        <span className="font-medium">
                          {new Date(appt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="w-4 h-4 text-[#3d6b45]" />
                      {editingId === appt._id ? (
                        <div className="relative">
                          <button
                            onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                            className="flex items-center gap-2 text-sm border border-[#c8d9c0] rounded-lg px-2 py-1 bg-[#f7f9f6] hover:border-[#3d6b45] transition-colors"
                          >
                            {editTime}
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                          {timeDropdownOpen && (
                            <div className="absolute top-full mt-1 left-0 bg-white border border-[#c8d9c0] rounded-xl shadow-xl z-50 w-40 py-1 overflow-hidden">
                              {timeSlots.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => { setEditTime(slot); setTimeDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#f0f4ee] hover:text-[#3d6b45] transition-colors ${
                                    editTime === slot ? "text-[#3d6b45] font-semibold bg-[#f0f4ee]" : "text-gray-700"
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="font-medium">
                          {appt.time} <span className="text-gray-400 font-normal">({appt.duration})</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 text-[#3d6b45]" />
                      <span className="font-medium">{appt.location}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === appt._id && (
                    <div className="px-6 py-4 bg-[#fcfdfc] border-b border-[#f0f4ee]/50">
                      <div className="bg-white border border-[#e8ede6] rounded-xl p-4 shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Customer Note</p>
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{appt.note || "No note provided."}"</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {(appt.status === "Pending" || appt.status === "Accepted" || appt.status === "Rescheduled" || editingId === appt._id) && (
                    <div className="px-6 py-4 flex flex-wrap gap-2">
                      {editingId === appt._id ? (
                        <>
                          <button
                            onClick={() => handleSaveReschedule(appt._id)}
                            className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:scale-105"
                          >
                            <Check className="w-4 h-4" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-2 bg-white border border-[#c8d9c0] text-gray-500 hover:text-gray-700 text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {appt.status === "Pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAccept(appt._id)}
                                className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
                              >
                                <Check className="w-4 h-4" /> Accept
                              </button>
                              <button
                                onClick={() => handleReject(appt._id)}
                                className="flex items-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                              >
                                <X className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => handleReschedule(appt)}
                            className="flex items-center gap-2 bg-white border border-[#c8d9c0] text-[#3d6b45] hover:border-[#3d6b45] hover:bg-[#f0f4ee] text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                          >
                            <Calendar className="w-4 h-4" /> Reschedule
                          </button>
                          {(appt.status === "Accepted" || appt.status === "Rescheduled") && (
                            <button
                              onClick={() => handleMarkComplete(appt._id)}
                              className="flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:scale-105"
                            >
                              <Check className="w-4 h-4" /> Mark Complete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PROFILE VIEW
        ══════════════════════════════════════════════════════════════════════ */}
        {page === "profile" && (
          <div className="bg-white rounded-3xl border border-[#e8ede6] shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-[#f0f4ee] bg-[#fcfdfc] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Professional Details</h2>
                <p className="text-sm text-gray-500 mt-1">This information is shown to customers on your public page.</p>
              </div>
            </div>

            <div className="p-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Contact Info */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-[#f0f4ee] pb-2">Contact & Location</h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="e.g. Bandra West, Mumbai"
                        className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9f6] border border-[#e8ede6] rounded-xl text-sm outline-none focus:bg-white focus:border-[#3d6b45] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9f6] border border-[#e8ede6] rounded-xl text-sm outline-none focus:bg-white focus:border-[#3d6b45] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Rates & Experience */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-[#f0f4ee] pb-2">Rates & Experience</h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Hourly Base Rate (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d6b45]" />
                      <input
                        type="number"
                        min="0"
                        value={profile.basePrice}
                        onChange={(e) => setProfile({ ...profile, basePrice: Number(e.target.value) })}
                        placeholder="e.g. 500"
                        className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9f6] border border-[#e8ede6] rounded-xl text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-[#3d6b45] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Years of Experience</label>
                    <div className="relative">
                      <Pickaxe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text" // string to allow "5+" 
                        value={profile.experience}
                        onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                        placeholder="e.g. 5"
                        className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9f6] border border-[#e8ede6] rounded-xl text-sm outline-none focus:bg-white focus:border-[#3d6b45] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5"><FileText className="w-4 h-4" /> About You</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell clients about your expertise, passion for gardening, and what sets you apart..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#f7f9f6] border border-[#e8ede6] rounded-xl text-sm outline-none focus:bg-white focus:border-[#3d6b45] transition-colors resize-none"
                />
              </div>

              {/* Specialties */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Area of Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map(spec => (
                    <button
                      key={spec}
                      onClick={() => toggleSpecialty(spec)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        profile.specialties.includes(spec)
                          ? "bg-[#3d6b45] text-white border-[#3d6b45] shadow-sm"
                          : "bg-white text-gray-600 border-[#c8d9c0] hover:border-[#3d6b45] hover:text-[#3d6b45]"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-[#f0f4ee] flex justify-end">
                <button
                  onClick={updateProfileBackend}
                  disabled={savingProfile}
                  className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#3d6b45]/20"
                >
                  <Save className="w-5 h-5" />
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}