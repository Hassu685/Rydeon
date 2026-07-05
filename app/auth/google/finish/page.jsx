"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function GoogleAuthFinish() {
    const router = useRouter();
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function finishSignIn() {
            try {
                const res = await fetch("/api/auth/google-token");
                if (!res.ok) throw new Error("Google sign-in failed");
                const data = await res.json();

                if (cancelled) return;
                localStorage.setItem("driverToken", data.token);
                localStorage.setItem("driverData", JSON.stringify(data.driver));
                router.push("/driver-dashboard");
            } catch (err) {
                if (!cancelled) {
                    console.error(err);
                    setError("Something went wrong signing you in with Google. Please try again.");
                }
            }
        }

        finishSignIn();
        return () => {
            cancelled = true;
        };
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0B0E1A] text-white px-6">
            {error ? (
                <>
                    <p className="text-red-400 text-sm text-center">{error}</p>
                    <button
                        onClick={() => router.push("/login")}
                        className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold"
                    >
                        Back to login
                    </button>
                </>
            ) : (
                <>
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <p className="text-sm text-slate-400">Signing you in…</p>
                </>
            )}
        </div>
    );
}
