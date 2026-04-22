import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, ArrowLeft, Calendar, User, Check, ShieldCheck, X, IndianRupee, Tag } from 'lucide-react';
import UserNavBar from '../components/userNavBar';
import Footer from '../components/footer';
import { GardenerViewSkeleton } from '../components/Skeleton';
import { useUser, useAuth, SignInButton } from '@clerk/clerk-react';

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM",
];

export default function GardenerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { isSignedIn, getToken } = useAuth();

  const [gardener, setGardener] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);

  // Booking modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", location: "", serviceRequired: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchGardener();
  }, [id]);

  const fetchGardener = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/gardener/profile/${id}`);
      const result = await res.json();
      if (result.success) setGardener(result.data);
    } catch (err) {
      console.error("Failed to fetch gardener:", err);
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = () => {
    if (!isSignedIn) return;
    setForm({ date: "", time: "", location: "", serviceRequired: "", note: "" });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.serviceRequired) e.serviceRequired = "Please select what you need done";
    if (!form.date) e.date = "Please select a date";
    if (!form.time) e.time = "Please select a time slot";
    if (!form.location.trim()) e.location = "Please enter your address";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/api/gardener/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gardenerId: gardener._id,
          userId: user.id,
          customerName: user.fullName || user.firstName || "Customer",
          serviceRequired: form.serviceRequired,
          price: gardener.basePrice,
          duration: "1 hour", // default duration for base profile bookings
          date: form.date,
          time: form.time,
          location: form.location.trim(),
          note: form.note.trim(),
        }),
      });

      const result = await res.json();
      if (result.success) {
        setModalOpen(false);
        setBooked(true);
      } else {
        console.error("Booking failed:", result.message);
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) return (
    <>
      <UserNavBar />
      <div className="min-h-screen bg-[#f7f9f6] pt-8 pb-16 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <GardenerViewSkeleton />
        </div>
      </div>
      <Footer />
    </>
  );

  if (!gardener) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9f6] gap-4">
      <p className="text-gray-500 font-medium">Gardener not found</p>
      <button onClick={() => navigate('/gardeners')} className="text-[#3d6b45] font-semibold flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <UserNavBar />
      <div className="min-h-screen bg-[#f7f9f6] pt-8 pb-16 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">

          <button onClick={() => navigate('/gardeners')} className="flex items-center gap-2 text-gray-400 hover:text-[#3d6b45] transition-colors w-fit group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Gardeners</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Profile Card */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-8 border border-[#e8ede6] shadow-sm flex flex-col items-center text-center gap-6">
                <div className="w-24 h-24 bg-[#f0f4ee] rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-[#3d6b45]" strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{gardener.name}</h1>
                  <p className="text-[#3d6b45] font-semibold text-sm mt-1">{gardener.experience || 0} years experience</p>
                </div>

                <div className="flex items-center gap-6 py-4 border-y border-[#f0f4ee] w-full justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-gray-900">{gardener.rating || 0}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Rating</span>
                  </div>
                  <div className="w-px h-8 bg-[#f0f4ee]" />
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-[#3d6b45]">
                      <MapPin className="w-4 h-4" />
                      <span className="font-bold">{gardener.location || "Available"}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Location</span>
                  </div>
                </div>

                <div className="w-full flex items-center gap-2 p-3 bg-green-50 rounded-2xl border border-green-100">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Verified GreenNest Professional</span>
                </div>
              </div>
            </div>

            {/* Details & Booking */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="bg-white rounded-3xl p-8 border border-[#e8ede6] shadow-sm flex flex-col gap-8">
                
                {/* About Section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About {gardener.name}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {gardener.bio || "No description provided."}
                  </p>
                </div>

                {/* Specialties */}
                {gardener.specialties && gardener.specialties.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {gardener.specialties.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f4ee] border border-[#c8d9c0] rounded-xl text-sm font-semibold text-[#3d6b45]">
                          <Tag className="w-3.5 h-3.5" />
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booking Call to Action */}
                <div className="p-6 bg-[#f7f9f6] border border-[#e8ede6] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-sm font-bold tracking-widest text-[#3d6b45] uppercase mb-1">Base Rate</p>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-gray-900 flex items-center gap-0.5">
                        <IndianRupee className="w-6 h-6" />{gardener.basePrice || 0}
                      </span>
                      <span className="text-xs font-bold text-gray-400">per hour</span>
                    </div>
                  </div>

                  {isSignedIn ? (
                    <button
                      disabled={booked}
                      onClick={openBookingModal}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${
                        booked
                          ? "bg-green-100 text-green-600 cursor-default"
                          : "bg-[#3d6b45] hover:bg-[#345c3c] text-white hover:scale-105 active:scale-95 shadow-lg shadow-[#3d6b45]/20"
                      }`}
                    >
                      {booked ? <><Check className="w-5 h-5" /> Request Sent</> : <><Calendar className="w-5 h-5" /> Book Appointment</>}
                    </button>
                  ) : (
                    <SignInButton mode="modal">
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-[#3d6b45] hover:bg-[#345c3c] text-white transition-all hover:scale-105 shadow-lg shadow-[#3d6b45]/20">
                        <User className="w-5 h-5" /> Login to Book
                      </button>
                    </SignInButton>
                  )}
                </div>

              </div>

              {/* Booking Success Banner */}
              {booked && (
                <div className="bg-[#3d6b45] rounded-3xl p-8 text-white flex flex-col gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Appointment Request Sent!</h3>
                    <p className="text-white/80 text-sm mt-1 leading-relaxed">
                      Your request for <strong>{gardener.name}</strong> has been sent.
                      The gardener will confirm the schedule shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/appointments')}
                    className="mt-2 w-fit bg-white text-[#3d6b45] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                  >
                    View My Appointments
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* ── Booking Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Book Gardener</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Request an appointment with <span className="text-[#3d6b45] font-semibold">{gardener.name}</span>
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Service Type Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">What do you need help with?</label>
              <select
                value={form.serviceRequired}
                onChange={(e) => { setForm(f => ({ ...f, serviceRequired: e.target.value })); setErrors(er => ({ ...er, serviceRequired: undefined })); }}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#3d6b45] focus:ring-2 focus:ring-[#f0f4ee] bg-white ${errors.serviceRequired ? "border-red-300" : "border-[#c8d9c0]"}`}
              >
                <option value="">Select a service category</option>
                <option value="General Gardening">General Gardening</option>
                {gardener.specialties && gardener.specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
                <option value="Other">Other (Please specify in notes)</option>
              </select>
              {errors.serviceRequired && <p className="text-xs text-red-500">{errors.serviceRequired}</p>}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Preferred Date</label>
              <input
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => { setForm(f => ({ ...f, date: e.target.value })); setErrors(er => ({ ...er, date: undefined })); }}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#3d6b45] focus:ring-2 focus:ring-[#f0f4ee] ${errors.date ? "border-red-300" : "border-[#c8d9c0]"}`}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>

            {/* Time Slot */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Preferred Time</label>
              <div className="grid grid-cols-5 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => { setForm(f => ({ ...f, time: slot })); setErrors(er => ({ ...er, time: undefined })); }}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      form.time === slot
                        ? "bg-[#3d6b45] text-white border-[#3d6b45]"
                        : "bg-white border-[#c8d9c0] text-gray-600 hover:border-[#3d6b45] hover:text-[#3d6b45]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Your Address</label>
              <input
                type="text"
                placeholder="e.g. 12 Park Street, Bandra West, Mumbai"
                value={form.location}
                onChange={(e) => { setForm(f => ({ ...f, location: e.target.value })); setErrors(er => ({ ...er, location: undefined })); }}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#3d6b45] focus:ring-2 focus:ring-[#f0f4ee] ${errors.location ? "border-red-300" : "border-[#c8d9c0]"}`}
              />
              {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
            </div>

            {/* Note */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 flex justify-between">
                <span>Task Description</span> 
                <span className="text-gray-400 font-normal">Optional</span>
              </label>
              <textarea
                rows={2}
                placeholder="Briefly describe what needs to be done..."
                value={form.note}
                onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))}
                className="w-full border border-[#c8d9c0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3d6b45] focus:ring-2 focus:ring-[#f0f4ee] transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#3d6b45] hover:bg-[#345c3c] text-white font-bold py-3.5 rounded-2xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#3d6b45]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending Request...</>
              ) : (
                <><Calendar className="w-4 h-4" /> Confirm Appointment</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
