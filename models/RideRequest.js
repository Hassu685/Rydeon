import mongoose from "mongoose";

const RideRequestSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true, index: true },
    riderName: { type: String, required: true },
    riderPhone: { type: String, default: "" },
    rideType: { type: String, default: "" },
    pickup: { type: String, required: true },
    drop: { type: String, required: true },
    distanceKm: { type: Number, default: 0 },
    estimatedFare: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired"],
      default: "pending",
    },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.RideRequest || mongoose.model("RideRequest", RideRequestSchema);