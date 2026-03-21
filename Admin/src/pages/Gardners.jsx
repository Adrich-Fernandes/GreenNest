import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const gardeners = [
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

export default function Gardners() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gardeners</h1>
            <p className="text-sm text-gray-400 mt-1">Manage verified gardening professionals</p>
          </div>
          <button className="flex items-center gap-2 bg-[#3d6b45] hover:bg-[#345c3c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
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
    </AdminLayout>
  );
}