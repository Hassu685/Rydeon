"use client";

import {
  ShieldCheck,
  Users,
  Clock,
  Headphones,
  MapPinned,
  ThumbsUp
} from "lucide-react";

const reasons = [
  {
    icon: <ShieldCheck className="h-7 w-7 text-blue-600" />,
    title: "Safety First Approach",
    desc: "Advanced safety features designed to protect you on every ride.",
  },
  {
    icon: <Users className="h-7 w-7 text-blue-600" />,
    title: "Trusted by Thousands",
    desc: "Thousands of riders rely on us daily for safe and reliable travel.",
  },
  {
    icon: <MapPinned className="h-7 w-7 text-blue-600" />,
    title: "Real-Time Ride Tracking",
    desc: "Track your ride live and share your journey anytime.",
  },
  {
    icon: <Headphones className="h-7 w-7 text-blue-600" />,
    title: "24/7 Customer Support",
    desc: "Our support team is always available to assist you.",
  },
  {
    icon: <Clock className="h-7 w-7 text-blue-600" />,
    title: "Always Available",
    desc: "Book a ride anytime, anywhere with round-the-clock service.",
  },
  {
    icon: <ThumbsUp className="h-7 w-7 text-blue-600" />,
    title: "Smooth Ride Experience",
    desc: "Simple booking, professional drivers, and comfortable rides.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#f8fbff] py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">

        <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
          Why Choose Us
        </p>

        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
          A Safer, Smarter Way to Ride
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-gray-600">
          We combine technology, trust, and care to deliver a ride experience
          you can always rely on.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 mx-auto">
                {item.icon}
              </div>

              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
