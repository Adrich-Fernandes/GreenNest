import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Calendar, Clock, MapPin, User, Check, X, ChevronDown,
  Bell, Leaf, Plus, Pencil, Trash2, PauseCircle, PlayCircle,
  Tag, IndianRupee,
} from "lucide-react";
import GardenerNavBar from "../components/GardenerNavBar";

// ─── Appointments Data ───────────────────────────────────────────────────────

const initialAppointments = [
  {
    id: 1,
    customer: "Ananya Mehta",
    location: "Bandra West, Mumbai",
    service: "Home Gardening",
    date: "2026-03-25",
    time: "10:00 AM",
    duration: "2 hours",
    note: "Need help setting up a small terrace garden with pots.",
    status: "Pending",
  },
  {
    id: 2,
    customer: "Rohan Verma",
    location: "Lajpat Nagar, Delhi",
    service: "Lawn Maintenance",
    date: "2026-03-26",
    time: "09:00 AM",
    duration: "3 hours",
    note: "Monthly lawn mowing and trimming.",
    status: "Pending",
  },
  {
    id: 3,
    customer: "Sneha Iyer",
    location: "Koramangala, Bangalore",
    service: "Plant Care & Pruning",
    date: "2026-03-27",
    time: "11:00 AM",
    duration: "1.5 hours",
    note: "Pruning and health check for indoor plants.",
    status: "Accepted",
  },
  {
    id: 4,
    customer: "Karan Patel",
    location: "Powai, Mumbai",
    service: "Home Gardening",
    date: "2026-03-28",
    time: "02:00 PM",
    duration: "2 hours",
    note: "Setting up a kitchen herb garden.",
    status: "Completed",
  },
  {
    id: 5,
    customer: "Divya Nair",
    location: "T Nagar, Chennai",
    service: "Lawn Maintenance",
    date: "2026-03-29",
    time: "08:00 AM",
    duration: "2.5 hours",
    note: "Full garden cleanup after monsoon.",
    status: "Canceled",
  },
  {
    id: 6,
    customer: "Vikram Shah",
    location: "Andheri East, Mumbai",
    service: "Landscaping",
    date: "2026-03-30",
    time: "04:00 PM",
    duration: "4 hours",
    note: "Consultation for a new garden layout.",
    status: "Rescheduled",
  },
];

// ─── Services Data ────────────────────────────────────────────────────────────

const CATEGORY_ICONS = {
  "Lawn Maintenance": "🌿",
  "Home Gardening": "🪴",
  "Landscaping": "🏡",
  "Plant Care & Pruning": "✂️",
  "Irrigation Setup": "💧",
  "Pest Control": "🐛",
  "Seasonal Cleanup": "🍂",
  "Other": "🌱",
};

const CATEGORIES = Object.keys(CATEGORY_ICONS);

const DURATIONS = [
  "1 hour", "1.5 hours", "2 hours", "2.5 hours",
  "3 hours", "4 hours", "Half day", "Full day",
];

const initialServices = [
  {
    id: 1,
    name: "Lawn Mowing & Trimming",
    category: "Lawn Maintenance",
    price: 800,
    duration: "2 hours",
    desc: "Complete lawn mowing, edge trimming, and cleanup of grass clippings.",
    active: true,
  },
  {
    id: 2,
    name: "Terrace Garden Setup",
    category: "Home Gardening",
    price: 2500,
    duration: "4 hours",
    desc: "Design and setup of a beautiful terrace garden with pots, soil, and plants.",
    active: true,
  },
  {
    id: 3,
    name: "Indoor Plant Care",
    category: "Plant Care & Pruning",
    price: 600,
    duration: "1.5 hours",
    desc: "Health check, pruning, repotting, and fertilising of indoor plants.",
    active: true,
  },
  {
    id: 4,
    name: "Garden Landscape Design",
    category: "Landscaping",
    price: 5000,
    duration: "Full day",
    desc: "Full consultation and implementation of a custom garden landscape layout.",
    active: false,
  },
];

