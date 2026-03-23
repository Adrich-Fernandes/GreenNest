import { useState } from "react";
import { Plus, Eye, Pencil, Trash2, X, Upload } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const initialProducts = [
  { id: 1, name: "Gardening Tool Kit", category: "Tools", price: "₹599", stock: 24, status: "Active" },
  { id: 2, name: "Bougainvillea", category: "Flowering", price: "₹275", stock: 12, status: "Active" },
  { id: 3, name: "Aloe Vera", category: "Indoor", price: "₹179", stock: 38, status: "Active" },
  { id: 4, name: "Ficus Tree", category: "Outdoor", price: "₹899", stock: 0, status: "Out of Stock" },
  { id: 5, name: "Sunflower Seeds", category: "Seeds", price: "₹89", stock: 150, status: "Active" },
  { id: 6, name: "Ceramic Pot", category: "Pots", price: "₹450", stock: 7, status: "Low Stock" },
];

const statusStyles = {
  Active: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  "Out of Stock": "bg-red-50 text-red-500 border-red-200",
  "Low Stock": "bg-amber-50 text-amber-700 border-amber-200",
};

const categories = ["Tools", "Flowering", "Indoor", "Outdoor", "Seeds", "Pots", "Fertilizers", "Other"];

const emptyForm = { name: "", category: "", price: "", stock: "", description: "" };

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (form.stock === "" || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = "Enter a valid stock quantity";
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
    const stock = Number(form.stock);
    const status = stock === 0 ? "Out of Stock" : stock <= 10 ? "Low Stock" : "Active";
    setProducts((prev) => [
      { id: prev.length + 1, name: form.name.trim(), category: form.category, price: `₹${Number(form.price).toLocaleString("en-IN")}`, stock, status },
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your plant and product listings</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ede6]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-[#f0f4ee]">
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Price</th>
                  <th className="text-left px-6 py-3 font-medium">Stock</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className={`border-b border-[#f0f4ee] hover:bg-[#fafcfa] transition-colors ${i === products.length - 1 ? "border-0" : ""}`}>
                    <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500">{p.category}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{p.price}</td>
                    <td className="px-6 py-4 text-gray-500">{p.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusStyles[p.status]}`}>
                        {p.status}
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

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col" style={{ animation: "fadeUp 0.2s ease" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8ede6]">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in the details to list a new product</p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-[#f0f4ee] rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Image</label>
                <div className="border-2 border-dashed border-[#c8d9c0] rounded-xl p-5 flex flex-col items-center gap-1.5 bg-[#fafcfa] hover:border-[#3d6b45] transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-full bg-[#f0f4ee] flex items-center justify-center group-hover:bg-[#e0ecdf] transition-colors">
                    <Upload className="w-4 h-4 text-[#3d6b45]" />
                  </div>
                  <p className="text-sm text-gray-400"><span className="text-[#3d6b45] font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-300">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Peace Lily"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] ${errors.name ? "border-red-300 bg-red-50" : "border-[#e8ede6] hover:border-[#c8d9c0]"}`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="category" value={form.category} onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] bg-white cursor-pointer ${errors.category ? "border-red-300 bg-red-50" : "border-[#e8ede6] hover:border-[#c8d9c0]"}`}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
              </div>

              {/* Price & Stock */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Price (₹) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                    <input
                      type="number" name="price" value={form.price} onChange={handleChange} placeholder="0" min="0"
                      className={`w-full border rounded-xl pl-7 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] ${errors.price ? "border-red-300 bg-red-50" : "border-[#e8ede6] bg-white hover:border-[#c8d9c0]"}`}
                    />
                  </div>
                  {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Stock <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" min="0"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] ${errors.stock ? "border-red-300 bg-red-50" : "border-[#e8ede6] bg-white hover:border-[#c8d9c0]"}`}
                  />
                  {errors.stock && <p className="text-xs text-red-400 mt-1">{errors.stock}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description <span className="text-gray-300 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  name="description" value={form.description} onChange={handleChange}
                  placeholder="Brief description of the product..." rows={3}
                  className="w-full border border-[#e8ede6] rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] hover:border-[#c8d9c0] bg-white resize-none"
                />
              </div>

              {/* Status hint */}
              <div className="bg-[#f6f9f5] border border-[#e0ecdf] rounded-xl px-4 py-3 flex gap-2 items-start">
                <span className="text-[#3d6b45] text-sm">ℹ</span>
                <p className="text-xs text-[#3d6b45]">
                  Status is set automatically: <strong>Active</strong> (stock &gt; 10), <strong>Low Stock</strong> (1–10), <strong>Out of Stock</strong> (0).
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e8ede6] flex gap-3">
              <button onClick={handleClose} className="flex-1 border border-[#e8ede6] text-gray-500 hover:bg-[#f6f9f5] text-sm font-semibold py-2.5 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Product
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