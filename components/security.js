"use client";

import { Lock, Shield, CreditCard, FileCheck } from "lucide-react";

const items = [
  { icon: <Lock />, text: "End-to-End Data Encryption" },
  { icon: <Shield />, text: "Privacy Protection Guaranteed" },
  { icon: <CreditCard />, text: "100% Secure Payments" },
  { icon: <FileCheck />, text: "Industry Safety Standards" },
];

export default function Security() {
  return (
    <section className="bg-[#f8fbff] py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Trust & Transparency
        </h2>
        <p className="mt-3 text-gray-600">
          Your safety and privacy are always our top priority
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex justify-center text-blue-600">
                {item.icon}
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
