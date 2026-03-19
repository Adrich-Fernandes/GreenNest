import { Leaf, Bell, ArrowRight } from "lucide-react";
import UserNavBar from "../components/userNavBar";

export default function HeroSection() {
  return (
    <>
    <UserNavBar />
    <section className="min-h-screen bg-white flex items-center px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-10 items-center">

        {/* LEFT DIV */}
        <div className="flex flex-col gap-6 items-center text-center md:items-start md:text-left w-full md:w-1/2">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full w-fit shadow-sm">
            <Leaf className="w-4 h-4" />
            Your Digital Garden Starts Here
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
              Bring Nature
            </h1>
            <h1 className="text-5xl md:text-6xl font-black text-green-600 leading-tight tracking-tight">
              Closer to Home
            </h1>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md">
            Discover premium plants, gardening supplies, and book verified
            gardeners — all in one place. Transform your space with GreenNest.
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-150">
              Browse Plants <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-xl bg-white transition-colors duration-150">
              Find a Gardener
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center md:justify-start gap-6 mt-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Leaf className="w-4 h-4 text-green-500" />
              <span>500+ Plants</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Bell className="w-4 h-4 text-green-500" />
              <span>50+ Nurseries</span>
            </div>
          </div>
        </div>

        {/* RIGHT DIV — hidden on mobile */}
        <div className="hidden md:flex relative w-full md:w-1/2 justify-center items-center">

          {/* Soft circular glow */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle, rgba(134,239,172,0.55) 0%, rgba(74,222,128,0.2) 45%, transparent 72%)",
              borderRadius: "50%",
              filter: "blur(16px)",
              transform: "scale(1.05)",
            }}
          />

          {/* Main Image */}
          <div className="w-full h-[480px] rounded-3xl overflow-hidden shadow-xl relative z-10">
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"
              alt="Gardening tools with soil"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-5 -left-6 bg-white rounded-2xl shadow-lg px-5 py-3.5 flex items-center gap-3 z-20">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">Verified Gardeners</p>
              <p className="text-gray-400 text-xs">100+ professionals</p>
            </div>
          </div>
        </div>

      </div>
    </section>
    </>
  );
}