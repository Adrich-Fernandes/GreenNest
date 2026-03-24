import { useState } from "react";
import { Plus, Eye, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const initialGardeners = [
  { id: 1, name: "Rajesh Kumar", location: "Mumbai", services: "Home Gardening, Lawn", rating: 4.8, status: "Active" },
  { id: 2, name: "Priya Sharma", location: "Delhi", services: "Plant Care & Pruning", rating: 4.9, status: "Active" },
  { id: 3, name: "Amit Patel", location: "Bangalore", services: "Lawn Maintenance", rating: 4.5, status: "Active" },
  { id: 4, name: "Sunita Rao", location: "Chennai", services: "Home Gardening", rating: 4.7, status: "Inactive" },
  { id: 5, name: "Meena Joshi", location: "Hyderabad", services: "All Services", rating: 4.8, status: "Active" },
];

const statusStyles = {
  Active: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  Inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

const serviceOptions = ["Home Gardening", "Lawn Maintenance", "Plant Care & Pruning", "All Services", "Landscaping", "Tree Trimming"];

const emptyForm = { name: "", location: "", services: "", rating: "", status: "Active" };

export default function Gardners() {
  const [gardeners, setGardeners] = useState(initialGardeners);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.services.trim()) e.services = "Services are required";
    if (!form.rating || isNaN(Number(form.rating)) || Number(form.rating) < 1 || Number(form.rating) > 5)
      e.rating = "Enter a rating between 1 and 5";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setGardeners((prev) => [
      { id: prev.length + 1, name: form.name.trim(), location: form.location.trim(), services: form.services.trim(), rating: parseFloat(Number(form.rating).toFixed(1)), status: form.status },
      ...prev,
    ]);
    setShowModal(false);
    setForm(emptyForm);
    setErrors({});
  };

  const handleClose = () => { setShowModal(false); setForm(emptyForm); setErrors({}); };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gardeners</h1>
            <p className="text-sm text-gray-400 mt-1">Manage verified gardening professionals</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Gardener
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ede6]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-[#f0f4ee]">
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Location</th>
                  <th className="text-left px-6 py-3 font-medium">Services</th>
                  <th className="text-left px-6 py-3 font-medium">Rating</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gardeners.map((g, i) => (
                  <tr key={g.id} className={`border-b border-[#f0f4ee] hover:bg-[#fafcfa] transition-colors ${i === gardeners.length - 1 ? "border-0" : ""}`}>
                    <td className="px-6 py-4 font-semibold text-gray-800">{g.name}</td>
                    <td className="px-6 py-4 text-gray-500">{g.location}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-[180px] truncate">{g.services}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="font-semibold text-gray-700">{g.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusStyles[g.status]}`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-[#f0f4ee] rounded-lg text-gray-400 hover:text-[#3d6b45] transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-[#f0f4ee] rounded-lg text-gray-400 hover:text-[#3d6b45] transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Gardener Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col" style={{ animation: "fadeUp 0.2s ease" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8ede6]">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Add New Gardener</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in the details to register a professional</p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-[#f0f4ee] rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rajesh Kumar"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] ${errors.name ? "border-red-300 bg-red-50" : "border-[#e8ede6] hover:border-[#c8d9c0]"}`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Mumbai"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] ${errors.location ? "border-red-300 bg-red-50" : "border-[#e8ede6] hover:border-[#c8d9c0]"}`}
                />
                {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
              </div>

              {/* Services */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Services <span className="text-red-400">*</span>
                </label>
                <select
                  name="services" value={form.services} onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] bg-white cursor-pointer ${errors.services ? "border-red-300 bg-red-50" : "border-[#e8ede6] hover:border-[#c8d9c0]"}`}
                >
                  <option value="" disabled>Select a service</option>
                  {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.services && <p className="text-xs text-red-400 mt-1">{errors.services}</p>}
              </div>

              {/* Rating & Status */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Rating <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-sm">★</span>
                    <input
                      type="number" name="rating" value={form.rating} onChange={handleChange}
                      placeholder="4.5" min="1" max="5" step="0.1"
                      className={`w-full border rounded-xl pl-7 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] ${errors.rating ? "border-red-300 bg-red-50" : "border-[#e8ede6] bg-white hover:border-[#c8d9c0]"}`}
                    />
                  </div>
                  {errors.rating && <p className="text-xs text-red-400 mt-1">{errors.rating}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    name="status" value={form.status} onChange={handleChange}
                    className="w-full border border-[#e8ede6] rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] bg-white cursor-pointer hover:border-[#c8d9c0]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e8ede6] flex gap-3">
              <button onClick={handleClose} className="flex-1 border border-[#e8ede6] text-gray-500 hover:bg-[#f6f9f5] text-sm font-semibold py-2.5 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Gardener
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(16px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </AdminLayout>
  );
}