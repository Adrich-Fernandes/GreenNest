import { Eye, Pencil, Loader2, Check, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = "http://localhost:8000/api/orders/admin";

const statusStyles = {
  delivered: "bg-[#f0f4ee] text-[#3d6b45] border-[#c8d9c0]",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  out_for_delivery: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
  return_requested: "bg-orange-50 text-orange-600 border-orange-200",
};

export default function Orders() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage all customer orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ede6]">
          {loading ? (
            <div className="p-12 flex flex-col items-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Loading orders…</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="text-sm">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-[#f0f4ee]">
                    <th className="text-left px-6 py-4 font-medium">Order ID</th>
                    <th className="text-left px-6 py-4 font-medium">Customer</th>
                    <th className="text-left px-6 py-4 font-medium">Product(s)</th>
                    <th className="text-left px-6 py-4 font-medium">Amount</th>
                    <th className="text-left px-6 py-4 font-medium">Date</th>
                    <th className="text-left px-6 py-4 font-medium">Status</th>
                    <th className="text-left px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o._id} className={`border-b border-[#f0f4ee] hover:bg-[#fafcfa] transition-colors ${i === orders.length - 1 ? "border-0" : ""}`}>
                      <td className="px-6 py-4 font-mono text-[11px] text-gray-400">#{o._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">{o.user?.name || "Deleted User"}</p>
                        <p className="text-[10px] text-gray-400">{o.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          {o.items.map((item, idx) => (
                            <span key={idx} className="text-xs text-gray-500 line-clamp-1">
                              {item.name} <span className="text-[10px] text-gray-300">x{item.qty}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{o.total.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-6 py-4">
                        {["return_requested", "cancel_requested", "return_confirmed", "refunded"].includes(o.statusKey) ? (
                          <div className="flex flex-col gap-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit ${statusStyles[o.statusKey] || ""}`}>
                              {o.status}
                            </span>
                            <div className="flex gap-1">
                              {o.statusKey === "return_requested" && (
                                <button
                                  onClick={() => updateStatus(o._id, "return_confirmed", "Return Confirmed")}
                                  className="text-[9px] bg-[#3d6b45] text-white px-2 py-1 rounded-md font-bold hover:bg-[#345c3c]"
                                >
                                  Confirm Return
                                </button>
                              )}
                              {o.statusKey === "return_confirmed" && (
                                <button
                                  onClick={() => updateStatus(o._id, "refunded", "Refunded")}
                                  className="text-[9px] bg-blue-600 text-white px-2 py-1 rounded-md font-bold hover:bg-blue-700"
                                >
                                  Mark Refunded
                                </button>
                              )}
                              {o.statusKey === "cancel_requested" && (
                                <button
                                  onClick={() => updateStatus(o._id, "cancelled", "Order Cancelled")}
                                  className="text-[9px] bg-red-600 text-white px-2 py-1 rounded-md font-bold hover:bg-red-700"
                                >
                                  Confirm Cancel
                                </button>
                              )}
                            </div>
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
                            className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#c8d9c0] transition-all cursor-pointer ${statusStyles[o.statusKey] || ""}`}
                          >
                            <option value="ordered">Ordered</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 hover:bg-[#f0f4ee] rounded-xl text-gray-400 hover:text-[#3d6b45] transition-all" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {updatingId === o._id && <Loader2 className="w-4 h-4 animate-spin text-[#3d6b45]" />}
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