"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Navigation,
    User,
    Phone,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Clock,
    AlertCircle,
} from "lucide-react";
import { rideOptions } from "../lib/ride-options";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

function BookRideContent() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get("type");

    const [selected, setSelected] = useState(rideOptions[0].slug);
    const [form, setForm] = useState({
        pickup: "",
        dropoff: "",
        name: "",
        phone: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [booking, setBooking] = useState(null); // { bookingId, status, estimatedFare, driverName, tripCode }
    const pollRef = useRef(null);

    useEffect(() => {
        if (typeParam && rideOptions.some((r) => r.slug === typeParam)) {
            setSelected(typeParam);
        }
    }, [typeParam]);

    const activeRide = rideOptions.find((r) => r.slug === selected) ?? rideOptions[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    riderName: form.name,
                    phone: form.phone,
                    pickup: form.pickup,
                    drop: form.dropoff,
                    rideType: selected,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            setBooking({
                bookingId: data.bookingId,
                status: data.status,
                estimatedFare: data.estimatedFare,
                driverName: null,
                tripCode: null,
            });
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    // Poll for driver acceptance every 3s while a booking is pending
    useEffect(() => {
        if (!booking || booking.status !== "pending") return;

        pollRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/bookings/${booking.bookingId}`);
                const data = await res.json();
                if (!res.ok) return;

                setBooking((b) => (b ? { ...b, ...data } : b));

                if (data.status !== "pending") {
                    clearInterval(pollRef.current);
                }
            } catch {
                // silently retry on next tick
            }
        }, 3000);

        return () => clearInterval(pollRef.current);
    }, [booking?.bookingId, booking?.status]);

    function resetBooking() {
        setBooking(null);
        setSubmitError(null);
        setForm({ pickup: "", dropoff: "", name: "", phone: "" });
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 sm:py-20 px-5 sm:px-6">
            <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-500/10 blur-[100px] sm:blur-[140px]" />
            <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 blur-[100px] sm:blur-[140px]" />

            <div className="relative max-w-6xl mx-auto">
                <motion.div
                    initial="hidden"
                    animate="show"
                    className="text-center mt-20 mb-10 sm:mb-14"
                >
                    <motion.span
                        variants={fadeUp}
                        custom={0}
                        className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-[3px] sm:tracking-[4px] text-blue-700"
                    >
                        Book A Ride
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
                    >
                        Choose Your Ride,{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            We'll Handle the Rest
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto"
                    >
                        Pick a ride type, add your trip details, and we'll get a driver to you
                        right away. (Scheduled bookings for later aren't supported yet — this
                        books an immediate ride.)
                    </motion.p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {booking ? (
                        /* ---------- STATUS / SUCCESS STATE ---------- */
                        <motion.div
                            key="status"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl mx-auto rounded-3xl border border-blue-100 bg-white p-8 sm:p-10 text-center shadow-xl shadow-blue-900/5"
                        >
                            {booking.status === "pending" && (
                                <>
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                    </div>
                                    <h2 className="mt-5 text-2xl font-bold text-slate-900">
                                        Finding you a driver…
                                    </h2>
                                    <p className="mt-2 text-slate-500 text-sm sm:text-base">
                                        We've sent your request to a nearby{" "}
                                        <span className="font-semibold text-slate-700">{activeRide.title}</span> driver.
                                        This page will update automatically once they accept.
                                    </p>
                                </>
                            )}

                            {booking.status === "accepted" && (
                                <>
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                                        <CheckCircle2 className="h-9 w-9 text-green-600" />
                                    </div>
                                    <h2 className="mt-5 text-2xl font-bold text-slate-900">
                                        Ride Confirmed!
                                    </h2>
                                    <p className="mt-2 text-slate-500 text-sm sm:text-base">
                                        <span className="font-semibold text-slate-700">
                                            {booking.driverName}
                                        </span>{" "}
                                        is on the way.
                                    </p>
                                </>
                            )}

                            {booking.status === "declined" && (
                                <>
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                                        <AlertCircle className="h-8 w-8 text-red-600" />
                                    </div>
                                    <h2 className="mt-5 text-2xl font-bold text-slate-900">
                                        Driver Unavailable
                                    </h2>
                                    <p className="mt-2 text-slate-500 text-sm sm:text-base">
                                        That driver couldn't take this ride. Please try booking again.
                                    </p>
                                </>
                            )}

                            <div className="mt-6 rounded-2xl bg-[#f8fbff] border border-blue-50 p-5 text-left text-sm text-slate-600 space-y-2">
                                <p><span className="font-semibold text-slate-800">Pickup:</span> {form.pickup || "—"}</p>
                                <p><span className="font-semibold text-slate-800">Drop-off:</span> {form.dropoff || "—"}</p>
                                <p><span className="font-semibold text-slate-800">Estimated Fare:</span> ₹{booking.estimatedFare}</p>
                                {booking.tripCode && (
                                    <p><span className="font-semibold text-slate-800">Trip Code:</span> {booking.tripCode}</p>
                                )}
                            </div>

                            <button
                                onClick={resetBooking}
                                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition"
                            >
                                Book Another Ride
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ) : (
                        /* ---------- BOOKING FORM ---------- */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid lg:grid-cols-3 gap-8 sm:gap-10"
                        >
                            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 sm:space-y-8">
                                {submitError && (
                                    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                                        {submitError}
                                    </div>
                                )}

                                {/* Step 1 — Ride type */}
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={fadeUp}
                                    custom={3}
                                    className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm"
                                >
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
                                        1. Select Ride Type
                                    </h3>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                        {rideOptions.map((ride) => {
                                            const Icon = ride.icon;
                                            const isActive = ride.slug === selected;
                                            return (
                                                <button
                                                    type="button"
                                                    key={ride.slug}
                                                    onClick={() => setSelected(ride.slug)}
                                                    className={`group relative rounded-2xl border p-3 sm:p-4 text-left transition-all duration-300 ${isActive
                                                            ? "border-blue-600 bg-blue-50/70 shadow-md shadow-blue-600/10"
                                                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
                                                        }`}
                                                >
                                                    {isActive && (
                                                        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                                        </span>
                                                    )}

                                                    <div className="relative h-16 sm:h-20 w-full overflow-hidden rounded-xl bg-slate-100">
                                                        <Image src={ride.image} alt={ride.title} fill className="object-cover" />
                                                    </div>

                                                    <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5">
                                                        <Icon className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                                                            {ride.title}
                                                        </p>
                                                    </div>
                                                    <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">
                                                        {ride.rate} · {ride.eta} away
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Step 2 — Trip details (no date/time — immediate dispatch only) */}
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={fadeUp}
                                    custom={4}
                                    className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm"
                                >
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
                                        2. Trip Details
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                            <input
                                                name="pickup"
                                                value={form.pickup}
                                                onChange={handleChange}
                                                required
                                                placeholder="Pickup location"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Navigation className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                            <input
                                                name="dropoff"
                                                value={form.dropoff}
                                                onChange={handleChange}
                                                required
                                                placeholder="Drop-off location"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 rounded-xl bg-blue-50/60 px-4 py-3 text-xs text-blue-700">
                                            <Clock className="h-4 w-4 shrink-0" />
                                            This books a ride right now — scheduled pickups aren't supported yet.
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Step 3 — Contact info */}
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={fadeUp}
                                    custom={5}
                                    className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm"
                                >
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
                                        3. Your Details
                                    </h3>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Full name"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="Mobile number"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial="hidden"
                                    animate="show"
                                    variants={fadeUp}
                                    custom={6}
                                    type="submit"
                                    disabled={submitting}
                                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-blue-900/20 transition-shadow hover:shadow-blue-500/40 disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
                                    {submitting ? "Finding a driver…" : `Confirm & Book ${activeRide.title} →`}
                                </motion.button>
                            </form>

                            {/* RIGHT — sticky summary */}
                            <motion.div
                                initial="hidden"
                                animate="show"
                                variants={fadeUp}
                                custom={4}
                                className="lg:sticky lg:top-24 h-fit"
                            >
                                <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
                                        Trip Summary
                                    </h3>

                                    <div className="relative h-32 sm:h-36 w-full overflow-hidden rounded-2xl bg-[#f8fbff]">
                                        <Image src={activeRide.image} alt={activeRide.title} fill className="object-contain p-4" />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="font-semibold text-slate-900">{activeRide.title}</p>
                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                            {activeRide.eta} away
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                        {activeRide.tagline}
                                    </p>

                                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                                        <div className="flex justify-between text-slate-500">
                                            <span>Rate</span>
                                            <span className="font-medium text-slate-800">{activeRide.rate}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Estimated Fare</span>
                                            <span className="font-medium text-slate-800">{activeRide.fareRange}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Pickup</span>
                                            <span className="font-medium text-slate-800 truncate max-w-[140px]">
                                                {form.pickup || "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Drop-off</span>
                                            <span className="font-medium text-slate-800 truncate max-w-[140px]">
                                                {form.dropoff || "—"}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[11px] text-slate-400">
                                        Final fare is calculated from the platform's base rate — the
                                        exact number shows up once your ride is confirmed.
                                    </p>
                                </div>

                                <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
                                    <p className="font-semibold">Need help booking?</p>
                                    <p className="mt-1 text-sm text-blue-100">
                                        Our support team is available 24/7.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

export default function BookRidePage() {
    return (
        <Suspense fallback={null}>
            <BookRideContent />
        </Suspense>
    );
}