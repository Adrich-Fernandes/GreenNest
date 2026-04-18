import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { MessageSquare, User, Mail, Calendar, Search, Trash2, ExternalLink, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchQueries(true); // Initial load with spinner
    
    const interval = setInterval(() => {
      fetchQueries(false); // Background update without spinner
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchQueries = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await fetch("http://localhost:8000/api/queries/all");
      const data = await res.json();
      if (data.success) {
        setQueries(data.queries);
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      setSendingReply(true);
      const res = await fetch(`http://localhost:8000/api/queries/${selectedQuery._id}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminReply: replyText })
      });
      const data = await res.json();
      if (data.success) {
        setQueries(prev => prev.map(q => q._id === selectedQuery._id ? { ...q, status: "Resolved", adminReply: replyText } : q));
        setSelectedQuery(null);
        setReplyText("");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (queryId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/queries/${queryId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setQueries(prev => prev.map(q => q._id === queryId ? { ...q, status: newStatus } : q));
        if (selectedQuery && selectedQuery._id === queryId) {
          setSelectedQuery(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getRandomStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "bg-emerald-50 text-[#3d6b45] border-emerald-100";
      case "Update Requested": return "bg-amber-50 text-amber-600 border-amber-100";
      case "Reopened": return "bg-purple-50 text-purple-600 border-purple-100";
      case "In Progress": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Pending": return "bg-gray-50 text-gray-500 border-gray-200";
      default: return "bg-gray-50 text-gray-400 border-gray-100";
    }
  };

  const filteredQueries = queries.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">User inquiries</h1>
            <p className="text-sm text-gray-500 font-medium">Manage and respond to customer support requests from the portal.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3d6b45] transition-colors" />
              <input
                type="text"
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-[#e8ede6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b45]/10 focus:border-[#3d6b45] w-full md:w-72 transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => fetchQueries(true)}
              className="p-2.5 bg-white border border-[#e8ede6] rounded-xl text-gray-600 hover:text-[#3d6b45] hover:bg-[#f0f4ee] transition-all shadow-sm"
              title="Refresh"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e8ede6] shadow-sm flex items-center gap-5 group hover:border-[#3d6b45]/30 transition-all">
            <div className="w-12 h-12 bg-[#f0f4ee] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-[#3d6b45]" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-black text-gray-800">{queries.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#e8ede6] shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-black text-gray-800">
                {queries.filter(q => q.status === "In Progress").length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#e8ede6] shadow-sm flex items-center gap-5 group hover:border-amber-200 transition-all">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Requests</p>
              <p className="text-2xl font-black text-gray-800">
                {queries.filter(q => q.status === "Update Requested").length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#e8ede6] shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6 text-[#3d6b45]" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-black text-gray-800">
                {queries.filter(q => q.status === "Resolved").length}
              </p>
            </div>
          </div>
        </div>

        {/* Queries Table */}
        <div className="bg-white rounded-[32px] border border-[#e8ede6] shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f9f6] border-b border-[#e8ede6]">
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Sender</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Message Request</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Received On</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-[#3d6b45] animate-spin opacity-40" />
                        <p className="text-sm font-medium text-gray-400">Loading user inquiries...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredQueries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-[#f7f9f6] rounded-full flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-gray-300" />
                        </div>
                        <div className="max-w-xs">
                          <p className="text-base font-bold text-gray-800">No inquiries found</p>
                          <p className="text-xs text-gray-400 mt-1">Queries submitted by users via the portal footer will appear here automatically.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredQueries.map((query) => (
                    <tr key={query._id} className="border-b border-[#f7f9f6] hover:bg-[#fcfdfc] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#f0f4ee] rounded-full flex items-center justify-center text-[#3d6b45] font-bold text-sm shadow-inner group-hover:scale-105 transition-transform duration-300">
                            {query.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 leading-tight">{query.name}</p>
                            <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {query.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-md">
                        <div className="bg-[#f7f9f6] p-3 rounded-2xl border border-transparent group-hover:border-[#e8ede6] transition-all">
                          <p className="text-sm text-gray-600 font-medium line-clamp-2 leading-relaxed">
                            {query.query}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <select 
                          value={query.status || "Pending"} 
                          onChange={(e) => handleStatusChange(query._id, e.target.value)}
                          className={`appearance-none text-[10px] font-black uppercase rounded-full border shadow-sm transition-colors px-3 py-1 cursor-pointer focus:outline-none ${getRandomStatusColor(query.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          {query.status !== "Pending" && query.status !== "In Progress" && query.status !== "Resolved" && (
                            <option value={query.status}>{query.status}</option>
                          )}
                        </select>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 italic">
                          <Calendar className="w-3.5 h-3.5 opacity-50" />
                          {formatDate(query.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedQuery(query)}
                            className="p-2 text-gray-400 hover:text-[#3d6b45] hover:bg-[#f0f4ee] rounded-xl transition-all"
                            title="View & Reply"
                          >
                            <ExternalLink className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Strip */}
        <div className="flex items-center gap-3 p-4 bg-emerald-50 text-[#3d6b45] rounded-2xl border border-emerald-100 animate-pulse-slow">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs font-bold">Inquiries marked as "Update Requested" require your immediate attention. Replying to an inquiry will automatically mark it as "Resolved".</p>
        </div>

      </div>

      {/* Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-8 pb-0 flex justify-between items-start">
              <div className="w-14 h-14 bg-[#f0f4ee] rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-[#3d6b45]" />
              </div>
              <button 
                onClick={() => setSelectedQuery(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"
                disabled={sendingReply}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-1">Inquiry Details</h2>
              <div className="flex items-center gap-2 mb-8">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{formatDate(selectedQuery.createdAt)}</span>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-[#fcfdfc] rounded-2xl border border-[#e8ede6]">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Sender Name</p>
                      <p className="text-sm font-bold text-gray-800">{selectedQuery.name}</p>
                   </div>
                   <div className="p-4 bg-[#fcfdfc] rounded-2xl border border-[#e8ede6]">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Status</p>
                      <select 
                        value={selectedQuery.status || "Pending"} 
                        onChange={(e) => handleStatusChange(selectedQuery._id, e.target.value)}
                        className={`w-full bg-transparent text-xs font-bold uppercase tracking-widest focus:outline-none cursor-pointer ${getRandomStatusColor(selectedQuery.status).split(' ')[1]}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        {selectedQuery.status !== "Pending" && selectedQuery.status !== "In Progress" && selectedQuery.status !== "Resolved" && (
                          <option value={selectedQuery.status}>{selectedQuery.status}</option>
                        )}
                      </select>
                   </div>
                </div>

                <div className="p-6 bg-[#f7f9f6] rounded-[24px] border border-[#e8ede6] relative overflow-hidden">
                  <p className="text-[10px] font-black text-[#3d6b45] uppercase tracking-widest mb-3 flex items-center gap-1.5 leading-none">
                    <div className="w-1 h-1 bg-[#3d6b45] rounded-full" /> Full description
                  </p>
                  <p className="text-base text-gray-700 font-medium leading-relaxed italic relative z-10">
                    "{selectedQuery.query}"
                  </p>
                </div>

                {/* Reply Section */}
                <div className="pt-4 border-t border-gray-100">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 leading-none">Your Response</p>
                   {selectedQuery.status === "Resolved" ? (
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 italic font-medium text-sm text-[#3d6b45]">
                        "{selectedQuery.adminReply}"
                      </div>
                   ) : (
                      <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response here..."
                        className="w-full h-32 p-4 bg-gray-50 border border-[#e8ede6] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b45]/10 focus:border-[#3d6b45] transition-all resize-none"
                      />
                   )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                 {selectedQuery.status !== "Resolved" && (
                    <button 
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyText.trim()}
                      className="w-full h-12 bg-[#3d6b45] text-white rounded-2xl font-bold text-sm hover:bg-[#345c3c] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Response & Resolve"}
                    </button>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

// Sub-component Helper
function RotateCcw({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function X({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
