import { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Star,
  Sprout,
  Scissors,
  Home,
  Trees,
  Search,
} from "lucide-react";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";

/* ── Dummy Data ── */
const MOCK_APPOINTMENTS = [
  {
    _id: "APT-001",
    gardener: { name: "Ramesh Kumar", rating: 4.8 },
    service: "Home Gardening",
    date: "2024-05-10",
    time: "10:00 AM",
    status: "Confirmed",
    amount: 799,
    address: "MG Road, Bengaluru",
  },
  {
    _id: "APT-002",
    gardener: { name: "Suresh Patil", rating: 4.6 },
    service: "Lawn Maintenance",
    date: "2024-05-11",
    time: "9:00 AM",
    status: "Pending",
    amount: 599,
    address: "Koramangala, Bengaluru",
  },
  {
    _id: "APT-003",
    gardener: { name: "Lakshmi Devi", rating: 4.9 },
    service: "Plant Care & Pruning",
    date: "2024-05-08",
    time: "11:30 AM",
    status: "Completed",
    amount: 499,
    address: "Indiranagar, Bengaluru",
  },
  {
    _id: "APT-004",
    gardener: { name: "Meena Sharma", rating: 4.7 },
    service: "Plant Care & Pruning",
    date: "2024-05-15",
    time: "4:00 PM",
    status: "Pending",
    amount: 499,
    address: "Whitefield, Bengaluru",
  },
];

/* ── Status UI ── */
const STATUS_CFG = {
  Pending: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Confirmed: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Completed: {
    color: "text-[#3d6b45]",
    bg: "bg-[#f0f4ee]",
    border: "border-[#c8d9c0]",
  },
  Cancelled: {
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

/* ── Service Icons ── */
const SERVICE_ICONS = {
  "Home Gardening": Home,
  "Lawn Maintenance": Trees,
  "Plant Care & Pruning": Scissors,
};

const FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function Appointments() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  /* ── Cancel ── */
  const handleCancel = (id) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a._id === id ? { ...a, status: "Cancelled" } : a
      )
    );
  };

  /* ── Filter Logic ── */
  const filtered = appointments.filter((apt) => {
    const q = search.toLowerCase();

    const matchSearch =
      !q ||
      apt.gardener.name.toLowerCase().includes(q) ||
      apt.service.toLowerCase().includes(q) ||
      apt._id.toLowerCase().includes(q);

    const matchStatus =
      filter === "All" || apt.status === filter;

    return matchSearch && matchStatus;
  });

  return (
    <>
      <UserNavBar />

      <section className="min-h-screen bg-[#f7f9f6] px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Appointments
            </h1>
            <p className="text-sm text-gray-400">
              Track and manage your bookings
            </p>
          </div>

          {/* Search + Filters */}
          <div className="bg-white p-4 rounded-2xl border border-[#e8ede6] flex flex-wrap gap-3 items-center">

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-[#c8d9c0]"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-xl border ${
                    filter === f
                      ? "bg-[#3d6b45] text-white border-[#3d6b45]"
                      : "bg-white text-gray-500 border-[#e8ede6]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Empty */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-400 text-sm">
                No appointments found.
              </p>
            </div>
          ) : (

            /* Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((apt) => {
                const cfg = STATUS_CFG[apt.status];
                const ServiceIcon =
                  SERVICE_ICONS[apt.service] || Sprout;

                return (
                  <div
                    key={apt._id}
                    className="bg-white rounded-2xl border border-[#e8ede6] shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition"
                  >
                    {/* Top */}
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <div className="w-9 h-9 bg-[#f0f4ee] rounded-xl flex items-center justify-center">
                          <ServiceIcon className="w-4 h-4 text-[#3d6b45]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {apt.service}
                          </p>
                          <p className="text-xs text-gray-400">
                            #{apt._id}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    {/* Gardener */}
                    <div>
                      <p className="text-xs text-gray-400">Gardener</p>
                      <p className="text-sm font-semibold">
                        {apt.gardener.name}
                      </p>
                      <p className="text-xs text-gray-400 flex gap-1 items-center">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {apt.gardener.rating}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-[#3d6b45]" />
                        {new Date(apt.date).toLocaleDateString("en-IN")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#3d6b45]" />
                        {apt.time}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex gap-2 text-xs text-gray-500">
                      <MapPin className="w-4 h-4 text-[#3d6b45]" />
                      {apt.address}
                    </div>

                    {/* Bottom */}
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-lg">
                        ₹{apt.amount}
                      </span>

                      {(apt.status === "Pending" ||
                        apt.status === "Confirmed") && (
                        <button
                          onClick={() => handleCancel(apt._id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                        >
                          Cancel
                        </button>
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
    </>
  );
}