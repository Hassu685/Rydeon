"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, MapPinned, Bell, ShieldCheck } from "lucide-react";

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
    const [autoApprove, setAutoApprove] = useState(false);
    const [maintenance, setMaintenance] = useState(false);
    const [surgePricing, setSurgePricing] = useState(true);

    return (
        <>
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
                        <input defaultValue="60" className={fieldClass} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Per KM Rate (₹)</label>
                        <input defaultValue="11" className={fieldClass} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Platform Commission (%)</label>
                        <input defaultValue="15" className={fieldClass} />
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Surge Pricing</p>
                        <p className="text-xs text-slate-500 mt-0.5">Automatically adjust fares during high demand.</p>
                    </div>
                    <Toggle enabled={surgePricing} onChange={() => setSurgePricing(!surgePricing)} />
                </div>
            </motion.div>

            {/* Service zones */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={1}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <MapPinned className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Service Zones</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                    {["Lahore", "Karachi", "Islamabad", "Faisalabad", "Multan"].map((city) => (
                        <span
                            key={city}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium"
                        >
                            {city}
                        </span>
                    ))}
                    <button className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                        + Add City
                    </button>
                </div>
            </motion.div>

            {/* Approvals + system */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={2}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">System Controls</h3>
                </div>

                <div className="divide-y divide-slate-100">
                    <div className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Auto-approve Drivers</p>
                            <p className="text-xs text-slate-500 mt-0.5">Skip manual review for new driver applications.</p>
                        </div>
                        <Toggle enabled={autoApprove} onChange={() => setAutoApprove(!autoApprove)} />
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Maintenance Mode</p>
                            <p className="text-xs text-slate-500 mt-0.5">Temporarily disable new bookings platform-wide.</p>
                        </div>
                        <Toggle enabled={maintenance} onChange={() => setMaintenance(!maintenance)} />
                    </div>
                </div>
            </motion.div>

            <motion.button
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={3}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-500/40 transition-shadow"
            >
                Save Settings
            </motion.button>
        </>
    );
}