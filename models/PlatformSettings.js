import mongoose from "mongoose";

// This is a singleton — the whole platform has exactly one settings document.
// We always upsert against an empty filter ({}) rather than tracking an id.
const PlatformSettingsSchema = new mongoose.Schema(
    {
        baseFare: { type: Number, default: 60, min: 0 },
        perKmRate: { type: Number, default: 11, min: 0 },
        commissionPct: { type: Number, default: 15, min: 0, max: 100 },
        surgePricingEnabled: { type: Boolean, default: true },
        maintenanceMode: { type: Boolean, default: false },
        serviceZones: { type: [String], default: ["Lahore"] },
    },
    { timestamps: true }
);

export default mongoose.models.PlatformSettings ||
    mongoose.model("PlatformSettings", PlatformSettingsSchema);