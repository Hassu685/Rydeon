"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Globe, Lock, Trash2, CheckCircle2, X } from "lucide-react";
import { apiFetch, clearAuth } from "@/lib/api";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

function Toggle({ enabled, onChange, disabled }) {
    return (
        <button
            onClick={onChange}
            disabled={disabled}
            className={`relative h-6 w-11 rounded-full transition-colors duration-300 disabled:opacity-50 ${enabled ? "bg-blue-600" : "bg-slate-200"
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

const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]";

export default function SettingsPage() {
    const router = useRouter();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savingPrefs, setSavingPrefs] = useState(false);
    const [error, setError] = useState(null);
    const [prefsSaved, setPrefsSaved] = useState(false);

    // Change password
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Delete account
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        apiFetch("/api/driver/profile")
            .then((data) => {
                if (!cancelled) {
                    setProfile({
                        ...data.driver,
                        preferences: {
                            pushNotifications: true,
                            rideSoundAlerts: true,
                            language: "en",
                            ...(data.driver.preferences || {}),
                        },
                    });
                }
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

    async function updatePreference(key, value) {
        setPrefsSaved(false);
        const optimisticPrefs = { ...profile.preferences, [key]: value };
        setProfile((p) => ({ ...p, preferences: optimisticPrefs }));

        setSavingPrefs(true);
        try {
            const data = await apiFetch("/api/driver/profile", {
                method: "PUT",
                body: JSON.stringify({ preferences: { [key]: value } }),
            });
            setProfile(data.driver);
            setPrefsSaved(true);
        } catch (err) {
            setError(err.message);
            // revert optimistic change on failure
            setProfile((p) => ({
                ...p,
                preferences: { ...p.preferences, [key]: !value },
            }));
        } finally {
            setSavingPrefs(false);
        }
    }

    async function handleLanguageChange(e) {
        const language = e.target.value;
        setProfile((p) => ({ ...p, preferences: { ...p.preferences, language } }));
        try {
            const data = await apiFetch("/api/driver/profile", {
                method: "PUT",
                body: JSON.stringify({ preferences: { language } }),
            });
            setProfile(data.driver);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleChangePassword(e) {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);
        setPasswordSaving(true);
        try {
            await apiFetch("/api/driver/change-password", {
                method: "PUT",
                body: JSON.stringify(passwordForm),
            });
            setPasswordSuccess(true);
            setPasswordForm({ currentPassword: "", newPassword: "" });
            setTimeout(() => setShowPasswordForm(false), 1500);
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setPasswordSaving(false);
        }
    }

    async function handleDeleteAccount() {
        setDeleting(true);
        try {
            await apiFetch("/api/driver/account", { method: "DELETE" });
            clearAuth();
            router.replace("/login");
        } catch (err) {
            setError(err.message);
            setDeleting(false);
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

    const isGoogleAccount = profile?.authProvider === "google";

    return (
        <>
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600 mb-6">
                    {error}
                </div>
            )}

            {/* Preferences */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
            >
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Preferences</h3>
                    {prefsSaved && (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Saved
                        </span>
                    )}
                </div>

                <div className="divide-y divide-slate-100">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <Bell className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Push Notifications</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Receive alerts for new ride requests and updates.
                                </p>
                            </div>
                        </div>
                        <Toggle
                            enabled={profile.preferences.pushNotifications}
                            disabled={savingPrefs}
                            onChange={() =>
                                updatePreference("pushNotifications", !profile.preferences.pushNotifications)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <Bell className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Ride Sound Alerts</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Play a sound when a new ride request comes in.
                                </p>
                            </div>
                        </div>
                        <Toggle
                            enabled={profile.preferences.rideSoundAlerts}
                            disabled={savingPrefs}
                            onChange={() =>
                                updatePreference("rideSoundAlerts", !profile.preferences.rideSoundAlerts)
                            }
                        />
                    </div>
                </div>

                {/* Note: a "Dark Mode" toggle was removed here — the dashboard has no
                    dark theme built yet, so the toggle wouldn't have changed anything. */}
            </motion.div>

            {/* Language */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={1}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm mt-6"
            >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">
                    Language & Region
                </h3>

                <div className="relative">
                    <Globe className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                    <select
                        value={profile.preferences.language}
                        onChange={handleLanguageChange}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                    >
                        <option value="en">English (US)</option>
                        <option value="ur">اردو</option>
                        <option value="pa">پنجابی</option>
                    </select>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                    Saved to your account — the dashboard itself isn't translated yet, this just
                    remembers your preference.
                </p>
            </motion.div>

            {/* Account actions */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={2}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm mt-6"
            >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">Account</h3>

                <div className="space-y-3">
                    {isGoogleAccount ? (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-500">
                            Your account signs in with Google — there's no password to change here.
                        </div>
                    ) : !showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="w-full flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                        >
                            <Lock className="h-4.5 w-4.5 text-slate-400" />
                            Change Password
                        </button>
                    ) : (
                        <form
                            onSubmit={handleChangePassword}
                            className="rounded-xl border border-slate-200 p-4 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-900">Change Password</p>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {passwordError && (
                                <p className="text-xs text-red-600">{passwordError}</p>
                            )}
                            {passwordSuccess && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Password updated
                                </p>
                            )}

                            <input
                                type="password"
                                required
                                placeholder="Current password"
                                value={passwordForm.currentPassword}
                                onChange={(e) =>
                                    setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))
                                }
                                className={fieldClass}
                            />
                            <input
                                type="password"
                                required
                                minLength={8}
                                placeholder="New password (min. 8 characters)"
                                value={passwordForm.newPassword}
                                onChange={(e) =>
                                    setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))
                                }
                                className={fieldClass}
                            />

                            <button
                                type="submit"
                                disabled={passwordSaving}
                                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-60"
                            >
                                {passwordSaving ? "Updating…" : "Update Password"}
                            </button>
                        </form>
                    )}

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full flex items-center gap-3 rounded-xl border border-red-100 px-4 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="h-4.5 w-4.5" />
                            Delete Account
                        </button>
                    ) : (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
                            <p className="text-sm font-semibold text-red-700">
                                Are you sure? This permanently deletes your account.
                            </p>
                            <p className="text-xs text-red-600">
                                This can't be undone. Your past trip records will remain in the
                                system, but you won't be able to log in again.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleting}
                                    className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    {deleting ? "Deleting…" : "Yes, Delete"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}