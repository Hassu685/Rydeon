"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    UserCheck,
    MapPin,
    AlertCircle,
    Headphones,
    Clock,
} from "lucide-react";

const safetyFeatures = [
    {
        icon: UserCheck,
        title: "Verified Drivers",
        desc: "Every driver goes through strict verification and background checks.",
    },
    {
        icon: MapPin,
        title: "Live Ride Tracking",
        desc: "Track your ride in real-time and share your journey with loved ones.",
    },
    {
        icon: AlertCircle,
        title: "SOS Emergency Button",
        desc: "One-tap SOS button instantly alerts emergency support.",
    },
    {
        icon: ShieldCheck,
        title: "Trip History & Transparency",
        desc: "Every ride is recorded so you're always in control.",
    },
    {
        icon: Headphones,
        title: "24/7 Customer Support",
        desc: "Our support team is always ready to help you.",
    },
    {
        icon: Clock,
        title: "Always Available",
        desc: "Round-the-clock safety and service for peace of mind.",
    },
];

const headingVariant = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" },
    }),
};

const cardVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
    }),
};

export default function SafetySection() {
    return (
        <section className="relative overflow-hidden bg-[#f8fbff] py-16 sm:py-20">

            {/* Soft ambient glow — keeps page light, adds a bit of depth */}
            <div className="absolute -top-24 -left-24 h-52 w-52 sm:h-80 sm:w-80 rounded-full bg-blue-500/[0.05] blur-[80px] sm:blur-[130px]" />
            <div className="absolute bottom-0 right-0 h-60 w-60 sm:h-96 sm:w-96 rounded-full bg-indigo-500/[0.05] blur-[90px] sm:blur-[140px]" />

            <div className="relative max-w-6xl mx-auto px-5 sm:px-6 text-center">

                <motion.span
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.6 }}
                    variants={headingVariant}
                    custom={0}
                    className="inline-flex items-center rounded-full border border-blue-600/15 bg-blue-600/[0.06] px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-semibold tracking-[0.2em] sm:tracking-widest text-blue-600 uppercase"
                >
                    Safety Comes First
                </motion.span>

                <motion.h2
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.6 }}
                    variants={headingVariant}
                    custom={1}
                    className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
                >
                    Your{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Safety
                    </span>
                    , Our Priority
                </motion.h2>

                <motion.p
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.6 }}
                    variants={headingVariant}
                    custom={2}
                    className="mt-4 sm:mt-5 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed"
                >
                    We ensure every ride is protected with advanced safety features
                    so you can travel with complete peace of mind.
                </motion.p>

                <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {safetyFeatures.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={cardVariant}
                                custom={i}
                                whileHover={{ y: -6 }}
                                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                                className="group relative overflow-hidden bg-white rounded-2xl p-6 sm:p-7 text-left shadow-sm border border-blue-600/[0.05] transition-colors duration-300 hover:border-blue-600/15 hover:shadow-xl hover:shadow-blue-600/[0.08]"
                            >
                                {/* top accent line on hover */}
                                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 group-hover:w-full" />

                                <div className="flex items-center justify-center h-12 w-12 sm:h-13 sm:w-13 rounded-xl bg-blue-50 transition-colors duration-300 group-hover:bg-blue-100">
                                    <Icon className="h-6 w-6 text-blue-600" strokeWidth={1.9} />
                                </div>

                                <h3 className="mt-5 font-semibold text-base sm:text-lg text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}