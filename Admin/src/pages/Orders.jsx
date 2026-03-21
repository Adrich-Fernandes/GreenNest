import { Eye, Pencil } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const orders = [
  { id: "#ORD001", customer: "Ananya Mehta", product: "Aloe Vera", amount: "₹179", date: "21 Mar 2026", status: "Delivered" },
  { id: "#ORD002", customer: "Rohan Verma", product: "Jasmine Plant", amount: "₹320", date: "20 Mar 2026", status: "Processing" },
  { id: "#ORD003", customer: "Sneha Iyer", product: "Ceramic Pot", amount: "₹450", date: "20 Mar 2026", status: "Shipped" },
  { id: "#ORD004", customer: "Karan Patel", product: "Cactus Mix", amount: "₹149", date: "19 Mar 2026", status: "Delivered" },
  { id: "#ORD005", customer: "Divya Nair", product: "Tool Kit", amount: "₹599", date: "18 Mar 2026", status: "Cancelled" },
  { id: "#ORD006", customer: "Arjun Sinha", product: "Bougainvillea", amount: "₹275", date: "18 Mar 2026", status: "Delivered" },
];

const statusStyles = {
  Delivered: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Cancelled: "bg-red-50 text-red-500 border-red-200",
};

export default function Orders() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage all customer orders</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ede6]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-[#f0f4ee]">
                  <th className="text-left px-6 py-3 font-medium">Order ID</th>
                  <th className="text-left px-6 py-3 font-medium">Customer</th>
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium">Amount</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} className={`border-b border-[#f0f4ee] hover:bg-[#fafcfa] transition-colors ${i === orders.length - 1 ? "border-0" : ""}`}>
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-500">{o.id}</td>
                    <td className="px-6 py-3.5 font-medium text-gray-800">{o.customer}</td>
                    <td className="px-6 py-3.5 text-gray-500">{o.product}</td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900">{o.amount}</td>
                    <td className="px-6 py-3.5 text-gray-400 text-xs">{o.date}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusStyles[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-[#f0f4ee] rounded-lg text-gray-400 hover:text-[#3d6b45] transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-[#f0f4ee] rounded-lg text-gray-400 hover:text-[#3d6b45] transition-colors"><Pencil className="w-4 h-4" /></button>
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