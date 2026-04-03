import { Eye, Pencil, Loader2, Check, X, ShoppingCart, Filter, ArrowRight, MapPin, User, Package, CreditCard, Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [statusConfirmData, setStatusConfirmData] = useState(null);

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

  const handleView = (order) => {
    setViewingOrder(order);
    setShowViewModal(true);
  };

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
    const matchesFilter = filter === "fulfillment" 
      ? !["return_requested", "cancel_requested", "refunded", "cancelled", "return_confirmed"].includes(o.statusKey)
      : filter === "exceptions"
        ? ["return_requested", "cancel_requested", "refunded", "cancelled", "return_confirmed"].includes(o.statusKey)
        : true;

    const matchesSearch = 
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.address?.fullname || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <>
    {/* Order Details Modal */}
    {showViewModal && viewingOrder && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl flex flex-col relative max-h-[90vh] overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-emerald-50 bg-emerald-50/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-black text-emerald-600/60 bg-emerald-100/50 px-2.5 py-1 rounded-full tracking-widest">
                  Order Details
                </span>
                <span className="text-[10px] font-mono text-gray-400">#{viewingOrder._id.slice(-6).toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Fulfillment Summary</h2>
            </div>
            <button 
              onClick={() => setShowViewModal(false)}
              className="p-3 bg-white border border-emerald-50 hover:bg-red-50 hover:text-red-500 rounded-2xl text-gray-400 transition-all shadow-sm hover:shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
            
            {/* Customer & Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Card */}
              <div className="bg-emerald-50/20 border border-emerald-50 p-6 rounded-3xl flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600/40 uppercase tracking-widest">Customer</p>
                      <p className="font-bold text-gray-800 tracking-tight">{viewingOrder.user?.name || viewingOrder.address?.fullname || "Member"}</p>
                    </div>
                 </div>
                 <div className="text-sm text-gray-500 space-y-1">
                   <p className="flex items-center gap-2"><span className="w-1 h-1 bg-emerald-400 rounded-full" /> {viewingOrder.user?.email || "No email"}</p>
                   <p className="flex items-center gap-2"><span className="w-1 h-1 bg-emerald-400 rounded-full" /> {viewingOrder.address?.phone || "No phone"}</p>
                 </div>
              </div>

              {/* Address Card */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Address</p>
                      <p className="font-bold text-gray-800 tracking-tight truncate w-32">{viewingOrder.address?.fullname || "Shipping Location"}</p>
                    </div>
                 </div>
                 <div className="text-sm text-gray-500 leading-relaxed">
                   {viewingOrder.address?.addressline1}<br/>
                   {viewingOrder.address?.addressline2 && <>{viewingOrder.address.addressline2}<br/></>}
                   <span className="font-bold text-gray-700">{viewingOrder.address?.city}, {viewingOrder.address?.state} - {viewingOrder.address?.pincode}</span>
                 </div>
              </div>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2">
                 <Package className="w-4 h-4 text-emerald-600" />
                 <h3 className="font-bold text-gray-900 text-sm tracking-tight uppercase tracking-widest">Ordered Items</h3>
               </div>
               <div className="flex flex-col gap-3">
                  {viewingOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-emerald-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 rounded-xl overflow-hidden shrink-0 border border-emerald-50/50">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm leading-tight">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Category: {item.category}</p>
                          </div>
                       </div>
                       <div className="text-right">
                         <p className="font-bold text-gray-900 text-sm">₹{item.price.toLocaleString("en-IN")}</p>
                         <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Qty: {item.qty}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* financial Summary */}
            <div className="bg-emerald-600 rounded-[24px] p-6 text-white shadow-xl shadow-emerald-600/10 flex flex-col gap-4">
               <div className="flex items-center gap-2 border-b border-emerald-500 pb-3">
                 <CreditCard className="w-4 h-4" />
                 <h3 className="font-bold text-xs uppercase tracking-widest">Payment Breakdown</h3>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium opacity-80">
                    <span>Subtotal</span>
                    <span>₹{(viewingOrder.subtotal || viewingOrder.total || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium opacity-80">
                    <span>Delivery Charges</span>
                    <span>₹{viewingOrder.delivery || 0}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-emerald-500 font-black text-xl tracking-tighter">
                    <span>Grand Total</span>
                    <span>₹{viewingOrder.total?.toLocaleString("en-IN")}</span>
                  </div>
               </div>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out forwards;
            }
          `}} />
        </div>
      </div>
    )}

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
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="w-4 h-4 text-emerald-600/40 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search ID, Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-emerald-50/30 border border-emerald-100 rounded-2xl pl-10 pr-4 py-2 text-xs font-medium text-emerald-900 placeholder:text-emerald-600/30 outline-none focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all w-64"
              />
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
                              setStatusConfirmData({ orderId: o._id, statusKey: val, label });
                              setShowStatusConfirm(true);
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
                          <button 
                            onClick={() => handleView(o)}
                            className="p-2 hover:bg-emerald-100/50 rounded-xl text-emerald-600 transition-all" title="View Details"
                          >
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
    
    {/* Status Update Confirmation Modal */}
    {showStatusConfirm && statusConfirmData && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up">
           <div className="p-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                <Filter className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Confirm Status Change</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Are you sure you want to mark this order as <span className="font-bold text-gray-900">"{statusConfirmData.label}"</span>?
                </p>
              </div>
           </div>
           <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setShowStatusConfirm(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  updateStatus(statusConfirmData.orderId, statusConfirmData.statusKey, statusConfirmData.label);
                  setShowStatusConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-emerald-600 rounded-xl text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
              >
                Confirm Update
              </button>
           </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scale-up { 
            from { opacity: 0; transform: scale(0.95) translateY(10px); } 
            to { opacity: 1; transform: scale(1) translateY(0); } 
          }
          .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
          .animate-scale-up { animation: scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}} />
      </div>
    )}
    </>
  );
}