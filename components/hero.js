"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const slides = [
    {
        title: (
            <>
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    Reliable
                </span>{" "}
                Urban Mobility
            </>
        ),
        desc: "Your everyday transport partner, anytime anywhere.",
        // Ask Unsplash for a right-sized, compressed image instead of the full-res original
        image:
            "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=60",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" },
    }),
};

export default function Hero() {
    const slide = slides[0];

    return (
        <section className="relative flex min-h-[100svh] sm:min-h-[85vh] items-center overflow-hidden">
            {/* Background image handled by next/image:
                - priority preloads it and marks it as the LCP candidate (fixes LCP request discovery)
                - Next.js auto-generates responsive, compressed, modern-format (webp/avif) variants (fixes image delivery) */}
            <Image
                src={slide.image}
                alt=""
                fill
                priority
                sizes="100vw"
                quality={70}
                className="object-cover -z-20"
            />

            {/* Dark gradient overlay for text contrast, now a plain div instead of an inline background-image */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background:
                        "linear-gradient(rgba(15,23,42,.82), rgba(15,23,42,.72))",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent -z-10" />

            {/* Subtle animated glow accents.
                Moved from Framer Motion (JS-driven, runs on main thread every frame)
                to a CSS keyframe animation (GPU-composited, doesn't add to TBT). */}
            <div className="absolute -top-20 -right-20 w-60 h-60 sm:w-96 sm:h-96 rounded-full bg-blue-500/20 blur-[90px] sm:blur-[130px] animate-glow" />
            <div className="absolute bottom-0 left-0 w-60 h-60 sm:w-96 sm:h-96 rounded-full bg-indigo-500/20 blur-[90px] sm:blur-[130px] animate-glow [animation-delay:1s]" />

            {/* pt-24/28 clears a fixed/sticky navbar so heading is never hidden behind it */}
            <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-8 text-white pt-24 pb-16 sm:pt-16 sm:pb-16 md:py-32">
                <motion.div
                    initial="hidden"
                    animate="show"
                    className="max-w-xl md:max-w-2xl"
                >
                    <motion.span
                        variants={fadeUp}
                        custom={0}
                        className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs sm:text-sm mb-4 sm:mb-6 backdrop-blur-md"
                    >
                        ⚡ Smart Ride Booking
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]"
                    >
                        {slide.title}
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-300 leading-7 sm:leading-8"
                    >
                        {slide.desc}
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        custom={3}
                        className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-5"
                    >
                        <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.96 }}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base font-semibold shadow-xl shadow-blue-900/30 transition-colors duration-300 hover:from-blue-700 hover:to-indigo-700"
                        >
                            Book Your Ride
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.96 }}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full border border-white/20 bg-white/10 text-sm sm:text-base backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-slate-900"
                        >
                            Explore Services
                        </motion.button>
                    </motion.div>

                    {/* Trust stats */}
                    <motion.div
                        variants={fadeUp}
                        custom={4}
                        className="mt-10 sm:mt-12 flex flex-wrap items-center gap-x-5 sm:gap-x-8 gap-y-4 text-xs sm:text-sm text-slate-300"
                    >
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-white">10K+</p>
                            <p>Happy Riders</p>
                        </div>
                        <div className="h-8 w-px bg-white/20 hidden sm:block" />
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-white">4.9★</p>
                            <p>Average Rating</p>
                        </div>
                        <div className="h-8 w-px bg-white/20 hidden sm:block" />
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-white">24/7</p>
                            <p>Support</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}