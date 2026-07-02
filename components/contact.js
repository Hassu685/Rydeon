"use client";

import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
};

const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: 0.15 + i * 0.1, ease: "easeOut" },
    }),
};

/* Small inline icon set — keeps the file dependency-free */
const Icon = {
    User: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20c1.7-3.5 5-5 7.5-5s5.8 1.5 7.5 5" strokeLinecap="round" />
        </svg>
    ),
    Mail: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
            <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Phone: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <path d="M6 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 4.5 5.1 1.5 1.5 0 0 1 6 3.5Z" strokeLinejoin="round" />
        </svg>
    ),
    Tag: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <path d="M12 3h5a2 2 0 0 1 2 2v5L10.5 19.5a2 2 0 0 1-2.8 0l-4.2-4.2a2 2 0 0 1 0-2.8L12 3Z" strokeLinejoin="round" />
            <circle cx="15.5" cy="7.5" r="1.2" />
        </svg>
    ),
    Message: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4Z" strokeLinejoin="round" />
        </svg>
    ),
    Pin: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="2.4" />
        </svg>
    ),
    Building: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <rect x="5" y="3.5" width="10" height="17" rx="1" />
            <rect x="15" y="9" width="4.5" height="11.5" rx="1" />
            <path d="M8 7.5h1M11 7.5h1M8 11h1M11 11h1M8 14.5h1M11 14.5h1" strokeLinecap="round" />
        </svg>
    ),
    HQ: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <path d="M4 21V9l8-5 8 5v12" strokeLinejoin="round" />
            <path d="M9 21v-6h6v6" strokeLinejoin="round" />
        </svg>
    ),
    Chevron: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Bolt: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />
        </svg>
    ),
};

const offices = [
    {
        icon: Icon.HQ,
        title: "Registered Office",
        lines: [
            "Rydeon Transportation Services Pvt. Ltd.",
            "3rd Floor, Sai Prithvi Arcade,",
            "Megha Hills, Sri Rama Colony,",
            "Madhapur, Hyderabad - 500081.",
        ],
        meta: "CIN: U52120TG2015PTC097115",
    },
    {
        icon: Icon.Pin,
        title: "City Office",
        lines: [
            "#148, 1st Floor,",
            "SLV Nilaya,",
            "5th Main 80ft Road,",
            "HSR Layout 7th Sector,",
            "Bangalore - 560102.",
        ],
    },
    {
        icon: Icon.Building,
        title: "Corporate Office",
        lines: [
            "Maruti Commerce,",
            "Spatium Tower A,",
            "Survey No. 51/2, 51/3 & 51/4,",
            "Devarabeesanahalli Village,",
            "Varthur Hobli, Bangalore East Taluk,",
            "Bangalore.",
        ],
    },
];

const fieldBase =
    "peer w-full rounded-xl sm:rounded-2xl border border-white/15 bg-white/[0.04] text-white placeholder:text-slate-500 pl-11 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-3.5 text-sm sm:text-base outline-none transition-all duration-300 focus:border-blue-400/70 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]";

const iconBase =
    "pointer-events-none absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 transition-colors duration-300 peer-focus:text-blue-400";

