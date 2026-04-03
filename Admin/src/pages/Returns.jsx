import { Eye, Pencil, Loader2, Check, X, RotateCcw, AlertCircle, MessageSquare, Calendar, Clock } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = "http://localhost:8000/api/orders/admin";

const statusStyles = {
  cancelled: "bg-red-50 text-red-700 border-red-200",
  return_requested: "bg-amber-50 text-amber-700 border-amber-200",
  return_confirmed: "bg-orange-50 text-orange-700 border-orange-200",
  refunded: "bg-blue-50 text-blue-700 border-blue-200",
  cancel_requested: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function Returns() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReturns = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/returns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch returns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (orderId, statusKey, label, extraData = {}) => {
    setUpdatingId(orderId);

    // Optimistic Update
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, statusKey, status: label, ...extraData } : o));

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
          trackingLabel: label,
          ...extraData
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shadow-sm">
              <RotateCcw className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Return Management</h1>
              <p className="text-sm text-gray-400 mt-1">Resolution dashboard for returns and cancellations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {orders.filter(o => ["return_requested", "cancel_requested"].includes(o.statusKey)).length} Pending Actions
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-amber-100 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center gap-4 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
              <p className="text-sm font-semibold tracking-wide uppercase">Fetching resolution requests...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-20 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-gray-200" />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg">Inbox Zero!</p>
                <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">All returns and cancellations have been processed and resolved.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-amber-800 bg-amber-50/50 uppercase tracking-widest font-bold border-b border-amber-100">
                    <th className="text-left px-6 py-5 font-bold">Request Info</th>
                    <th className="text-left px-6 py-5 font-bold">Reason & Details</th>
                    <th className="text-left px-6 py-5 font-bold">Product(s)</th>
                    <th className="text-left px-6 py-5 font-bold">Ref. Amount</th>
                    <th className="text-left px-6 py-5 font-bold">Pickup Schedule</th>
                    <th className="text-left px-6 py-5 font-bold">Current Status</th>
                    <th className="text-right px-6 py-5 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-amber-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit">#{o._id.slice(-6).toUpperCase()}</span>
                          <p className="font-bold text-gray-800">{o.user?.name || "Deleted User"}</p>
                          <p className="text-[10px] text-gray-400">{o.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5 max-w-[200px]">
                          <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {o.returnReason || "Cancellation Requested"}
                          </div>
                          <p className="text-[11px] text-gray-500 italic line-clamp-2">"{o.returnDetails || "No additional comments provided."}"</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          {o.items.map((item, idx) => (
                            <span key={idx} className="text-xs text-gray-600 flex items-center gap-1.5">
                              <span className="w-1 h-1 bg-amber-300 rounded-full" />
                              {item.name} <span className="text-[10px] font-bold text-gray-400">x{item.qty}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-900 text-base">₹{o.total.toLocaleString("en-IN")}</div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tight font-bold">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</p>
                      </td>
                      <td className="px-6 py-5">
                        {["return_requested", "return_confirmed"].includes(o.statusKey) ? (
                          <div className="flex flex-col gap-1.5">
                            <input 
                              type="date"
                              value={o.pickupDate ? new Date(o.pickupDate).toISOString().split('T')[0] : ""}
                              onChange={(e) => updateStatus(o._id, o.statusKey, o.status, { pickupDate: e.target.value })}
                              className="w-full max-w-[130px] bg-amber-50/30 border border-amber-100 rounded-xl px-2 py-1.5 text-[11px] font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-200 transition-all cursor-pointer"
                            />
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-300 italic">--</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm ${statusStyles[o.statusKey] || ""}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end gap-2">
                          {o.statusKey === "return_requested" && (
                            <button
                              onClick={() => updateStatus(o._id, "return_confirmed", "Return Confirmed")}
                              className="text-[10px] bg-amber-600 text-white px-4 py-1.5 rounded-xl font-bold hover:bg-amber-700 shadow-sm transition-all active:scale-95"
                            >
                              Confirm Return
                            </button>
                          )}
                          {o.statusKey === "return_confirmed" && (
                            <button
                              onClick={() => updateStatus(o._id, "refunded", "Refunded")}
                              className="text-[10px] bg-blue-600 text-white px-4 py-1.5 rounded-xl font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
                            >
                              Issue Refund
                            </button>
                          )}
                          {o.statusKey === "cancel_requested" && (
                            <button
                              onClick={() => updateStatus(o._id, "cancelled", "Order Cancelled")}
                              className="text-[10px] bg-rose-600 text-white px-4 py-1.5 rounded-xl font-bold hover:bg-rose-700 shadow-sm transition-all active:scale-95"
                            >
                              Approve Cancel
                            </button>
                          )}
                          <div className="flex items-center gap-2 opacity-10 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-all" title="View Logs">
                              <Eye className="w-4 h-4" />
                            </button>
                            {updatingId === o._id && <Loader2 className="w-4 h-4 animate-spin text-amber-600" />}
                          </div>
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
