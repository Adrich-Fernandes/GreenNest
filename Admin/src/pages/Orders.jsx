import { useState } from "react";
import { Menu, Bell, Search, Eye, Pencil } from "lucide-react";
import Nav from "../components/AdminNavBar";

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
        </main>
      </div>
    </div>
  );
}