export default function ContactPage() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-14 sm:py-20">

            {/* Background Glow */}
            <div className="absolute -top-32 -left-32 h-60 w-60 sm:h-96 sm:w-96 rounded-full bg-blue-600/20 blur-[90px] sm:blur-[140px]" />
            <div className="absolute bottom-0 right-0 h-72 w-72 sm:h-[500px] sm:w-[500px] rounded-full bg-indigo-600/20 blur-[100px] sm:blur-[180px]" />
            <div className="absolute top-1/2 left-1/2 h-48 w-48 sm:h-72 sm:w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[90px] sm:blur-[150px]" />

            {/* faint grid texture for premium feel */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />

            {/* Hero */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                className="relative z-10 text-center px-5 py-12 sm:py-20"
            >
                <motion.span
                    variants={fadeUp}
                    custom={0}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold uppercase tracking-[2px] sm:tracking-[3px] text-blue-300"
                >
                    <Icon.Bolt className="h-3.5 w-3.5" />
                    Contact Rydeon
                </motion.span>

                <motion.h1
                    variants={fadeUp}
                    custom={1}
                    className="mt-5 sm:mt-6 text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
                >
                    We'd Love To
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Hear From You
                    </span>
                </motion.h1>

                <motion.p
                    variants={fadeUp}
                    custom={2}
                    className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
                >
                    Have questions about rides, partnerships or support?
                    Our team is here to help you anytime.
                </motion.p>
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-3 gap-6 sm:gap-10">

                    {/* LEFT — FORM */}
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={cardVariant}
                        custom={0}
                        className="lg:col-span-2"
                    >
                        <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,.45)]">

                            {/* accent corner glow */}
                            <div className="absolute -top-1 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

                            <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                Send us a Message
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-slate-400">
                                Fill out the form below and we'll get back to you shortly.
                            </p>

                            <form className="mt-6 sm:mt-8 space-y-5">

                                <div className="grid sm:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div>
                                        <label className="text-sm font-semibold text-slate-200">
                                            Name
                                        </label>
                                        <div className="relative mt-2">
                                            <Icon.User className={iconBase} />
                                            <input
                                                type="text"
                                                placeholder="Enter your name"
                                                className={fieldBase}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-sm font-semibold text-slate-200">
                                            Email Address
                                        </label>
                                        <div className="relative mt-2">
                                            <Icon.Mail className={iconBase} />
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className={fieldBase}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-5">
                                    {/* Mobile */}
                                    <div>
                                        <label className="text-sm font-semibold text-slate-200">
                                            Mobile Number
                                        </label>
                                        <div className="relative mt-2">
                                            <Icon.Phone className={iconBase} />
                                            <input
                                                type="tel"
                                                placeholder="Enter your mobile number"
                                                className={fieldBase}
                                            />
                                        </div>
                                    </div>

                                    {/* User Type */}
                                    <div>
                                        <label className="text-sm font-semibold text-slate-200">
                                            You are a
                                        </label>
                                        <div className="relative mt-2">
                                            <Icon.Tag className={iconBase} />
                                            <select
                                                className={`${fieldBase} appearance-none cursor-pointer`}
                                            >
                                                <option className="bg-slate-900">User</option>
                                                <option className="bg-slate-900">Driver</option>
                                                <option className="bg-slate-900">Partner</option>
                                            </select>
                                            <Icon.Chevron className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-200">
                                        Message
                                    </label>
                                    <div className="relative mt-2">
                                        <Icon.Message className="pointer-events-none absolute left-3.5 sm:left-4 top-4 h-4.5 w-4.5 text-slate-500 peer-focus:text-blue-400" />
                                        <textarea
                                            rows={5}
                                            placeholder="Write your message..."
                                            className={`${fieldBase} resize-none`}
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Button */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.015 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-blue-900/30 transition-shadow duration-300 hover:shadow-blue-500/40"
                                >
                                    Send Message →
                                </motion.button>

                            </form>
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-5 sm:space-y-6">
                        {offices.map((office, i) => (
                            <motion.div
                                key={office.title}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={cardVariant}
                                custom={i + 1}
                                whileHover={{ y: -4 }}
                                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                                className="group rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5 sm:p-6 shadow-lg transition-colors duration-300 hover:border-blue-400/30"
                            >
                                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 transition-colors duration-300 group-hover:bg-blue-500/20">
                                        <office.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white">
                                        {office.title}
                                    </h3>
                                </div>

                                <p className="leading-6 sm:leading-7 text-sm sm:text-base text-slate-400">
                                    {office.lines.map((line, idx) => (
                                        <span key={idx}>
                                            {line}
                                            {idx !== office.lines.length - 1 && <br />}
                                        </span>
                                    ))}
                                </p>

                                {office.meta && (
                                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-300 font-medium break-words">
                                        {office.meta}
                                    </p>
                                )}
                            </motion.div>
                        ))}

                        {/* Contact Card */}
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariant}
                            custom={offices.length + 1}
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 240, damping: 22 }}
                            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 sm:p-6 shadow-xl"
                        >
                            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                            <h3 className="relative text-xl sm:text-2xl font-bold text-white">
                                Need Quick Help?
                            </h3>
                            <p className="relative mt-2 sm:mt-3 text-sm sm:text-base text-blue-100">
                                Our support team is available 24/7 to assist you with bookings,
                                payments and ride-related queries.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                className="relative mt-5 sm:mt-6 w-full rounded-xl bg-white py-3 text-sm sm:text-base font-semibold text-blue-700 transition-colors duration-300 hover:bg-slate-100"
                            >
                                Contact Support
                            </motion.button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}