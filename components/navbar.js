"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const tag = [
        { name: "Home", path: "/" },
        { name: "Fare Services", path: "/fair-services" },
        { name: "Safety", path: "/safety" },
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
    ];

    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Only the home page gets the transparent-over-hero treatment.
    // Every other page always shows the solid white navbar.
    const isWhite = open || scrolled || !isHome;

    return (
        <motion.header
            animate={{
                backgroundColor: isWhite
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(255,255,255,0)",
                backdropFilter: isWhite ? "blur(16px)" : "blur(0px)",
                boxShadow: isWhite
                    ? "0 10px 30px rgba(15,23,42,.08)"
                    : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50"
        >
            <nav className="max-w-7xl mx-auto py-5 flex items-center justify-between px-6 md:px-10">
                {/* Logo */}
                <Link href="/" className="group relative">
                    <motion.h1
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`text-3xl md:text-4xl font-extrabold tracking-tight transition-colors duration-300 ${isWhite
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                                : "text-white"
                            }`}
                    >
                        Rydeon
                    </motion.h1>
                    <span
                        className={`absolute -bottom-1 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 rounded-full ${isWhite ? "bg-indigo-500" : "bg-white"
                            }`}
                    />
                </Link>

                {/* Desktop links */}
                <div className="hidden lg:flex items-center gap-1">
                    {tag.map((item) => {
                        const active = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${isWhite
                                        ? active
                                            ? "text-indigo-600"
                                            : "text-slate-700 hover:text-indigo-600"
                                        : active
                                            ? "text-white"
                                            : "text-white/80 hover:text-white"
                                    }`}
                            >
                                {item.name}
                                {active && (
                                    <motion.span
                                        layoutId="nav-active-pill"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        className={`absolute inset-0 -z-10 rounded-full ${isWhite ? "bg-indigo-50" : "bg-white/10"
                                            }`}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/book-ride">
                        <motion.span
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white pl-6 pr-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 transition-shadow duration-300"
                        >
                            Book Ride
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </motion.span>
                    </Link>

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        aria-label="Toggle menu"
                        className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm shadow-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isWhite
                                ? "bg-slate-900 text-white hover:bg-slate-800"
                                : "bg-white text-slate-900 hover:bg-slate-100"
                            }`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={open ? "close" : "open"}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex"
                            >
                                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                            </motion.span>
                        </AnimatePresence>
                        Menu
                    </motion.button>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-label="Toggle menu"
                    className={`md:hidden flex items-center justify-center w-11 h-11 rounded-xl shadow-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isWhite
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-900"
                        }`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={open ? "close" : "open"}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex"
                        >
                            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.span>
                    </AnimatePresence>
                </button>
            </nav>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white/95 backdrop-blur-xl shadow-xl rounded-b-2xl overflow-hidden"
                    >
                        <motion.div
                            initial="closed"
                            animate="open"
                            variants={{
                                open: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
                                closed: {},
                            }}
                            className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-col divide-y divide-slate-100"
                        >
                            {tag.map((item) => {
                                const active = pathname === item.path;
                                return (
                                    <motion.div
                                        key={item.path}
                                        variants={{
                                            closed: { opacity: 0, x: -12 },
                                            open: { opacity: 1, x: 0 },
                                        }}
                                    >
                                        <Link
                                            href={item.path}
                                            onClick={() => setOpen(false)}
                                            className={`group flex items-center justify-between py-4 text-lg font-semibold transition-colors duration-300 ${active
                                                    ? "text-indigo-600"
                                                    : "text-slate-800 hover:text-indigo-600"
                                                }`}
                                        >
                                            {item.name}
                                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            <motion.div
                                variants={{
                                    closed: { opacity: 0, x: -12 },
                                    open: { opacity: 1, x: 0 },
                                }}
                                className="pt-5 md:hidden"
                            >
                                <Link
                                    href="/book-ride"
                                    onClick={() => setOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-full font-semibold shadow-lg shadow-indigo-600/20"
                                >
                                    Book Ride
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}