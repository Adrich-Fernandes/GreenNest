import { useState } from "react";
import { Menu, Bell, Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Nav from "../components/AdminNavBar";

const products = [
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

export default function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f7f9f6] overflow-hidden">
      <Nav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-[#e8ede6] px-6 h-16 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-gray-500 hover:text-[#3d6b45] rounded-lg hover:bg-[#f0f4ee] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-[#f7f9f6] border border-[#e8ede6] rounded-xl px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input placeholder="Search..." className="text-sm text-gray-600 bg-transparent outline-none placeholder-gray-400 flex-1" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-[#3d6b45] rounded-lg hover:bg-[#f0f4ee] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#3d6b45] rounded-full" />
            </button>
            <div className="w-8 h-8 bg-[#3d6b45] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your plant and product listings</p>
              </div>
              <button className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
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
        </main>
      </div>
    </div>
  );
}