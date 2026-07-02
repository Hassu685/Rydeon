"use client";

import React from "react";
import { motion } from "framer-motion";

const safetyPoints = [
  {
    icon: "🛡️",
    title: "Verified Drivers",
    desc: "All drivers are verified with ID checks and background screening.",
  },
  {
    icon: "📍",
    title: "Live Trip Tracking",
    desc: "Share your live location with family and friends during the ride.",
  },
  {
    icon: "🚨",
    title: "Emergency Support",
    desc: "One-tap SOS button connected to emergency services.",
  },
  {
    icon: "⭐",
    title: "Driver Ratings",
    desc: "Rate drivers after every ride to maintain quality and safety.",
  },
];

const headingVariant = {
  hidden: { opacity: 0, y: 25 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

const TrustSafety = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 px-6 md:px-16">
      {/* Background Blobs */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-indigo-500/15 blur-[120px] animate-pulse"></div>

      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/15 blur-[150px] animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center mb-14"
        >
          <motion.span
            variants={headingVariant}
            custom={0}
            className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-xs font-bold uppercase tracking-[4px] text-blue-700"
          >
            Safety First
          </motion.span>

          <motion.h2
            variants={headingVariant}
            custom={1}
            className="mt-5 text-3xl font-extrabold text-slate-900 md:text-5xl"
          >
            Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Safety
            </span>{" "}
            Comes First
          </motion.h2>

          <motion.div
            variants={headingVariant}
            custom={2}
            className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
          />

          <motion.p
            variants={headingVariant}
            custom={3}
            className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-500 md:text-base"
          >
            Rydeon is built with advanced safety features to make every ride
            secure, comfortable, and worry-free.
          </motion.p>
        </motion.div>

        {/* Safety Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {safetyPoints.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariant}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-md transition-colors duration-500 hover:border-blue-300 hover:shadow-[0_25px_60px_rgba(37,99,235,.18)]"
            >
              {/* Top Border */}
              <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 group-hover:w-full"></div>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-3xl shadow-inner"
              >
                {item.icon}
              </motion.div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 transition duration-300 group-hover:text-blue-600">
                {item.title}
              </h3>

              <p className="text-slate-500 text-sm leading-6">
                {item.desc}
              </p>

              {/* Bottom Glow */}
              <div className="absolute -bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/25"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;