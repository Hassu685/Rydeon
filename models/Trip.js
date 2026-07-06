import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    tripCode: { type: String, required: true, unique: true }, // e.g. TRP-8823
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true, index: true },
    riderName: { type: String, required: true },
    rideType: { type: String, default: "" },
    pickup: { type: String, required: true },
    drop: { type: String, required: true },
    fare: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Cancelled"],
      default: "Ongoing",
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

TripSchema.index({ driverId: 1, createdAt: -1 });

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);