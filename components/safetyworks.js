"use client";

import { Sora, Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { Smartphone, UserCheck, MapPin } from "lucide-react";

/* ---------------------------------------------------------
   Fonts — same pairing as the rest of the site: Sora for
   headings, Inter for body copy.
--------------------------------------------------------- */
const display = Sora({
    subsets: ["latin"],
    weight: ["600", "700", "800"],
    variable: "--font-display",
});

const body = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-body",
});

/* ---------------------------------------------------------
   Reveal — scroll-triggered fade/rise, respects
   prefers-reduced-motion.
--------------------------------------------------------- */
function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(node);
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return [ref, visible];
}

function Reveal({ as: Tag = "div", delay = 0, className = "", children }) {
    const [ref, visible] = useReveal();
    return (
        <Tag
            ref={ref}
            className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </Tag>
    );
}

const steps = [
    {
        step: "01",
        icon: Smartphone,
        title: "Book Your Ride",
        desc: "Choose your destination and confirm your ride within seconds.",
    },
    {
        step: "02",
        icon: UserCheck,
        title: "Verified Driver Assigned",
        desc: "A background-checked and verified driver is instantly assigned.",
    },
    {
        step: "03",
        icon: MapPin,
        title: "Track & Stay Safe",
        desc: "Track your ride live, share location, and use SOS anytime.",
    },
];

export default function HowSafetyWorks() {
    return (
        <section
            className={`${display.variable} ${body.variable} relative overflow-hidden py-20 sm:py-24 bg-white antialiased`}
            style={{ fontFamily: "var(--font-body)", letterSpacing: "-0.01em" }}
        >
            <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

            {/* Soft background glow — subtle, keeps the page white */}
            <div className="absolute -top-32 -right-32 h-60 w-60 sm:h-96 sm:w-96 rounded-full bg-blue-500/[0.06] blur-[90px] sm:blur-[140px]" />
            <div className="absolute bottom-0 left-0 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-indigo-500/[0.06] blur-[100px] sm:blur-[150px]" />

            <div className="relative max-w-6xl mx-auto px-5 sm:px-6 text-center">
                <Reveal>
                    <span className="inline-flex items-center rounded-full border border-[#4F46E5]/15 bg-[#4F46E5]/[0.06] px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#4F46E5] uppercase">
                        How Safety Works
                    </span>
                </Reveal>

                <Reveal delay={80}>
                    <h2
                        className="mt-5 sm:mt-6 font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#0B1220] tracking-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Safety at{" "}
                        <span className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] bg-clip-text text-transparent">
                            Every Step
                        </span>
                    </h2>
                </Reveal>

                <Reveal delay={140}>
                    <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-base text-[#5B6472] leading-relaxed">
                        From booking to drop-off, your safety is built into every part of
                        the journey.
                    </p>
                </Reveal>

                {/* Steps */}
                <div className="mt-14 sm:mt-16 relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {/* connecting line (desktop only) */}
                    <div className="hidden md:block absolute top-[3.5rem] left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-[#4F46E5]/0 via-[#4F46E5]/25 to-[#4F46E5]/0" />

                    {steps.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <Reveal key={item.step} delay={i * 120}>
                                <div className="group relative h-full bg-[#f8fbff] border border-[#4F46E5]/[0.06] rounded-2xl p-7 sm:p-8 pt-9 sm:pt-10 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#4F46E5]/20 hover:shadow-xl hover:shadow-[#4F46E5]/10">
                                    <span className="absolute -top-4 left-6 bg-[#4F46E5] text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide shadow-md shadow-[#4F46E5]/25">
                                        Step {item.step}
                                    </span>

                                    <div className="flex items-center justify-center h-13 w-13 sm:h-14 sm:w-14 rounded-full bg-[#4F46E5]/10 transition-colors duration-300 group-hover:bg-[#4F46E5]/15">
                                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-[#4F46E5]" strokeWidth={1.75} />
                                    </div>

                                    <h3
                                        className="mt-5 sm:mt-6 font-display font-semibold text-base sm:text-lg text-[#0B1220] tracking-tight"
                                        style={{ fontFamily: "var(--font-display)" }}
                                    >
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-[#5B6472] leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}