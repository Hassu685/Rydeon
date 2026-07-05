import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Trip from "@/models/Trip";
import Driver from "@/models/Driver";
import { getDriverFromRequest } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const trip = await Trip.findOne({ _id: id, driverId: auth.driverId });
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    return NextResponse.json({ trip });
  } catch (err) {
    console.error("Get trip error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { status, fare } = body;

    const trip = await Trip.findOne({ _id: id, driverId: auth.driverId });
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const wasCompleted = trip.status === "Completed";

    if (status) trip.status = status;
    if (fare != null) trip.fare = fare;
    if (status === "Completed" && !trip.completedAt) trip.completedAt = new Date();

    await trip.save();

    // Only increment aggregate stats the first time a trip transitions to Completed
    if (!wasCompleted && trip.status === "Completed") {
      await Driver.findByIdAndUpdate(auth.driverId, {
        $inc: { totalTrips: 1, totalEarnings: trip.fare },
      });
    }

    return NextResponse.json({ trip });
  } catch (err) {
    console.error("Update trip error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const trip = await Trip.findOneAndDelete({ _id: id, driverId: auth.driverId });
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    return NextResponse.json({ message: "Trip deleted" });
  } catch (err) {
    console.error("Delete trip error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
