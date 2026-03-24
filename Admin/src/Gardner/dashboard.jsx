import { useState } from "react";
import { Calendar, Clock, MapPin, User, Check, X, ChevronDown, Bell, Leaf } from "lucide-react";
import GardenerNavBar from "../components/GardenerNavBar";

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

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Accepted: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  Canceled: "bg-red-50 text-red-500 border-red-200",
  Rejected: "bg-red-50 text-red-500 border-red-200", // Legacy support
  Completed: "bg-blue-50 text-blue-700 border-blue-200",
  Rescheduled: "bg-purple-50 text-purple-700 border-purple-200",
};

const tabs = ["All", "Pending", "Accepted", "Completed", "Canceled", "Rescheduled"];

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
      prev.map((a) => a.id === id ? { ...a, status: "Canceled" } : a)
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
      prev.map((a) => a.id === id ? { ...a, date: editDate, time: editTime, status: "Rescheduled" } : a)
    );
    setEditingId(null);
  };

  const counts = {
    All: appointments.length,
    Pending: appointments.filter((a) => a.status === "Pending").length,
    Accepted: appointments.filter((a) => a.status === "Accepted").length,
    Completed: appointments.filter((a) => a.status === "Completed").length,
    Canceled: appointments.filter((a) => a.status === "Canceled" || a.status === "Rejected").length,
    Rescheduled: appointments.filter((a) => a.status === "Rescheduled").length,
  };

  return (
    <div className="min-h-screen bg-[#f7f9f6]">
      <GardenerNavBar />
      
      <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
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
            </div>
          </div>

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
            {tabs.map((tab) => (
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
                key={appt.id}
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
                      <span className="font-medium">{new Date(appt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
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
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#f0f4ee] hover:text-[#3d6b45] transition-colors ${editTime === slot ? "text-[#3d6b45] font-semibold bg-[#f0f4ee]" : "text-gray-700"}`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="font-medium">{appt.time} <span className="text-gray-400 font-normal">({appt.duration})</span></span>
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
                  <div className="px-6 py-4 flex flex-wrap gap-2 pt-4">
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
                                onClick={() => handleAccept(appt.id)}
                                className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
                              >
                                <Check className="w-4 h-4" /> Accept
                              </button>
                              <button
                                onClick={() => handleReject(appt.id)}
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
                             onClick={() => setAppointments(prev => prev.map(a => a.id === appt.id ? {...a, status: "Completed"} : a))}
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

      </main>
    </div>
  );
}
