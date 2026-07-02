"use client";

import Image from "next/image";
import { Sora, Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Sparkles, Users, TrendingUp } from "lucide-react";

/* ---------------------------------------------------------
   Fonts — Sora for headings: bold, rounded, geometric — the
   same register as the Rydeon logotype and pill-shaped nav.
   Inter carries body copy for clean, quiet readability.
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
   Reveal — a small scroll-triggered fade/rise hook.
   Respects prefers-reduced-motion automatically via CSS.
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

const values = [
  {
    label: "Trust",
    detail: "Every commitment we make is one we intend to keep.",
    icon: ShieldCheck,
  },
  {
    label: "Reliability",
    detail: "Consistent results, delivered the same way every time.",
    icon: TrendingUp,
  },
  {
    label: "Customer First",
    detail: "We design around the people we serve, not around ourselves.",
    icon: Users,
  },
  {
    label: "Continuous Improvement",
    detail: "We treat 'good enough' as a starting point, not a finish line.",
    icon: Sparkles,
  },
];

export default function AboutPage() {
  return (
    <main
      className={`${display.variable} ${body.variable} font-body bg-[#F7F5F0] text-[#1C2430] antialiased`}
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

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-[#0B1220] text-white pt-36 pb-28">
        {/* ambient texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="pointer-events-none absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, #4F46E555, transparent 70%)" }}
        />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <Reveal>
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#4F46E5]/40 bg-white/5">
              <ShieldCheck className="h-7 w-7 text-[#4F46E5]" strokeWidth={1.5} />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#4F46E5]">
              About the company
            </p>
          </Reveal>

          <Reveal delay={140}>
            <h1
              className="font-display font-extrabold text-4xl md:text-6xl leading-[1.08] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Built on trust,
              <br />
              <span className="text-[#4F46E5]">proven</span> through service.
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed font-light">
              We are committed to delivering reliable, safe, and high-quality
              services that people can trust — every project, every time.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Who We Are ---------------- */}
      <section className="py-24 md:py-32 bg-[#F7F5F0]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#4338CA]">
                Who we are
              </p>
              <h2
                className="font-display font-bold text-3xl md:text-4xl mb-6 leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                People first, process always.
              </h2>
              <p className="text-[#5B6472] leading-relaxed mb-4">
                We are a team driven by passion, innovation, and responsibility.
                Our goal is to create meaningful experiences by focusing on
                quality, transparency, and customer satisfaction.
              </p>
              <p className="text-[#5B6472] leading-relaxed">
                By combining modern technology with human values, we aim to
                provide solutions that truly make a difference.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl border border-[#4F46E5]/20" />
              <Image
                src="/images/safety.png"
                alt="About illustration"
                width={500}
                height={400}
                className="relative rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Mission & Vision ---------------- */}
      <section className="relative bg-[#0B1220] py-24 md:py-28">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full bg-white p-9 rounded-2xl shadow-lg">
              <p className="text-xs uppercase tracking-[0.25em] text-[#4338CA] mb-3">
                01 — Mission
              </p>
              <h3
                className="font-display font-bold text-2xl mb-4 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our Mission
              </h3>
              <p className="text-[#5B6472] leading-relaxed">
                To provide dependable services that prioritize safety, quality,
                and customer trust at every step.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full bg-white p-9 rounded-2xl shadow-lg">
              <p className="text-xs uppercase tracking-[0.25em] text-[#4338CA] mb-3">
                02 — Vision
              </p>
              <h3
                className="font-display font-bold text-2xl mb-4 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our Vision
              </h3>
              <p className="text-[#5B6472] leading-relaxed">
                To become a trusted name known for innovation, integrity, and
                long-term impact.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Values ---------------- */}
      <section className="py-24 md:py-32 bg-[#F7F5F0]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#4338CA] mb-3">
              What guides us
            </p>
            <h2
              className="font-display font-bold text-3xl md:text-4xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Core Values
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-4">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.label} delay={i * 90}>
                  <div
                    className={`h-full px-6 py-8 border-t border-[#1C2430]/10 ${i > 0 ? "md:border-l" : ""
                      } transition-colors hover:bg-white/70`}
                  >
                    <Icon
                      className="h-6 w-6 text-[#4F46E5] mb-4 mx-auto md:mx-0"
                      strokeWidth={1.5}
                    />
                    <h4
                      className="font-display font-semibold text-lg mb-2 text-center md:text-left tracking-tight"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {value.label}
                    </h4>
                    <p className="text-sm text-[#5B6472] leading-relaxed text-center md:text-left">
                      {value.detail}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative overflow-hidden bg-[#0B1220] py-24 md:py-28 text-center">
        <div
          className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-[420px] w-[600px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, #4F46E533, transparent 70%)" }}
        />
        <div className="relative max-w-2xl mx-auto px-6">
          <Reveal>
            <h2
              className="font-display font-bold text-3xl md:text-4xl mb-4 text-white tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Let&rsquo;s build something better, together.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-white/60 mb-9 leading-relaxed">
              We believe in collaboration, trust, and long-term partnerships.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <button className="px-9 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_6px_rgba(79,70,229,0.2)]">
              Get Started
            </button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}