import { useState, useEffect, useRef } from "react";
import { Plus, Eye, Pencil, Trash2, X, Upload, Search } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { AdminTableSkeleton } from "../components/Skeleton";

const API_BASE = "http://localhost:8000/api/products"; 
const CLOUD_NAME = "dxwjpln3g";
const UPLOAD_PRESET = "Green_Nest_Products";

const statusStyles = {
  Active: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  "Out of Stock": "bg-red-50 text-red-500 border-red-200",
  "Low Stock": "bg-amber-50 text-amber-700 border-amber-200",
};

const categories = ["Indoor", "Outdoor", "Flowering", "Seeds", "Pots & Planters", "Tools"];
const emptyForm = { name: "", category: "", price: "", stock: "", description: "", careInstructions: "" };

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return data.secure_url;
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Multiple images state
  const [imageFiles, setImageFiles] = useState([]);         // new File objects to upload
  const [imagePreviews, setImagePreviews] = useState([]);   // blob URLs for new files
  const [existingImages, setExistingImages] = useState([]); // URLs already in DB
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/allProducts`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

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

  // Allow picking multiple images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const totalAfterAdd = existingImages.length + imageFiles.length + files.length;
    if (totalAfterAdd > 5) {
      setErrors((prev) => ({ ...prev, image: "Maximum 5 images allowed" }));
      return;
    }

    const invalid = files.find((f) => !f.type.startsWith("image/"));
    if (invalid) { setErrors((prev) => ({ ...prev, image: "Only image files are allowed" })); return; }

    const oversize = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversize) { setErrors((prev) => ({ ...prev, image: "Each image must be under 5MB" })); return; }

    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    setErrors((prev) => ({ ...prev, image: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove a newly added (not yet uploaded) image
  const handleRemoveNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove an existing (already saved) image
  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);

    try {
      // Upload all new images to Cloudinary
      let newUrls = [];
      if (imageFiles.length > 0) {
        setImageUploading(true);
        try {
          newUrls = await Promise.all(imageFiles.map((f) => uploadToCloudinary(f)));
        } catch (err) {
          setErrors((prev) => ({ ...prev, image: "Image upload failed. Please try again." }));
          setSubmitting(false);
          setImageUploading(false);
          return;
        }
        setImageUploading(false);
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
        careInstructions: form.careInstructions.trim(),
        images: [...existingImages, ...newUrls], // merge existing + new
      };

      const url = editProduct
        ? `${API_BASE}/updateProduct/${editProduct._id}`
        : `${API_BASE}/insertProduct`;
      const method = editProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        handleClose();
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const searchString = searchTerm.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(searchString) ||
      (p.category || "").toLowerCase().includes(searchString)
    );
  });

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || "",
      careInstructions: product.careInstructions || "",
    });
    setExistingImages(product.images || []); // load existing images
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const handleViewDetail = (product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/deleteProduct/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditProduct(null);
    setForm(emptyForm);
    setErrors({});
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const totalImages = existingImages.length + imagePreviews.length;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your plant and product listings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#3d6b45] transition-colors" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#fcfdfc] border border-[#e8ede6] rounded-2xl pl-10 pr-4 py-2 text-xs font-medium text-gray-600 placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#3d6b45]/10 focus:border-[#3d6b45] focus:bg-white transition-all w-64"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ede6]">
          <div className="overflow-x-auto">
            {loading ? (
              <AdminTableSkeleton rows={5} cols={7} hasImage={true} />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-[#f0f4ee]">
                    <th className="text-left px-6 py-3 font-medium">Image</th>
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-left px-6 py-3 font-medium">Category</th>
                    <th className="text-left px-6 py-3 font-medium">Price</th>
                    <th className="text-left px-6 py-3 font-medium">Stock</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, i) => (
                    <tr key={p._id} className={`border-b border-[#f0f4ee] hover:bg-[#fafcfa] transition-colors ${i === products.length - 1 ? "border-0" : ""}`}>
                      {/* Show first image as thumbnail in table */}
                      <td className="px-6 py-4">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#f0f4ee]">
                          <img
                            src={p.images?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&q=60"}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                          {p.images?.length > 1 && (
                            <span className="absolute -bottom-0.5 -right-0.5 bg-[#3d6b45] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                              {p.images.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                      <td className="px-6 py-4 text-gray-500">{p.category}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₹{p.price.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4 text-gray-500">{p.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusStyles[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleViewDetail(p)} className="p-1.5 hover:bg-[#f0f4ee] rounded-lg text-gray-400 hover:text-[#3d6b45] transition-colors"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-[#f0f4ee] rounded-lg text-gray-400 hover:text-[#3d6b45] transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No products found. {searchTerm ? "Try a different search query." : "Add your first product!"}</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col" style={{ animation: "fadeUp 0.2s ease" }}>

            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8ede6]">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editProduct ? "Edit Product" : "Add New Product"}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editProduct ? "Update the product details below" : "Fill in the details to list a new product"}</p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-[#f0f4ee] rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">

              {/* Multi-image upload section */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Product Images
                  <span className="text-gray-300 font-normal normal-case ml-1">({totalImages}/5)</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="product-image-input"
                />

                {/* Image grid */}
                {totalImages > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {/* Existing images */}
                    {existingImages.map((url, idx) => (
                      <div key={`existing-${idx}`} className="relative rounded-xl overflow-hidden border border-[#e8ede6] bg-[#fafcfa] aspect-square group">
                        <img src={url} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-[#3d6b45] text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold">Cover</span>
                        )}
                        <button
                          onClick={() => handleRemoveExistingImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {/* New (pending upload) images */}
                    {imagePreviews.map((url, idx) => (
                      <div key={`new-${idx}`} className="relative rounded-xl overflow-hidden border border-[#c8d9c0] bg-[#fafcfa] aspect-square group">
                        <img src={url} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold">New</span>
                        <button
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button — hidden when at max */}
                {totalImages < 5 && (
                  <label
                    htmlFor="product-image-input"
                    className="border-2 border-dashed border-[#c8d9c0] rounded-xl p-4 flex flex-col items-center gap-1.5 bg-[#fafcfa] hover:border-[#3d6b45] hover:bg-[#f6f9f5] transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#f0f4ee] flex items-center justify-center group-hover:bg-[#e0ecdf] transition-colors">
                      <Upload className="w-4 h-4 text-[#3d6b45]" />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      <span className="text-[#3d6b45] font-semibold">Click to upload</span> · PNG, JPG, WEBP up to 5MB
                    </p>
                    <p className="text-[11px] text-gray-300">{5 - totalImages} slot{5 - totalImages !== 1 ? "s" : ""} remaining · First image is the cover</p>
                  </label>
                )}

                {errors.image && <p className="text-xs text-red-400 mt-1">{errors.image}</p>}
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
                  placeholder="Brief description of the product..." rows={2}
                  className="w-full border border-[#e8ede6] rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] hover:border-[#c8d9c0] bg-white resize-none"
                />
              </div>

              {/* Care Instructions */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Care Instructions <span className="text-gray-300 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  name="careInstructions" value={form.careInstructions} onChange={handleChange}
                  placeholder="e.g. Water twice a week. Keep in bright indirect light." rows={2}
                  className="w-full border border-[#e8ede6] rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#3d6b45]/20 focus:border-[#3d6b45] hover:border-[#c8d9c0] bg-white resize-none"
                />
              </div>

              <div className="bg-[#f6f9f5] border border-[#e0ecdf] rounded-xl px-4 py-3 flex gap-2 items-start">
                <span className="text-[#3d6b45] text-sm">ℹ</span>
                <p className="text-xs text-[#3d6b45]">
                  Status is set automatically: <strong>Active</strong> (stock &gt; 10), <strong>Low Stock</strong> (1–10), <strong>Out of Stock</strong> (0).
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#e8ede6] flex gap-3">
              <button onClick={handleClose} className="flex-1 border border-[#e8ede6] text-gray-500 hover:bg-[#f6f9f5] text-sm font-semibold py-2.5 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || imageUploading}
                className="flex-1 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                {imageUploading ? "Uploading images..." : submitting ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
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

      {/* View Product Details Modal */}
      {showViewModal && viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl flex flex-col md:flex-row relative max-h-[90vh] overflow-hidden animate-fade-in-up">
            
            {/* Close Button Mobile */}
            <button 
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 md:hidden z-10 p-2 bg-white/80 rounded-full text-gray-500 shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2 bg-[#f9faf9] p-6 flex flex-col gap-4">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-white shadow-inner border border-[#f0f4ee]">
                 {/* Main Image */}
                 <img 
                   src={viewingProduct.images?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"} 
                   alt={viewingProduct.name}
                   className="w-full h-full object-cover"
                 />
              </div>
              
              {viewingProduct.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                   {viewingProduct.images.slice(1).map((img, idx) => (
                     <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-[#e8ede6] bg-white group">
                       <img src={img} alt={`${viewingProduct.name} ${idx + 2}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                     </div>
                   ))}
                </div>
              )}
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 flex flex-col">
               {/* Modal Header */}
               <div className="flex items-center justify-between px-8 py-6 border-b border-[#f0f4ee]">
                  <div>
                    <span className="text-[10px] uppercase font-black text-[#3d6b45]/60 bg-[#f0f4ee] px-2.5 py-1 rounded-full tracking-widest">
                      {viewingProduct.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight mt-2">{viewingProduct.name}</h2>
                  </div>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="hidden md:flex p-3 bg-[#f7f9f6] border border-[#e8ede6] hover:bg-white rounded-2xl text-gray-400 hover:text-[#3d6b45] transition-all shadow-sm group"
                  >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                  
                  {/* Prices & Stock Grid */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-[#fcfdfc] border border-[#f0f4ee] p-5 rounded-[24px]">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1.5">Current Price</p>
                        <p className="text-2xl font-black text-gray-900">₹{viewingProduct.price.toLocaleString("en-IN")}</p>
                     </div>
                     <div className="bg-[#fcfdfc] border border-[#f0f4ee] p-5 rounded-[24px]">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1.5">Inventory</p>
                        <div className="flex items-baseline gap-2">
                           <p className="text-2xl font-black text-gray-900">{viewingProduct.stock}</p>
                           <span className="text-xs font-bold text-gray-400 lowercase">units left</span>
                        </div>
                     </div>
                  </div>

                  {/* Status Card */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${statusStyles[viewingProduct.status]}`}>
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${viewingProduct.status === 'Active' ? 'bg-[#3d6b45]' : 'bg-red-500'}`} />
                        <span className="text-sm font-bold uppercase tracking-wider">Sale Status</span>
                     </div>
                     <span className="text-sm font-black">{viewingProduct.status}</span>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                     <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em]">Product Details</h3>
                     <p className="text-sm text-gray-600 leading-relaxed">
                        {viewingProduct.description || "No specific details provided for this botanical selection."}
                     </p>
                  </div>

                  {/* Care Instructions */}
                  {viewingProduct.careInstructions && (
                    <div className="bg-[#f0f4ee]/30 border border-[#c8d9c0]/30 p-6 rounded-[24px] space-y-3">
                       <div className="flex items-center gap-2 text-[#3d6b45]">
                          <Plus className="w-4 h-4 rotate-45" />
                          <h3 className="text-xs font-black uppercase tracking-widest">Nurture Notes</h3>
                       </div>
                       <p className="text-sm text-gray-700 italic leading-relaxed">
                          "{viewingProduct.careInstructions}"
                       </p>
                    </div>
                  )}

               </div>

               {/* Action Footer */}
               <div className="px-8 py-6 border-t border-[#f0f4ee] bg-[#fcfdfc] flex gap-3">
                  <button 
                    onClick={() => { setShowViewModal(false); handleEdit(viewingProduct); }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#3d6b45] text-white text-sm font-bold rounded-2xl hover:bg-[#345c3c] transition-all active:scale-95 shadow-lg shadow-emerald-900/10"
                  >
                    <Pencil className="w-4 h-4" /> Edit Selection
                  </button>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-4 bg-white border border-[#e8ede6] text-gray-400 text-sm font-bold rounded-2xl hover:text-gray-900 hover:border-gray-900 transition-all active:scale-95"
                  >
                    Close
                  </button>
               </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-up {
                animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}