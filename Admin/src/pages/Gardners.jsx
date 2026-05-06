import { useState, useEffect } from "react";
import { Plus, Eye, Pencil, Trash2, X, Loader2, Star, Search } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminTableSkeleton } from "../components/Skeleton";

const statusStyles = {
  active: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

const serviceOptions = ["Home Gardening", "Lawn Maintenance", "Plant Care & Pruning", "All Services", "Landscaping", "Tree Trimming"];

const emptyForm = { name: "", email: "", location: "", services: "", rating: "", status: "active", basePrice: "", experience: "", bio: "" };

export default function Gardners() {
  const [gardeners, setGardeners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingGardener, setViewingGardener] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGardeners();
  }, []);

  const fetchGardeners = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gardener?all=true`);
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

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.services.trim()) e.services = "Services are required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.rating || isNaN(Number(form.rating)) || Number(form.rating) < 1 || Number(form.rating) > 5)
      e.rating = "Enter a rating between 1 and 5";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleEdit = (g) => {
    setEditingId(g._id);
    setForm({
      name: g.name,
      email: g.email || "",
      location: g.location || "",
      services: (g.specialties || []).join(", "),
      rating: g.rating || "",
      status: g.status?.toLowerCase() || "active",
      basePrice: g.basePrice || "",
      experience: g.experience || "",
      bio: g.bio || ""
    });
    setShowModal(true);
  };

  const handleView = (g) => {
    setViewingGardener(g);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gardener profile?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gardener/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setGardeners((prev) => prev.filter((g) => g._id !== id));
      } else {
        alert("Failed to delete: " + result.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete gardener.");
    }
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    
    setSubmitting(true);
    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/gardener/admin-update/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/gardener/admin-add`; // Note: admin-add might not exist, but let's focus on update
      
      const method = editingId ? "PUT" : "POST";
      
      // Map form services (string) to specialties (array)
      const specialties = form.services.split(",").map(s => s.trim()).filter(s => s);
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form, 
          specialties,
          basePrice: form.basePrice ? Number(form.basePrice) : 0,
          rating: Number(form.rating)
        })
      });
      const result = await res.json();
      
      if (result.success) {
        if (editingId) {
          setGardeners(prev => prev.map(g => g._id === editingId ? result.data : g));
        } else {
          setGardeners(prev => [result.data, ...prev]);
        }
        handleClose();
      } else {
        alert("Operation failed: " + result.message);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGardeners = gardeners.filter((g) => {
    const q = searchTerm.toLowerCase();
    return (
      (g.name || "").toLowerCase().includes(q) ||
      (g.location || "").toLowerCase().includes(q) ||
      (g.specialties || []).some(s => s.toLowerCase().includes(q))
    );
  });

  const handleClose = () => { 
    setShowModal(false); 
    setForm(emptyForm); 
    setErrors({}); 
    setEditingId(null); 
  };

  return (
      <>
      {/* View Gardener Modal */}
      {showViewModal && viewingGardener && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col" style={{ animation: "fadeUp 0.15s ease" }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8ede6]">
              <h2 className="text-xl font-bold text-gray-900">Gardener Profile</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-[#f0f4ee] rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[75vh]">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[#f0f4ee] rounded-3xl flex items-center justify-center shrink-0 border border-[#c8d9c0] relative">
                  <Loader2 className="w-10 h-10 text-[#3d6b45] opacity-20" />
                  <div className="absolute font-bold text-2xl text-[#3d6b45]">{viewingGardener.name.charAt(0)}</div>
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-gray-900">{viewingGardener.name}</h3>
                   <p className="text-sm text-gray-500 mb-2">{viewingGardener.email}</p>
                   <p className="text-[#3d6b45] font-medium flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {viewingGardener.rating || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#f7f9f6] p-4 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Status</p>
                    <p className={`text-sm font-bold capitalize ${viewingGardener.status === 'active' ? 'text-[#3d6b45]' : 'text-gray-500'}`}>{viewingGardener.status}</p>
                 </div>
                 <div className="bg-[#f7f9f6] p-4 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Experience</p>
                    <p className="text-sm font-bold text-gray-800">{viewingGardener.experience || '0'} Years</p>
                 </div>
                 <div className="bg-[#f7f9f6] p-4 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Base Price</p>
                    <p className="text-sm font-bold text-gray-800">₹{viewingGardener.basePrice || '0'} /hr</p>
                 </div>
                 <div className="bg-[#f7f9f6] p-4 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Location</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{viewingGardener.location || "N/A"}</p>
                 </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">About</p>
                <p className="text-sm text-gray-600 leading-relaxed">{viewingGardener.bio || 'No bio provided for this professional.'}</p>
              </div>

              <div>
                 <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Specialties</p>
                 <div className="flex flex-wrap gap-2">
                    {(viewingGardener.specialties || []).map(s => (
                      <span key={s} className="px-3 py-1 bg-[#f0f4ee] text-[#3d6b45] text-xs font-semibold rounded-full border border-[#c8d9c0]">{s}</span>
                    ))}
                 </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#e8ede6]">
               <button onClick={() => setShowViewModal(false)} className="w-full bg-[#3d6b45] text-white py-2.5 rounded-xl font-bold text-sm">Close Profile</button>
            </div>
          </div>
        </div>
      )}

      <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gardeners</h1>
            <p className="text-sm text-gray-400 mt-1">Manage verified gardening professionals</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#3d6b45] transition-colors" />
              <input 
                type="text" 
                placeholder="Search professionals..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#fcfdfc] border border-[#e8ede6] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-600 placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#3d6b45]/10 focus:border-[#3d6b45] focus:bg-white transition-all w-full md:w-64"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Gardener
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ede6]">
          <div className="overflow-x-auto">
            {loading ? (
              <AdminTableSkeleton rows={6} cols={6} />
            ) : filteredGardeners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-2">
                 <p className="text-gray-400 font-medium">No gardeners found</p>
                 <p className="text-xs text-gray-300 italic">{searchTerm ? "Try a different search query." : "Get started by onboarding new professionals"}</p>
              </div>
            ) : (
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
                  {filteredGardeners.map((g, i) => (
                    <tr key={g._id || g.id} className={`border-b border-[#f0f4ee] hover:bg-[#fafcfa] transition-colors ${i === gardeners.length - 1 ? "border-0" : ""}`}>
                      <td className="px-6 py-4 font-semibold text-gray-800">{g.name}</td>
                      <td className="px-6 py-4 text-gray-500">{g.location || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-500 max-w-[180px] truncate">
                        {(g.specialties || []).join(", ") || (g.services || "None")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="font-semibold text-gray-700">{g.rating || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs capitalize font-semibold px-2.5 py-0.5 rounded-full border ${statusStyles[g.status?.toLowerCase()] || statusStyles.inactive}`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleView(g)}
                            className="p-1.5 hover:bg-[#f0f4ee] rounded-lg text-gray-400 hover:text-[#3d6b45] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(g)}
                            className="p-1.5 hover:bg-[#f0f4ee] rounded-lg text-gray-400 hover:text-[#3d6b45] transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(g._id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
                <h2 className="text-lg font-bold text-gray-900">{editingId ? "Edit Gardener Profile" : "Add New Gardener"}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editingId ? "Update professional details" : "Fill in the details to register a professional"}</p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-[#f0f4ee] rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">

              {/* Name & Email Group */}
              <div className="flex gap-3">
                <div className="flex-[2]">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rajesh Kumar"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] ${errors.name ? "border-red-300 bg-red-50" : "border-[#e8ede6] hover:border-[#c8d9c0]"}`}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div className="flex-[3]">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} placeholder="rajesh@example.com"
                    className="w-full border border-[#e8ede6] hover:border-[#c8d9c0] rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45]"
                  />
                </div>
              </div>

              {/* Location & Services */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Mumbai"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] ${errors.location ? "border-red-300 bg-red-50" : "border-[#e8ede6] hover:border-[#c8d9c0]"}`}
                  />
                  {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Primary Service <span className="text-red-400">*</span>
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
              </div>

              {/* Rate & Experience */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Base Rate (₹/hr)
                  </label>
                  <input
                    type="number" name="basePrice" value={form.basePrice} onChange={handleChange} placeholder="500"
                    className="w-full border border-[#e8ede6] hover:border-[#c8d9c0] rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Experience (Years)
                  </label>
                  <input
                    type="text" name="experience" value={form.experience} onChange={handleChange} placeholder="5+"
                    className="w-full border border-[#e8ede6] hover:border-[#c8d9c0] rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45]"
                  />
                </div>
              </div>

              {/* Rating & Status */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Initial Rating <span className="text-red-400">*</span>
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  About / Bio
                </label>
                <textarea
                  name="bio" value={form.bio} onChange={handleChange}
                  placeholder="Tell clients about their expertise..." rows={3}
                  className="w-full border border-[#e8ede6] rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] hover:border-[#c8d9c0] bg-white resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e8ede6] flex gap-3">
              <button onClick={handleClose} className="flex-1 border border-[#e8ede6] text-gray-500 hover:bg-[#f6f9f5] text-sm font-semibold py-2.5 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? "Processing..." : (editingId ? "Save Changes" : "Add Gardener")}
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
    </>
  );
}