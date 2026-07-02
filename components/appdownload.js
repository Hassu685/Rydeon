"use client";

import { HiLocationMarker } from "react-icons/hi";
import { BsCircle } from "react-icons/bs";

export default function RideBooking() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[180px]" />

      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

      <div className="relative w-full max-w-2xl pt-14">

        {/* Heading */}

        <div className="text-center mb-12">

          <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[3px] text-blue-300">
            Book Your Ride
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
            Move Smart.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Move Rydeon.
            </span>
          </h1>

          <p className="mt-5 text-lg text-slate-300">
            Fast, safe and affordable rides whenever you need them.
          </p>

        </div>

        {/* Booking Card */}

        <div className="rounded-3xl border border-white/10 bg-white/95 backdrop-blur-xl p-8 shadow-[0_25px_80px_rgba(0,0,0,.45)] mb-13">

          {/* Pickup */}

          <div className="mb-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 transition-all duration-300 hover:border-blue-500 hover:bg-white hover:shadow-lg">

            <HiLocationMarker className="text-3xl text-blue-600" />

            <input
              type="text"
              placeholder="Enter Pickup Location"
              className="w-full bg-transparent text-lg text-slate-700 placeholder:text-slate-400 outline-none"
            />

          </div>

          {/* Drop */}

          <div className="mb-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 transition-all duration-300 hover:border-blue-500 hover:bg-white hover:shadow-lg">

            <BsCircle className="text-xl text-indigo-600" />

            <input
              type="text"
              placeholder="Enter Drop Location"
              className="w-full bg-transparent text-lg text-slate-700 placeholder:text-slate-400 outline-none"
            />

          </div>

          {/* Button */}

          <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-5 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40">
            Book Ride →
          </button>

        </div>

      </div>
    </section>
  );
}