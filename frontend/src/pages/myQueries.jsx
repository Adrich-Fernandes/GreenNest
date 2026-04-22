import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import UserNavBar from "../components/userNavBar";
import Footer from "../components/footer";
import { MessageSquare, Calendar, ArrowRight, Loader2, Inbox, AlertCircle, ChevronRight, CheckCircle2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { QuerySkeleton } from "../components/Skeleton";

export default function MyQueries() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", query: "" });
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, loading, success, error

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || ""
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    setMounted(true);
    if (isLoaded && isSignedIn && user) {
      fetchUserQueries(true); // Initial load with spinner
      
      const interval = setInterval(() => {
        fetchUserQueries(false); // Background update
      }, 10000); // Every 10 seconds

      // Listen for immediate refresh from footer submission
      const handleQuerySubmitted = () => fetchUserQueries(false);
      window.addEventListener("querySubmitted", handleQuerySubmitted);

      return () => {
        clearInterval(interval);
        window.removeEventListener("querySubmitted", handleQuerySubmitted);
      };
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchUserQueries = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await fetch(`http://localhost:8000/api/queries/user/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setQueries(data.queries);
      }
    } catch (error) {
      console.error("Error fetching user queries:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    try {
      const res = await fetch("http://localhost:8000/api/queries/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          clerkId: user?.id || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus("success");
        setFormData(prev => ({ ...prev, query: "" }));
        fetchUserQueries(false); // Refresh list immediately
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const handleUpdateRequest = async (queryId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/queries/${queryId}/update-request`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        // Optimistic UI update
        setQueries(prev => prev.map(q => q._id === queryId ? { ...q, status: "Update Requested" } : q));
      }
    } catch (error) {
      console.error("Error requesting update:", error);
    }
  };

  const handleReopenRequest = async (queryId) => {
    if (!window.confirm("Are you sure you want to reopen this issue? Our support team will be notified.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/queries/${queryId}/reopen`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setQueries(prev => prev.map(q => q._id === queryId ? { ...q, status: "Reopened" } : q));
      }
    } catch (error) {
      console.error("Error reopening request:", error);
    }
  };

  const getRandomStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Update Requested": return "bg-amber-50 text-amber-600 border-amber-100";
      case "Reopened": return "bg-purple-50 text-purple-600 border-purple-100";
      default: return "bg-[#f0f4ee] text-[#3d6b45] border-[#e8ede6]";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] flex flex-col">
      <UserNavBar />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-12 md:py-16">
        
        {/* Header Section */}
        <div className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex items-center gap-2 text-[#3d6b45] text-xs font-bold uppercase tracking-widest mb-3">
             <div className="w-6 h-0.5 bg-[#3d6b45]" /> Support Inquiries
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Queries</h1>
          <p className="text-sm text-gray-500 font-medium max-w-lg mb-10">Review and track all your messages sent to the GreenNest support team. We usually respond within 24–48 hours.</p>
        </div>

        {/* New Query Form Section */}
        <div className={`mb-16 transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="bg-[#2a4a30] p-8 md:p-10 rounded-[32px] border border-emerald-800/30 shadow-2xl relative overflow-hidden group flex flex-col lg:flex-row gap-8 items-center">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <Send className="w-48 h-48 text-white -rotate-12" />
            </div>
            
            <div className="flex-1 relative z-10 text-center lg:text-left">
              <h3 className="text-white font-black text-2xl mb-2 tracking-tight">Need expert advice?</h3>
              <p className="text-[#a8c4a0] text-sm font-medium max-w-sm leading-relaxed mx-auto lg:mx-0">
                Send us a new query or ask anything about your plants. Our experts are here to help you grow.
              </p>
            </div>

            <div className="flex-[1.5] relative z-10 w-full lg:pl-10 lg:border-l border-emerald-800/50">
               <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   <input 
                     type="text" 
                     placeholder="Your Name"
                     disabled={isSignedIn || submitStatus === "loading"}
                     value={formData.name}
                     onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                     className="bg-[#1e3a22] border border-emerald-900/50 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all disabled:opacity-60"
                     required
                   />
                   <input 
                     type="email" 
                     placeholder="Email Address"
                     disabled={isSignedIn || submitStatus === "loading"}
                     value={formData.email}
                     onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                     className="bg-[#1e3a22] border border-emerald-900/50 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all disabled:opacity-60"
                     required
                   />
                 </div>
                 <textarea 
                   placeholder="Describe your query..."
                   value={formData.query}
                   disabled={submitStatus === "loading"}
                   onChange={(e) => setFormData(prev => ({ ...prev, query: e.target.value }))}
                   className="bg-[#1e3a22] border border-emerald-900/50 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all h-24 resize-none"
                   required
                 />
                 <button 
                   type="submit"
                   disabled={submitStatus === "loading" || submitStatus === "success"}
                   className={`h-11 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${
                     submitStatus === "success" 
                       ? "bg-emerald-500 text-white" 
                       : submitStatus === "error"
                       ? "bg-red-500 text-white"
                       : "bg-white text-[#1e3a22] hover:bg-[#f0f4ee]"
                   }`}
                 >
                   {submitStatus === "loading" ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                   ) : submitStatus === "success" ? (
                     <><CheckCircle2 className="w-5 h-5" /> Message Sent!</>
                   ) : submitStatus === "error" ? (
                     "Try Again"
                   ) : (
                     <><Send className="w-4 h-4" /> Send Inquiry</>
                   )}
                 </button>
               </form>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((n) => <QuerySkeleton key={n} />)}
          </div>
        ) : queries.length === 0 ? (
          <div className={`bg-white rounded-[32px] border border-[#e8ede6] p-12 text-center shadow-sm flex flex-col items-center transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="w-20 h-20 bg-[#f7f9f6] rounded-full flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No queries sent yet</h3>
            <p className="text-sm text-gray-400 max-w-xs mb-8">Need help with your plants or products? Feel free to send us a message through the footer form.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-[#1e3a22] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-950/20"
            >
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {queries.map((q, idx) => (
              <div 
                key={q._id} 
                className={`bg-white rounded-3xl border border-[#e8ede6] p-6 md:p-8 hover:border-[#3d6b45]/30 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 group relative overflow-hidden ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none">
                   <MessageSquare className="w-32 h-32 text-[#3d6b45] -rotate-12" />
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full border tracking-tighter transition-colors ${getRandomStatusColor(q.status)}`}>
                          {q.status === "Resolved" ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />} 
                          {q.status || "Submitted"}
                       </span>
                       <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5 opacity-40 shrink-0" /> {formatDate(q.createdAt)}
                       </span>
                    </div>
                    
                    <h3 className="text-lg font-black text-gray-900 mb-3 group-hover:text-[#3d6b45] transition-colors leading-tight italic uppercase tracking-tight">
                      Message Archive
                    </h3>
                    
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium italic mb-2">
                       "{q.query}"
                    </p>

                    {/* Admin Reply Section */}
                    {q.adminReply && (
                      <div className="mt-6 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 relative">
                         <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" /> Response from GreenNest
                         </p>
                         <p className="text-sm text-gray-700 font-bold leading-relaxed">
                            {q.adminReply}
                         </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3 shrink-0">
                     <div className="p-4 bg-[#fcfdfc] rounded-2xl border border-[#e8ede6] min-w-[200px]">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Contact Info Used</p>
                        <p className="text-xs font-bold text-gray-700 truncate">{q.email}</p>
                     </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#f7f9f6] flex items-center justify-between">
                   <p className="text-xs font-bold text-gray-400 italic">
                      {q.status === "Resolved" ? "This inquiry has been successfully addressed." : q.status === "Reopened" ? "This inquiry has been reopened and is under review." : "Our support team has successfully received this inquiry."}
                   </p>
                   {q.status !== "Resolved" && q.status !== "Update Requested" && q.status !== "Reopened" && (
                    <button 
                      onClick={() => handleUpdateRequest(q._id)}
                      className="flex items-center gap-1.5 text-xs font-black text-[#3d6b45] hover:gap-2.5 transition-all uppercase tracking-widest group/btn"
                    >
                        Request Update <ChevronRight className="w-4 h-4" />
                    </button>
                   )}
                   {q.status === "Resolved" && (
                    <button 
                      onClick={() => handleReopenRequest(q._id)}
                      className="flex items-center gap-1.5 text-xs font-black text-purple-600 hover:gap-2.5 transition-all uppercase tracking-widest group/btn"
                    >
                      Issue Not Solved yet<ChevronRight className="w-4 h-4" />
                    </button>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className={`mt-12 p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 flex items-start gap-4 transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
           <div className="w-10 h-10 bg-[#3d6b45] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/10">
              <AlertCircle className="w-5 h-5 text-white" />
           </div>
           <div>
              <h4 className="text-sm font-black text-[#1e3a22] uppercase tracking-tight mb-0.5">Need immediate assistance?</h4>
              <p className="text-xs text-[#3d6b45] font-medium opacity-80 leading-relaxed max-w-xl">If your query is urgent or relates to a pending order, please mention your order ID and call our helpline for faster resolution.</p>
           </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
