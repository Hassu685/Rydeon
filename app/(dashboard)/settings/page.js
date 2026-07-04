"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Globe, Lock, Trash2 } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

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

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [rideAlerts, setRideAlerts] = useState(true);

    const toggleItems = [
        {
            icon: Bell,
            title: "Push Notifications",
            desc: "Receive alerts for new ride requests and updates.",
            value: notifications,
            onChange: () => setNotifications(!notifications),
        },
        {
            icon: Moon,
            title: "Dark Mode",
            desc: "Switch the dashboard to a darker color theme.",
            value: darkMode,
            onChange: () => setDarkMode(!darkMode),
        },
        {
            icon: Bell,
            title: "Ride Sound Alerts",
            desc: "Play a sound when a new ride request comes in.",
            value: rideAlerts,
            onChange: () => setRideAlerts(!rideAlerts),
        },
    ];

    return (
        <>
            {/* Preferences */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
            >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">
                    Preferences
                </h3>

                <div className="divide-y divide-slate-100">
                    {toggleItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.title} className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                        <Icon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                                <Toggle enabled={item.value} onChange={item.onChange} />
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Language */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={1}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
            >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">
                    Language & Region
                </h3>

                <div className="relative">
                    <Globe className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                    <select className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white">
                        <option>English (US)</option>
                        <option>اردو</option>
                        <option>پنجابی</option>
                    </select>
                </div>
            </motion.div>

            {/* Account actions */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={2}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
            >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">
                    Account
                </h3>

                <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                        <Lock className="h-4.5 w-4.5 text-slate-400" />
                        Change Password
                    </button>

                    <button className="w-full flex items-center gap-3 rounded-xl border border-red-100 px-4 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4.5 w-4.5" />
                        Delete Account
                    </button>
                </div>
            </motion.div>
        </>
    );
}