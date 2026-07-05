"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Zap, Eye, EyeOff, Loader2, Car, Star, Clock } from "lucide-react";

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48">
            <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
            />
            <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />
            <path
                fill="#4CAF50"
                d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.7 27 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 39.6 16.3 44 24 44z"
            />
            <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6c-.5.4 7.3-5.3 7.3-15.8 0-1.3-.1-2.7-.4-3.5z"
            />
        </svg>
    );
}

export default function AuthPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [signInForm, setSignInForm] = useState({ email: "", password: "" });
    const [signUpForm, setSignUpForm] = useState({ name: "", email: "", phone: "", password: "" });

    async function handleSignIn(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signInForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid email or password");

            localStorage.setItem("driverToken", data.token);
            localStorage.setItem("driverData", JSON.stringify(data.driver));
            router.push("/driver-dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSignUp(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signUpForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Couldn't create your account");

            localStorage.setItem("driverToken", data.token);
            localStorage.setItem("driverData", JSON.stringify(data.driver));
            router.push("/driver-dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleGoogle() {
        signIn("google", { callbackUrl: "/auth/google/finish" });
    }

    function switchMode(mode) {
        setError(null);
        setIsSignUp(mode);
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0A0D16] flex items-center justify-center px-4 py-10">
            {/* Ambient background glow, matching the marketing site's bokeh-light hero */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]" />

            {/* Logo */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-10 flex items-center gap-2">
                <span className="text-xl font-extrabold text-white tracking-tight">Rydeon</span>
            </div>

            <div className="auth-card relative w-full max-w-[900px] min-h-[560px] rounded-[28px] border border-white/10 bg-[#10131F] shadow-2xl shadow-black/40 overflow-hidden">
                {/* ---------- Mobile layout (stacked, no slide) ---------- */}
                <div className="md:hidden p-7 sm:p-9">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1.5">
                        <Zap className="h-3 w-3" />
                        Driver Portal
                    </span>
                    <h1 className="mt-5 text-2xl font-extrabold text-white">
                        {isSignUp ? "Create your account" : "Welcome back"}
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-400">
                        {isSignUp
                            ? "Start earning with Rydeon in minutes."
                            : "Sign in to manage your rides and earnings."}
                    </p>

                    {error && (
                        <p className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2">
                            {error}
                        </p>
                    )}

                    {isSignUp ? (
                        <MobileSignUpForm
                            form={signUpForm}
                            setForm={setSignUpForm}
                            onSubmit={handleSignUp}
                            loading={loading}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                    ) : (
                        <MobileSignInForm
                            form={signInForm}
                            setForm={setSignInForm}
                            onSubmit={handleSignIn}
                            loading={loading}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                    )}

                    <GoogleDivider onGoogle={handleGoogle} />

                    <p className="mt-6 text-center text-sm text-slate-400">
                        {isSignUp ? "Already have an account?" : "New driver?"}{" "}
                        <button
                            onClick={() => switchMode(!isSignUp)}
                            className="font-semibold text-blue-400 hover:text-blue-300"
                        >
                            {isSignUp ? "Sign in" : "Create one"}
                        </button>
                    </p>
                </div>

                {/* ---------- Desktop sliding layout ---------- */}
                <div className={`hidden md:block h-full ${isSignUp ? "right-panel-active" : ""}`}>
                    {/* Sign In form */}
                    <div className="form-container sign-in-container">
                        <form onSubmit={handleSignIn} className="flex h-full flex-col justify-center px-12">
                            <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1.5">
                                <Zap className="h-3 w-3" />
                                Driver Portal
                            </span>
                            <h1 className="text-2xl font-extrabold text-white">Welcome back</h1>
                            <p className="mt-1.5 mb-6 text-sm text-slate-400">
                                Sign in to manage your rides and earnings.
                            </p>

                            {error && !isSignUp && (
                                <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2">
                                    {error}
                                </p>
                            )}

                            <FieldLabel>Email</FieldLabel>
                            <input
                                type="email"
                                required
                                value={signInForm.email}
                                onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                                placeholder="you@example.com"
                                className="auth-input"
                            />

                            <div className="mt-4 flex items-center justify-between">
                                <FieldLabel>Password</FieldLabel>
                                <button type="button" className="text-xs text-blue-400 hover:text-blue-300">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={signInForm.password}
                                    onChange={(e) =>
                                        setSignInForm({ ...signInForm, password: e.target.value })
                                    }
                                    placeholder="••••••••"
                                    className="auth-input pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            <button type="submit" disabled={loading} className="auth-btn-primary mt-6">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Sign In"}
                            </button>

                            <GoogleDivider onGoogle={handleGoogle} />
                        </form>
                    </div>

                    {/* Sign Up form */}
                    <div className="form-container sign-up-container">
                        <form onSubmit={handleSignUp} className="flex h-full flex-col justify-center px-12">
                            <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1.5">
                                <Zap className="h-3 w-3" />
                                Driver Portal
                            </span>
                            <h1 className="text-2xl font-extrabold text-white">Create your account</h1>
                            <p className="mt-1.5 mb-5 text-sm text-slate-400">
                                Start earning with Rydeon in minutes.
                            </p>

                            {error && isSignUp && (
                                <p className="mb-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2">
                                    {error}
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <FieldLabel>Full name</FieldLabel>
                                    <input
                                        required
                                        value={signUpForm.name}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                                        placeholder="Ali Khan"
                                        className="auth-input"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Phone</FieldLabel>
                                    <input
                                        value={signUpForm.phone}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                                        placeholder="03xx-xxxxxxx"
                                        className="auth-input"
                                    />
                                </div>
                            </div>

                            <div className="mt-3">
                                <FieldLabel>Email</FieldLabel>
                                <input
                                    type="email"
                                    required
                                    value={signUpForm.email}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="auth-input"
                                />
                            </div>

                            <div className="mt-3">
                                <FieldLabel>Password</FieldLabel>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={signUpForm.password}
                                        onChange={(e) =>
                                            setSignUpForm({ ...signUpForm, password: e.target.value })
                                        }
                                        placeholder="At least 6 characters"
                                        className="auth-input pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="auth-btn-primary mt-5">
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Sliding overlay */}
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h2 className="text-2xl font-extrabold text-white">New here?</h2>
                                <p className="mt-3 text-sm text-blue-100/90 leading-relaxed">
                                    Create a driver account and start picking up rides across the
                                    city today.
                                </p>
                                <button
                                    onClick={() => switchMode(false)}
                                    className="mt-7 rounded-full border-2 border-white/70 px-8 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                                >
                                    Sign In
                                </button>
                                <StatsStrip />
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h2 className="text-2xl font-extrabold text-white">
                                    Already driving with us?
                                </h2>
                                <p className="mt-3 text-sm text-blue-100/90 leading-relaxed">
                                    Sign in to see today's requests, your earnings, and your trip
                                    history.
                                </p>
                                <button
                                    onClick={() => switchMode(true)}
                                    className="mt-7 rounded-full border-2 border-white/70 px-8 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                                >
                                    Create Account
                                </button>
                                <StatsStrip />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .form-container {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    width: 50%;
                    transition: transform 0.7s ease-in-out, opacity 0.6s ease-in-out;
                }
                .sign-in-container {
                    left: 0;
                    z-index: 2;
                }
                .sign-up-container {
                    left: 0;
                    opacity: 0;
                    z-index: 1;
                }
                .right-panel-active .sign-in-container {
                    transform: translateX(100%);
                    opacity: 0;
                }
                .right-panel-active .sign-up-container {
                    transform: translateX(100%);
                    opacity: 1;
                    z-index: 5;
                }
                .overlay-container {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 50%;
                    height: 100%;
                    overflow: hidden;
                    transition: transform 0.7s ease-in-out;
                    z-index: 100;
                }
                .right-panel-active .overlay-container {
                    transform: translateX(-100%);
                }
                .overlay {
                    background: linear-gradient(135deg, #4f6df3 0%, #6d5bf7 50%, #8b5cf6 100%);
                    position: relative;
                    left: -100%;
                    height: 100%;
                    width: 200%;
                    transform: translateX(0);
                    transition: transform 0.7s ease-in-out;
                }
                .right-panel-active .overlay {
                    transform: translateX(50%);
                }
                .overlay-panel {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    top: 0;
                    height: 100%;
                    width: 50%;
                    padding: 0 2.5rem;
                    transition: transform 0.7s ease-in-out;
                }
                .overlay-left {
                    left: 0;
                    transform: translateX(-20%);
                }
                .right-panel-active .overlay-left {
                    transform: translateX(0);
                }
                .overlay-right {
                    right: 0;
                    transform: translateX(0);
                }
                .right-panel-active .overlay-right {
                    transform: translateX(20%);
                }
            `}</style>

            <style jsx global>{`
                .auth-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border-radius: 12px;
                    padding: 0.65rem 0.9rem;
                    font-size: 0.875rem;
                    outline: none;
                    transition: border-color 0.2s ease;
                }
                .auth-input::placeholder {
                    color: rgba(148, 163, 184, 0.6);
                }
                .auth-input:focus {
                    border-color: #4f6df3;
                    box-shadow: 0 0 0 3px rgba(79, 109, 243, 0.15);
                }
                .auth-btn-primary {
                    width: 100%;
                    background: linear-gradient(90deg, #4f6df3, #7b61ff);
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                    border-radius: 999px;
                    padding: 0.7rem 0;
                    transition: opacity 0.2s ease;
                }
                .auth-btn-primary:hover {
                    opacity: 0.92;
                }
                .auth-btn-primary:disabled {
                    opacity: 0.6;
                }
                .auth-btn-google {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    color: #fff;
                    font-weight: 600;
                    font-size: 0.85rem;
                    border-radius: 999px;
                    padding: 0.65rem 0;
                    transition: background 0.2s ease;
                }
                .auth-btn-google:hover {
                    background: rgba(255, 255, 255, 0.07);
                }
            `}</style>
        </div>
    );
}

function FieldLabel({ children }) {
    return <label className="mb-1.5 block text-xs font-medium text-slate-400">{children}</label>;
}

function GoogleDivider({ onGoogle }) {
    return (
        <div className="mt-5">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-500">or continue with</span>
                <div className="h-px flex-1 bg-white/10" />
            </div>
            <button type="button" onClick={onGoogle} className="auth-btn-google mt-4">
                <GoogleIcon />
                Continue with Google
            </button>
        </div>
    );
}

function StatsStrip() {
    return (
        <div className="mt-8 flex items-center gap-5 text-white/90">
            <div className="flex items-center gap-1.5 text-xs">
                <Car className="h-3.5 w-3.5" />
                10K+ Drivers
            </div>
            <div className="flex items-center gap-1.5 text-xs">
                <Star className="h-3.5 w-3.5" />
                4.9 Rating
            </div>
            <div className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3.5 w-3.5" />
                24/7 Support
            </div>
        </div>
    );
}

function MobileSignInForm({ form, setForm, onSubmit, loading, showPassword, setShowPassword }) {
    return (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
                <FieldLabel>Email</FieldLabel>
                <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="auth-input"
                />
            </div>
            <div>
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        className="auth-input pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>
            <button type="submit" disabled={loading} className="auth-btn-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Sign In"}
            </button>
        </form>
    );
}

function MobileSignUpForm({ form, setForm, onSubmit, loading, showPassword, setShowPassword }) {
    return (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
                <FieldLabel>Full name</FieldLabel>
                <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ali Khan"
                    className="auth-input"
                />
            </div>
            <div>
                <FieldLabel>Phone</FieldLabel>
                <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="03xx-xxxxxxx"
                    className="auth-input"
                />
            </div>
            <div>
                <FieldLabel>Email</FieldLabel>
                <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="auth-input"
                />
            </div>
            <div>
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="At least 6 characters"
                        className="auth-input pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>
            <button type="submit" disabled={loading} className="auth-btn-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Create Account"}
            </button>
        </form>
    );
}