const emptyForm = { name: "", category: "", price: "", duration: "2 hours", desc: "" };

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
  const location = useLocation();
  const navigate = useNavigate();
  
  // Page-level tab: "appointments" | "services"
  const page = location.pathname.includes("/services") ? "services" : "appointments";

  // ── Dashboard state ──
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // ── Service state ──
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const API_BASE = "http://localhost:8000/api/gardener";

  // ── Fetch Data ──
  useEffect(() => {
    if (userLoaded && user) fetchData();
  }, [userLoaded, user]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/${user.id}`);
      const result = await res.json();
      if (result.success) {
        setServices(result.data.services || []);
        setAppointments(result.data.appointments || []);
      }
    } catch (err) {
      console.error("Failed to fetch gardener data:", err);
    } finally {
      setLoading(false);
    }
  };

  const syncServicesToBackend = async (newServices) => {
    try {
      const res = await fetch(`${API_BASE}/sync-services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: user.id, services: newServices }),
      });
      return await res.json();
    } catch (err) {
      console.error("Sync failed:", err);
    }
  };

  const updateApptStatusOnBackend = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/appointment-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  // ── Service helpers ──
  const serviceCounts = {
    total: services.length,
    active: services.filter((s) => s.active).length,
    paused: services.filter((s) => !s.active).length,
  };

  const openAdd = () => {
    setEditingServiceId(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditingServiceId(service._id);
    setForm({
      name: service.name,
      category: service.category,
      price: String(service.price),
      duration: service.duration,
      desc: service.desc,
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingServiceId(null);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Service name is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    return e;
  };

  const handleSaveService = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      duration: form.duration,
      desc: form.desc.trim(),
    };

    let newServices;
    if (editingServiceId) {
      newServices = services.map((s) => s._id === editingServiceId ? { ...s, ...payload } : s);
    } else {
      newServices = [...services, { ...payload, active: true }];
    }

    const res = await syncServicesToBackend(newServices);
    if (res?.success) setServices(res.data);
    closeModal();
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleToggleService = async (id) => {
    const newServices = services.map((s) => s._id === id ? { ...s, active: !s.active } : s);
    const res = await syncServicesToBackend(newServices);
    if (res?.success) setServices(res.data);
  };

  const handleDeleteService = async (id) => {
    const newServices = services.filter((s) => s._id !== id);
    const res = await syncServicesToBackend(newServices);
    if (res?.success) {
      setServices(res.data);
      setDeleteConfirmId(null);
    }
  };

  const handleMarkComplete = async (id) => {
    const res = await updateApptStatusOnBackend({ appointmentId: id, status: "Completed" });
    if (res?.success) setAppointments(res.data);
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
              {page === "appointments" ? "My Appointments" : "My Services"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {page === "appointments"
                ? "Manage and respond to your service requests"
                : "Manage the services you offer to customers"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Page switcher */}
            <div className="flex bg-white border border-[#c8d9c0] rounded-xl overflow-hidden">
              {["appointments", "services"].map((p) => (
                <button
                  key={p}
                  onClick={() => navigate(p === "appointments" ? "/gardener/dashboard" : "/gardener/services")}
                  className={`px-4 py-2 text-sm font-semibold transition-colors capitalize ${
                    page === p
                      ? "bg-[#3d6b45] text-white"
                      : "text-gray-500 hover:text-[#3d6b45]"
                  }`}
                >
                  {p === "appointments" ? "Appointments" : "My Services"}
                </button>
              ))}
            </div>

            {page === "appointments" ? (
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
            ) : (
              <button
                onClick={openAdd}
                className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add Service
              </button>
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
                          <Leaf className="w-3.5 h-3.5" /> {appt.service}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedId(expandedId === appt.id ? null : appt.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#3d6b45] bg-[#f7f9f6] px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#c8d9c0]"
                    >
                      {expandedId === appt.id ? "Minimize" : "Details"}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedId === appt.id ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {/* Info Row */}
                  <div className="px-6 pb-5 flex flex-wrap gap-6 border-b border-[#f0f4ee]/50">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 text-[#3d6b45]" />
                      {editingId === appt.id ? (
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
                      {editingId === appt.id ? (
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
                  {expandedId === appt.id && (
                    <div className="px-6 py-4 bg-[#fcfdfc] border-b border-[#f0f4ee]/50">
                      <div className="bg-white border border-[#e8ede6] rounded-xl p-4 shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Customer Note</p>
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{appt.note}"</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {(appt.status === "Pending" || appt.status === "Accepted" || appt.status === "Rescheduled" || editingId === appt.id) && (
                    <div className="px-6 py-4 flex flex-wrap gap-2">
                      {editingId === appt.id ? (
                        <>
                          <button
                            onClick={() => handleSaveReschedule(appt.id)}
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
            SERVICES VIEW
        ══════════════════════════════════════════════════════════════════════ */}
        {page === "services" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Services", count: serviceCounts.total, color: "text-[#3d6b45]", bg: "bg-[#f0f4ee] border-[#c8d9c0]" },
                { label: "Active", count: serviceCounts.active, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
                { label: "Paused", count: serviceCounts.paused, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-2xl border px-5 py-4 flex flex-col gap-1 transition-all hover:shadow-sm ${stat.bg}`}>
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.count}</span>
                  <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Service List */}
            <div className="flex flex-col gap-4">
              {services.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#c8d9c0] text-gray-400">
                  <Leaf className="w-10 h-10 mx-auto text-[#c8d9c0] mb-3 opacity-50" />
                  <p className="text-lg font-semibold text-gray-900">No services yet</p>
                  <p className="text-sm mt-1">Click "Add Service" to list your first offering</p>
                </div>
              )}

              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl border border-[#e8ede6] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="px-6 py-5 flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-[#f0f4ee] border border-[#c8d9c0]/40 rounded-2xl flex items-center justify-center shrink-0 text-2xl">
                      {CATEGORY_ICONS[service.category] || "🌱"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-base">{service.name}</h3>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${
                          service.active
                            ? "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {service.active ? "Active" : "Paused"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Tag className="w-3.5 h-3.5 text-[#3d6b45]" />
                          {service.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-[#3d6b45]" />
                          {service.duration}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-bold text-[#3d6b45]">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {service.price.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {service.desc && (
                        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                          {service.desc}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleService(service._id)}
                        title={service.active ? "Pause service" : "Activate service"}
                        className="p-2 rounded-xl border border-[#e8ede6] text-gray-400 hover:text-[#3d6b45] hover:border-[#c8d9c0] hover:bg-[#f0f4ee] transition-all"
                      >
                        {service.active
                          ? <PauseCircle className="w-4 h-4" />
                          : <PlayCircle className="w-4 h-4" />
                        }
                      </button>

                      <button
                        onClick={() => openEdit(service)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border border-[#c8d9c0] text-[#3d6b45] bg-[#f7f9f6] hover:bg-[#f0f4ee] hover:border-[#3d6b45] transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>

                      {deleteConfirmId === service._id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-red-500 font-semibold">Sure?</span>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(service._id)}
                          className="p-2 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Add / Edit Service Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 flex flex-col gap-5">

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingServiceId ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Service Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="e.g. Lawn Mowing & Trimming"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-800 bg-[#f7f9f6] outline-none transition-colors focus:bg-white ${
                  errors.name ? "border-red-300 focus:border-red-400" : "border-[#e8ede6] focus:border-[#3d6b45]"
                }`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => handleFormChange("category", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-800 bg-[#f7f9f6] outline-none transition-colors focus:bg-white ${
                  errors.category ? "border-red-300 focus:border-red-400" : "border-[#e8ede6] focus:border-[#3d6b45]"
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
            </div>

            {/* Price + Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Price (₹) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d6b45]" />
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleFormChange("price", e.target.value)}
                    placeholder="500"
                    min="0"
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm text-gray-800 bg-[#f7f9f6] outline-none transition-colors focus:bg-white ${
                      errors.price ? "border-red-300 focus:border-red-400" : "border-[#e8ede6] focus:border-[#3d6b45]"
                    }`}
                  />
                </div>
                {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Duration</label>
                <select
                  value={form.duration}
                  onChange={(e) => handleFormChange("duration", e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e8ede6] rounded-xl text-sm text-gray-800 bg-[#f7f9f6] outline-none transition-colors focus:bg-white focus:border-[#3d6b45]"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
              <textarea
                value={form.desc}
                onChange={(e) => handleFormChange("desc", e.target.value)}
                placeholder="Briefly describe what this service includes..."
                rows={3}
                className="w-full px-4 py-2.5 border border-[#e8ede6] rounded-xl text-sm text-gray-800 bg-[#f7f9f6] outline-none transition-colors focus:bg-white focus:border-[#3d6b45] resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 border border-[#e8ede6] rounded-xl text-sm font-semibold text-gray-500 hover:border-[#c8d9c0] hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-[#3d6b45] hover:bg-[#345c3c] text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                <Check className="w-4 h-4" />
                {editingServiceId ? "Save Changes" : "Add Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}