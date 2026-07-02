"use client";

import React from "react";

const Section = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-24">

            {/* Background Glow */}

            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[140px]" />

            <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[170px]" />

            <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

            <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">

                {/* LEFT CONTENT */}

                <div>

                    <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[3px] text-blue-300">
                        Ride Safety
                    </span>

                    <h2 className="mt-6 text-5xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
                        Your Safety,
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Our Priority
                        </span>
                    </h2>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                        Every journey is protected with advanced safety features,
                        verified drivers and real-time ride tracking so you can travel
                        confidently wherever you go.
                    </p>

                    <button className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40">
                        Book a Ride →
                    </button>

                </div>

                {/* RIGHT IMAGE */}

                <div className="relative">

                    {/* Glow Behind Image */}

                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-3xl"></div>

                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-4 shadow-[0_25px_80px_rgba(0,0,0,.45)] transition duration-500 hover:scale-105">

                        <img
                            src="/images/safety.png"
                            alt="Rydeon Safety"
                            className="w-full rounded-2xl object-cover"
                        />

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Section;