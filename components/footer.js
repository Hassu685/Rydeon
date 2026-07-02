"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
};

/* Inline SVG icons — no external icon library dependency */
const Social = {
    Facebook: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
            <path d="M14 9h2.5V6h-2.5c-1.9 0-3.5 1.6-3.5 3.5V11H8v3h2.5v6h3v-6H16l.5-3h-3V9.7c0-.4.3-.7.5-.7Z" strokeLinejoin="round" />
        </svg>
    ),
    Instagram: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="3.6" />
            <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
    ),
    X: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
            <path d="M4 4l16 16M20 4 4 20" strokeLinecap="round" />
        </svg>
    ),
    Linkedin: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
            <path d="M7.5 10.5v6M7.5 7.8v.01" strokeLinecap="round" />
            <path d="M11.5 16.5v-3.3c0-1.5 1-2.2 2.2-2.2s1.8.9 1.8 2.2v3.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Arrow: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};

const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Services", href: "/fare-services" },
    { name: "Careers", href: "/" },
    { name: "Blog", href: "/" },
];

const supportLinks = ["Contact Us", "Safety", "FAQs"];

const socials = [
    { Icon: Social.Facebook, label: "Facebook" },
    { Icon: Social.Instagram, label: "Instagram" },
    { Icon: Social.X, label: "X" },
    { Icon: Social.Linkedin, label: "LinkedIn" },
];

const Footer = () => {
    return (
        <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 h-52 w-52 sm:h-72 sm:w-72 rounded-full bg-blue-600/10 blur-[90px] sm:blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-indigo-600/10 blur-[110px] sm:blur-[150px]" />

            {/* Top CTA strip */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeUp}
                custom={0}
                className="relative border-b border-slate-800"
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 text-center sm:text-left">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                            Ready to ride with Rydeon?
                        </h3>
                        <p className="mt-1.5 text-sm sm:text-base text-slate-400">
                            Download the app and book your first ride in seconds.
                        </p>
                    </div>

                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-shadow hover:shadow-blue-500/40"
                    >
                        Book a Ride
                        <Social.Arrow className="h-4 w-4" />
                    </motion.a>
                </div>
            </motion.div>

            <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
                <div className="grid grid-cols-1 gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Logo */}
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        custom={0}
                    >
                        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                            Rydeon
                        </h2>

                        <p className="mt-4 sm:mt-5 text-sm leading-6 sm:leading-7 text-slate-400 max-w-xs">
                            Your trusted ride-booking platform offering safe, reliable and
                            affordable transportation with just a few taps.
                        </p>
                    </motion.div>

                    {/* Company */}
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        custom={1}
                    >
                        <h3 className="mb-4 sm:mb-5 text-base sm:text-lg font-semibold text-white">
                            Company
                        </h3>

                        <ul className="space-y-2.5 sm:space-y-3">
                            {companyLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="group inline-flex items-center gap-1.5 text-sm sm:text-base text-slate-400 transition-colors hover:text-blue-400"
                                    >
                                        {item.name}
                                        <span className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                            →
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support */}
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        custom={2}
                    >
                        <h3 className="mb-4 sm:mb-5 text-base sm:text-lg font-semibold text-white">
                            Support
                        </h3>

                        <ul className="space-y-2.5 sm:space-y-3">
                            {supportLinks.map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="group inline-flex items-center gap-1.5 text-sm sm:text-base text-slate-400 transition-colors hover:text-blue-400"
                                    >
                                        {item}
                                        <span className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                            →
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social */}
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        custom={3}
                    >
                        <h3 className="mb-4 sm:mb-5 text-base sm:text-lg font-semibold text-white">
                            Follow Us
                        </h3>

                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            {socials.map(({ Icon, label }) => (
                                <motion.a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-colors duration-300 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                                >
                                    <Icon className="h-4.5 w-4.5" />
                                </motion.a>
                            ))}
                        </div>

                        <p className="mt-6 text-xs sm:text-sm text-slate-500 leading-6">
                            Get updates on new features, fares
                            <br className="hidden sm:block" />
                            and ride offers.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Bottom */}
            <div className="relative border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 sm:gap-5 px-5 sm:px-6 py-6 text-xs sm:text-sm text-slate-500 md:flex-row">

                    <p className="text-center md:text-left">
                        © {new Date().getFullYear()} Rydeon. All Rights Reserved.
                    </p>

                    <div className="flex gap-5 sm:gap-6">
                        <a href="#" className="transition-colors hover:text-blue-400">
                            Privacy Policy
                        </a>

                        <a href="#" className="transition-colors hover:text-blue-400">
                            Terms & Conditions
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;