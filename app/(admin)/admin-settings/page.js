"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, MapPinned, ShieldCheck, X, CheckCircle2 } from "lucide-react";
import { adminApiFetch } from "@/lib/adminApi";

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

function Toggle({ enabled, onChange }) {
    return (
        <button
            onClick={onChange}
            className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${enabled ? "bg-blue-600" : "bg-slate-200"
                }`}
        >
            <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm ${enabled ? "left-5.5" : "left-0.5"
                    }`}
            />
        </button>
    );
}

export default function AdminSettingsPage() {
    const [form, setForm] = useState(null);
    const [newCity, setNewCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let cancelled = false;
        adminApiFetch("/api/admin/settings")
            .then((data) => {
                if (!cancelled) setForm(data.settings);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    function updateField(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
        setSaved(false);
    }

    function addCity() {
        const trimmed = newCity.trim();
        if (!trimmed || form.serviceZones.includes(trimmed)) return;
        updateField("serviceZones", [...form.serviceZones, trimmed]);
        setNewCity("");
    }

    function removeCity(city) {
        updateField("serviceZones", form.serviceZones.filter((c) => c !== city));
    }

    async function handleSave() {
        setSaving(true);
        setError(null);
        try {
            const data = await adminApiFetch("/api/admin/settings", {
                method: "PUT",
                body: JSON.stringify({
                    baseFare: Number(form.baseFare),
                    perKmRate: Number(form.perKmRate),
                    commissionPct: Number(form.commissionPct),
                    surgePricingEnabled: form.surgePricingEnabled,
                    maintenanceMode: form.maintenanceMode,
                    serviceZones: form.serviceZones,
                }),
            });
            setForm(data.settings);
            setSaved(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-40 rounded-2xl bg-white border border-slate-200 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <>
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600 mb-6">
                    {error}
                </div>
            )}

            {/* Fare settings */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Fare Settings</h3>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Base Fare (₹)</label>
                        <input
                            type="number"
                            min="0"
                            value={form.baseFare}
                            onChange={(e) => updateField("baseFare", e.target.value)}
                            className={fieldClass}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Per KM Rate (₹)</label>
                        <input
                            type="number"
                            min="0"
                            value={form.perKmRate}
                            onChange={(e) => updateField("perKmRate", e.target.value)}
                            className={fieldClass}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Platform Commission (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={form.commissionPct}
                            onChange={(e) => updateField("commissionPct", e.target.value)}
                            className={fieldClass}
                        />
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Surge Pricing</p>
                        <p className="text-xs text-slate-500 mt-0.5">Automatically adjust fares during high demand.</p>
                    </div>
                    <Toggle
                        enabled={form.surgePricingEnabled}
                        onChange={() => updateField("surgePricingEnabled", !form.surgePricingEnabled)}
                    />
                </div>
            </motion.div>

            {/* Service zones */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={1}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm mt-6"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <MapPinned className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Service Zones</h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {form.serviceZones.length === 0 ? (
                        <p className="text-sm text-slate-400">No service zones added yet.</p>
                    ) : (
                        form.serviceZones.map((city) => (
                            <span
                                key={city}
                                className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium"
                            >
                                {city}
                                <button
                                    onClick={() => removeCity(city)}
                                    className="text-blue-400 hover:text-blue-700"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ))
                    )}
                </div>

                <div className="flex gap-2">
                    <input
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCity())}
                        placeholder="Add a city (e.g. Peshawar)"
                        className={`${fieldClass} max-w-xs`}
                    />
                    <button
                        onClick={addCity}
                        className="rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                        + Add City
                    </button>
                </div>
            </motion.div>

            {/* System controls */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={2}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm mt-6"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">System Controls</h3>
                </div>

                <div className="flex items-center justify-between py-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Maintenance Mode</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Marks the platform as under maintenance. Note: this flag is now
                            saved, but no page currently checks it to actually block bookings —
                            that enforcement would need to be added wherever bookings are created.
                        </p>
                    </div>
                    <Toggle
                        enabled={form.maintenanceMode}
                        onChange={() => updateField("maintenanceMode", !form.maintenanceMode)}
                    />
                </div>
            </motion.div>

            <div className="mt-6 flex items-center gap-4">
                <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-500/40 transition-shadow disabled:opacity-60"
                >
                    {saving ? "Saving…" : "Save Settings"}
                </motion.button>

                {saved && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Settings saved
                    </span>
                )}
            </div>
        </>
    );
}