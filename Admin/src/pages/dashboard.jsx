import { TrendingUp, ShoppingCart, Package, Users, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const stats = [
  { label: "Total Revenue", value: "₹1,24,580", change: "+12.5%", up: true, icon: TrendingUp },
  { label: "Total Orders", value: "348", change: "+8.2%", up: true, icon: ShoppingCart },
  { label: "Total Products", value: "64", change: "-2", up: false, icon: Package },
  { label: "Active Gardeners", value: "18", change: "+3", up: true, icon: Users },
];

const recentOrders = [
  { id: "#ORD001", customer: "Ananya Mehta", product: "Aloe Vera", amount: "₹179", status: "Delivered" },
  { id: "#ORD002", customer: "Rohan Verma", product: "Jasmine Plant", amount: "₹320", status: "Processing" },
  { id: "#ORD003", customer: "Sneha Iyer", product: "Ceramic Pot", amount: "₹450", status: "Shipped" },
  { id: "#ORD004", customer: "Karan Patel", product: "Cactus Mix", amount: "₹149", status: "Delivered" },
  { id: "#ORD005", customer: "Divya Nair", product: "Gardening Tool Kit", amount: "₹599", status: "Cancelled" },
];

const statusStyles = {
  Delivered: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Cancelled: "bg-red-50 text-red-500 border-red-200",
};

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome back, Admin. Here's what's happening.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8ede6] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 font-medium">{stat.label}</span>
                  <div className="w-9 h-9 bg-[#f0f4ee] rounded-xl flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#3d6b45]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? "text-[#3d6b45]" : "text-red-500"}`}>
                    {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ede6]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f4ee]">
            <h2 className="font-bold text-gray-900 text-base">Recent Orders</h2>
            <Link to="/orders" className="text-xs text-[#3d6b45] font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-[#f0f4ee]">
                  <th className="text-left px-6 py-3 font-medium">Order ID</th>
                  <th className="text-left px-6 py-3 font-medium">Customer</th>
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium">Amount</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-[#f0f4ee] hover:bg-[#fafcfa] transition-colors ${i === recentOrders.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-500">{order.id}</td>
                    <td className="px-6 py-3.5 font-medium text-gray-800">{order.customer}</td>
                    <td className="px-6 py-3.5 text-gray-500">{order.product}</td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900">{order.amount}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
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