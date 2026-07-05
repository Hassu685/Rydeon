"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Car, Hash, CheckCircle2, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useDriver } from "@/contexts/drivercontext";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]";

const readOnlyFieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 cursor-not-allowed";

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
    const { setDriver } = useDriver();

    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        vehicleMake: "",
        vehicleModel: "",
        plateNumber: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await apiFetch("/api/driver/profile");
                if (cancelled) return;
                setProfile(data.driver);
                setForm({
                    name: data.driver.name || "",
                    phone: data.driver.phone || "",
                    vehicleMake: data.driver.vehicle?.make || "",
                    vehicleModel: data.driver.vehicle?.model || "",
                    plateNumber: data.driver.vehicle?.plateNumber || "",
                });
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setSaved(false);
    }

    async function handleSave() {
        setSaving(true);
        setError(null);
        try {
            const data = await apiFetch("/api/driver/profile", {
                method: "PUT",
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    vehicle: {
                        make: form.vehicleMake,
                        model: form.vehicleModel,
                        plateNumber: form.plateNumber,
                    },
                }),
            });

            setProfile(data.driver);
            setSaved(true);

            // Keep Sidebar/Topbar name + localStorage in sync immediately.
            setDriver(data.driver);
            localStorage.setItem("driverData", JSON.stringify(data.driver));
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse" />
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse" />
                    <div className="h-40 rounded-2xl bg-white border border-slate-200 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {error && (
                <div className="lg:col-span-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Profile card */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm text-center h-fit"
            >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-3xl font-bold">
                    {getInitials(profile?.name)}
                </div>
                {/* Note: profile photo upload isn't supported by the backend yet — no avatar field on the Driver model. */}

                <h3 className="mt-4 text-lg font-bold text-slate-900">{profile?.name}</h3>
                <p className="text-sm text-slate-500 font-mono">
                    ID: {profile?._id?.slice(-8).toUpperCase()}
                </p>

                <div
                    className={`mt-5 rounded-2xl p-4 text-left ${profile?.isSuspended ? "bg-red-50" : "bg-blue-50"
                        }`}
                >
                    <p
                        className={`text-xs font-semibold uppercase tracking-wide ${profile?.isSuspended ? "text-red-700" : "text-blue-700"
                            }`}
                    >
                        Account Status
                    </p>
                    <p
                        className={`mt-1 flex items-center gap-1.5 text-sm ${profile?.isSuspended ? "text-red-600" : "text-blue-600"
                            }`}
                    >
                        {profile?.isSuspended ? (
                            <>
                                <AlertTriangle className="h-4 w-4" /> Suspended by admin
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4" /> Active
                            </>
                        )}
                    </p>
                </div>
            </motion.div>

            {/* Personal + vehicle info */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={1}
                className="lg:col-span-2 space-y-6"
            >
                {/* Personal info */}
                <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">
                        Personal Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={`${fieldClass} pl-11`}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                            <input
                                value={profile?.email || ""}
                                disabled
                                title="Email can't be changed here"
                                className={`${readOnlyFieldClass} pl-11`}
                            />
                        </div>
                        <div className="relative sm:col-span-2">
                            <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Mobile number"
                                className={`${fieldClass} pl-11`}
                            />
                        </div>
                    </div>
                </div>

                {/* Vehicle info */}
                <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">
                        Vehicle Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <Car className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                            <input
                                name="vehicleMake"
                                value={form.vehicleMake}
                                onChange={handleChange}
                                placeholder="Make (e.g. Suzuki)"
                                className={`${fieldClass} pl-11`}
                            />
                        </div>
                        <input
                            name="vehicleModel"
                            value={form.vehicleModel}
                            onChange={handleChange}
                            placeholder="Model (e.g. Alto 2021)"
                            className={fieldClass}
                        />
                        <div className="relative sm:col-span-2">
                            <Hash className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                            <input
                                name="plateNumber"
                                value={form.plateNumber}
                                onChange={handleChange}
                                placeholder="Plate number"
                                className={`${fieldClass} pl-11`}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <motion.button
                        onClick={handleSave}
                        disabled={saving}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-500/40 transition-shadow disabled:opacity-60"
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </motion.button>

                    {saved && (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Saved
                        </span>
                    )}
                </div>
            </motion.div>
        </div>
    );
}