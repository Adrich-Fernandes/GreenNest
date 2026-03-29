import { Eye, Pencil, Loader2, Check, X, ShoppingCart, Filter, ArrowRight } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:8000/api/orders/admin";

const statusStyles = {
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  out_for_delivery: "bg-teal-50 text-teal-700 border-teal-200",
  ordered: "bg-slate-50 text-slate-600 border-slate-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
  return_requested: "bg-amber-50 text-amber-600 border-amber-200",
};

export default function Orders() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all, fulfillment, exceptions

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (orderId, statusKey, label) => {
    setUpdatingId(orderId);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/${orderId}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          statusKey, 
          status: label,
          trackingLabel: label
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? data.data : o));
      }
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "fulfillment") return !["return_requested", "cancel_requested", "refunded", "cancelled", "return_confirmed"].includes(o.statusKey);
    if (filter === "exceptions") return ["return_requested", "cancel_requested", "refunded", "cancelled", "return_confirmed"].includes(o.statusKey);
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
              <p className="text-sm text-gray-400 mt-1">Full management of customer fulfillment cycles</p>
            </div>
          </div>
          
          <div className="flex bg-emerald-50/50 p-1 rounded-2xl border border-emerald-100">
            {["all", "fulfillment", "exceptions"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                  filter === f
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "text-emerald-800 hover:bg-emerald-100/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-emerald-50 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center gap-4 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
              <p className="text-sm font-semibold tracking-wide uppercase font-medium">Tracking shipments...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-20 text-center text-gray-300">
              <p className="text-sm italic">No orders found matching this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-emerald-800 bg-emerald-50/20 uppercase tracking-widest font-bold border-b border-emerald-50">
                    <th className="text-left px-6 py-5">Order ID</th>
                    <th className="text-left px-6 py-5">Customer</th>
                    <th className="text-left px-6 py-5">Items</th>
                    <th className="text-left px-6 py-5">Amount</th>
                    <th className="text-left px-6 py-5">Date</th>
                    <th className="text-left px-6 py-5">Status</th>
                    <th className="text-right px-6 py-5">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50/30">
                  {filteredOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-emerald-50/20 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="font-mono text-[10px] text-emerald-600/60 bg-emerald-50 px-1.5 py-0.5 rounded">#{o._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-800 tracking-tight">{o.user?.name || "Member"}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{o.user?.email}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          {o.items.map((item, idx) => (
                            <span key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                              <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                              {item.name} <span className="text-[9px] text-gray-300">x{item.qty}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-gray-900 border-l border-emerald-50/10">₹{o.total.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-5 text-gray-400 text-[10px] font-bold uppercase tracking-tight">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-6 py-5">
                        {["return_requested", "cancel_requested", "return_confirmed", "refunded", "cancelled"].includes(o.statusKey) ? (
                          <div className="flex flex-col gap-1.5">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${statusStyles[o.statusKey] || ""}`}>
                              {o.status}
                            </span>
                            <Link 
                              to="/returns" 
                              className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 hover:underline"
                            >
                              Manage in Returns <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        ) : (
                          <select
                            value={o.statusKey}
                            disabled={updatingId === o._id}
                            onChange={(e) => {
                              const val = e.target.value;
                              const label = e.target.options[e.target.selectedIndex].text;
                              updateStatus(o._id, val, label);
                            }}
                            className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all cursor-pointer shadow-sm ${statusStyles[o.statusKey] || ""}`}
                          >
                            <option value="ordered">Ordered</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 group-hover:opacity-100 opacity-20 transition-opacity">
                          <button className="p-2 hover:bg-emerald-100/50 rounded-xl text-emerald-600 transition-all" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {updatingId === o._id && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}