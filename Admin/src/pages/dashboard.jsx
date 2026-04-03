import { useState, useEffect } from "react";
import { TrendingUp, ShoppingCart, Package, Users, ArrowUp, ArrowDown, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const statusStyles = {
  Delivered: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  delivered: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  ordered: "bg-amber-50 text-amber-700 border-amber-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Cancelled: "bg-red-50 text-red-500 border-red-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/admin/stats");
      const result = await res.json();
      if (result.success) {
        setData(result);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = data ? [
    { label: "Total Revenue", value: `₹${data.stats.revenue.toLocaleString('en-IN')}`, icon: TrendingUp, up: true, change: "Live" },
    { label: "Total Orders", value: data.stats.orders, icon: ShoppingCart, up: true, change: "Live" },
    { label: "Total Products", value: data.stats.products, icon: Package, up: true, change: "Live" },
    { label: "Active Gardeners", value: data.stats.gardeners, icon: Users, up: true, change: "Live" },
  ] : [];

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-gray-500 font-medium">{error}</p>
          <button onClick={fetchStats} className="text-[#3d6b45] font-bold underline">Try Again</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time business performance from the database.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8ede6] animate-pulse h-32" />
             ))
          ) : (
            dashboardStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8ede6] flex flex-col gap-3 group hover:border-[#3d6b45]/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-medium">{stat.label}</span>
                    <div className="w-9 h-9 bg-[#f0f4ee] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-[#3d6b45]" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</span>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-[#3d6b45] tracking-widest bg-[#f0f4ee] px-2 py-0.5 rounded-full">
                       {stat.change}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ede6] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f4ee]">
            <h2 className="font-bold text-gray-900 text-base">Latest Transactions</h2>
            <Link to="/orders" className="text-xs text-[#3d6b45] font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-[#f0f4ee] bg-[#fcfdfc]">
                  <th className="text-left px-6 py-4 font-black">Ref ID</th>
                  <th className="text-left px-6 py-4 font-black">Customer</th>
                  <th className="text-left px-6 py-4 font-black">Total</th>
                  <th className="text-left px-6 py-4 font-black text-center">Lifecycle</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-[#f0f4ee] animate-pulse">
                      <td colSpan="4" className="px-6 py-5 h-16" />
                    </tr>
                   ))
                ) : data?.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">No orders found yet.</td>
                  </tr>
                ) : (
                  data?.recentOrders.map((order, k) => (
                    <tr
                      key={order.id}
                      className={`border-b border-[#f0f4ee] hover:bg-[#fafcfa] transition-colors ${k === data.recentOrders.length - 1 ? "border-0" : ""}`}
                    >
                      <td className="px-6 py-4.5 font-mono text-xs text-gray-400">{order.id}</td>
                      <td className="px-6 py-4.5 font-bold text-gray-800">{order.customer}</td>
                      <td className="px-6 py-4.5 font-black text-gray-900">{order.amount}</td>
                      <td className="px-6 py-4.5 text-center">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border transition-all ${statusStyles[order.status] || "bg-gray-50 text-gray-400 border-gray-100 italic lowercase"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}