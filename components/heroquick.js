"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" },
    }),
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: (i = 0) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.6, delay: 0.3 + i * 0.12, ease: "easeOut" },
    }),
};

export default function HeroQuickRides() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#fbfbfb] to-[#f2f2f4] py-20">
            {/* subtle background glow */}
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* LEFT CONTENT */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                >
                    <motion.span
                        variants={fadeUp}
                        custom={0}
                        className="inline-block text-xs font-semibold tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4"
                    >
                        #1 RIDE BOOKING PLATFORM
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight"
                    >
                        Get Quick Rides, <br />
                        <span className="text-blue-600">Low Fares</span>
                    </motion.h1>

                    <motion.div
                        variants={fadeUp}
                        custom={2}
                        className="h-1.5 w-16 bg-blue-600 mt-6 rounded-full"
                    />

                    <motion.p
                        variants={fadeUp}
                        custom={3}
                        className="mt-6 text-lg text-gray-600 max-w-md leading-relaxed"
                    >
                        In Rydeon we ensure our customers get rides quickly at the most
                        affordable prices — anytime, anywhere.
                    </motion.p>

                    <motion.div variants={fadeUp} custom={4} className="mt-10 flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full text-sm font-semibold shadow-lg shadow-gray-900/20 hover:bg-black transition-colors"
                        >
                            Book a ride
                            <span className="text-lg">→</span>
                        </motion.button>

                        <button className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors underline underline-offset-4">
                            Learn more
                        </button>
                    </motion.div>

                    {/* trust badges */}
                    <motion.div
                        variants={fadeUp}
                        custom={5}
                        className="mt-10 flex items-center gap-8 text-sm text-gray-500"
                    >
                        <div>
                            <p className="text-2xl font-bold text-gray-900">10K+</p>
                            <p>Happy Riders</p>
                        </div>
                        <div className="h-8 w-px bg-gray-300" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">4.9★</p>
                            <p>Average Rating</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* RIGHT IMAGES */}
                <div className="grid grid-cols-2 gap-6">
                    {[
                        { src: "/images/download (2).jpg", alt: "Auto Ride" },
                        { src: "/images/download (3).jpg", alt: "Delivery" },
                        { src: "/images/images.jpg", alt: "Bike Ride" },
                        { src: "/images/download (1).jpg", alt: "Car Ride" },
                    ].map((img, i) => (
                        <motion.div
                            key={img.alt}
                            custom={i}
                            initial="hidden"
                            animate="show"
                            variants={imageVariants}
                            whileHover={{ scale: 1.04, y: -6 }}
                            transition={{ type: "spring", stiffness: 250, damping: 18 }}
                            className={`rounded-2xl overflow-hidden shadow-md shadow-gray-900/10 ${i % 2 === 1 ? "mt-8" : ""
                                }`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                width={400}
                                height={400}
                                className="object-cover w-full h-full aspect-square"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}