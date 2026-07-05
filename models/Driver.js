import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed with bcrypt
    phone: { type: String, trim: true },
    vehicle: {
      make: { type: String, default: "" },
      model: { type: String, default: "" },
      plateNumber: { type: String, default: "" },
    },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    isOnline: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    totalTrips: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    preferences: {
      pushNotifications: { type: Boolean, default: true },
      rideSoundAlerts: { type: Boolean, default: true },
      language: { type: String, default: "en" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Driver || mongoose.model("Driver", DriverSchema);