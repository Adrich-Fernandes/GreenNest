import { useState } from "react";
import { Calendar, Clock, MapPin, User, Check, X, ChevronDown, Bell, Leaf } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

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
    status: "Rejected",
  },
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Accepted: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  Rejected: "bg-red-50 text-red-500 border-red-200",
  Completed: "bg-blue-50 text-blue-700 border-blue-200",
};

const tabs = ["All", "Pending", "Accepted", "Completed", "Rejected"];

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM",
];

export default function GardnerAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const filtered = activeTab === "All"
    ? appointments
    : appointments.filter((a) => a.status === activeTab);

  const handleAccept = (id) => {
    setAppointments((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: "Accepted" } : a)
    );
  };

  const handleReject = (id) => {
    setAppointments((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: "Rejected" } : a)
    );
  };

  const handleReschedule = (appt) => {
    setEditingId(appt.id);
    setEditDate(appt.date);
    setEditTime(appt.time);
    setTimeDropdownOpen(false);
  };

  const handleSaveReschedule = (id) => {
    setAppointments((prev) =>
      prev.map((a) => a.id === id ? { ...a, date: editDate, time: editTime } : a)
    );
    setEditingId(null);
  };

  const counts = {
    All: appointments.length,
    Pending: appointments.filter((a) => a.status === "Pending").length,
    Accepted: appointments.filter((a) => a.status === "Accepted").length,
    Completed: appointments.filter((a) => a.status === "Completed").length,
    Rejected: appointments.filter((a) => a.status === "Rejected").length,
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                My Appointments
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Manage and respond to your service requests
              </p>
            </div>
            <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-2 bg-[#f0f4ee] border border-[#c8d9c0] rounded-xl px-4 py-2">
                <div className="w-7 h-7 bg-[#3d6b45] rounded-full flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#3d6b45]">Rajesh Kumar</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Pending", count: counts.Pending, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
              { label: "Accepted", count: counts.Accepted, color: "text-[#3d6b45]", bg: "bg-[#f0f4ee] border-[#c8d9c0]" },
              { label: "Completed", count: counts.Completed, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
              { label: "Rejected", count: counts.Rejected, color: "text-red-500", bg: "bg-red-50 border-red-200" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-2xl border px-5 py-4 flex flex-col gap-1 ${stat.bg}`}>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.count}</span>
                <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  activeTab === tab
                    ? "bg-[#3d6b45] text-white"
                    : "bg-white border border-[#c8d9c0] text-gray-600 hover:border-[#3d6b45] hover:text-[#3d6b45]"
                }`}
              >
                {tab}
                {counts[tab] > 0 && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
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
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg font-medium">No appointments found</p>
                <p className="text-sm mt-1">No {activeTab.toLowerCase()} appointments at the moment</p>
              </div>
            )}

            {filtered.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-2xl border border-[#e8ede6] shadow-sm overflow-hidden"
              >
                {/* Card Header */}
                <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-[#f0f4ee] rounded-full flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[#3d6b45]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-base">{appt.customer}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusStyles[appt.status]}`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#3d6b45] font-medium mt-0.5">{appt.service}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(expandedId === appt.id ? null : appt.id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#3d6b45] transition-colors self-end sm:self-auto"
                  >
                    {expandedId === appt.id ? "Hide details" : "View details"}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedId === appt.id ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {/* Info Row */}
                <div className="px-6 pb-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[#3d6b45]" />
                    {editingId === appt.id ? (
                      <input
                        type="date"
                        value={editDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="text-xs border border-[#c8d9c0] rounded-lg px-2 py-1 outline-none focus:border-[#3d6b45] transition-colors"
                      />
                    ) : (
                      <span>{new Date(appt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#3d6b45]" />
                    {editingId === appt.id ? (
                      <div className="relative">
                        <button
                          onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                          className="flex items-center gap-1 text-xs border border-[#c8d9c0] rounded-lg px-2 py-1 bg-white hover:border-[#3d6b45] transition-colors"
                        >
                          {editTime}
                          <ChevronDown className="w-3 h-3 text-gray-400" />
                        </button>
                        {timeDropdownOpen && (
                          <div className="absolute top-full mt-1 left-0 bg-white border border-[#c8d9c0] rounded-xl shadow-lg z-20 w-36 py-1 overflow-hidden">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => { setEditTime(slot); setTimeDropdownOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f0f4ee] hover:text-[#3d6b45] transition-colors ${editTime === slot ? "text-[#3d6b45] font-semibold bg-[#f0f4ee]" : "text-gray-700"}`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span>{appt.time} · {appt.duration}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#3d6b45]" />
                    <span>{appt.location}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === appt.id && (
                  <div className="px-6 pb-4">
                    <div className="bg-[#f7f9f6] border border-[#e8ede6] rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Customer Note</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{appt.note}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {(appt.status === "Pending" || appt.status === "Accepted" || editingId === appt.id) && (
                  <div className="px-6 pb-5 flex flex-wrap gap-2 border-t border-[#f0f4ee] pt-4">
                    {editingId === appt.id ? (
                      <>
                        <button
                          onClick={() => handleSaveReschedule(appt.id)}
                          className="flex items-center gap-1.5 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center gap-1.5 bg-white border border-[#c8d9c0] text-gray-600 hover:border-gray-400 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {appt.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleAccept(appt.id)}
                              className="flex items-center gap-1.5 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              onClick={() => handleReject(appt.id)}
                              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleReschedule(appt)}
                          className="flex items-center gap-1.5 bg-white border border-[#c8d9c0] text-[#3d6b45] hover:border-[#3d6b45] hover:bg-[#f0f4ee] text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                        >
                          <Calendar className="w-3.5 h-3.5" /> Reschedule
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

      </div>
    </AdminLayout>
  );
}
