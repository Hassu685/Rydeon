"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Car, Camera } from "lucide-react";

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

export default function ProfilePage() {
    return (
        <div className="grid lg:grid-cols-3 gap-6">

            {/* Profile card */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm text-center h-fit"
            >
                <div className="relative mx-auto w-24 h-24">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-3xl font-bold">
                        HK
                    </div>
                    <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 shadow-md hover:bg-slate-50 transition-colors">
                        <Camera className="h-4 w-4 text-slate-600" />
                    </button>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">Hamza Khan</h3>
                <p className="text-sm text-slate-500">Driver ID: RYD-10293</p>

                <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-left">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        Verification Status
                    </p>
                    <p className="mt-1 text-sm text-blue-600">✓ Fully Verified Driver</p>
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
                            <input defaultValue="Hamza Khan" className={`${fieldClass} pl-11`} />
                        </div>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                            <input defaultValue="hamza.khan@email.com" className={`${fieldClass} pl-11`} />
                        </div>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                            <input defaultValue="+92 300 1234567" className={`${fieldClass} pl-11`} />
                        </div>
                        <div className="relative">
                            <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                            <input defaultValue="Gulberg, Lahore" className={`${fieldClass} pl-11`} />
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
                            <input defaultValue="Suzuki Alto 2021" className={`${fieldClass} pl-11`} />
                        </div>
                        <input defaultValue="LEA-2024" className={fieldClass} placeholder="Plate Number" />
                        <input defaultValue="White" className={fieldClass} placeholder="Color" />
                        <input defaultValue="Car Economy" className={fieldClass} placeholder="Ride Type" />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-500/40 transition-shadow"
                >
                    Save Changes
                </motion.button>
            </motion.div>
        </div>
    );
}