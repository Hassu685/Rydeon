import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import RideRequest from "@/models/RideRequest";
import Trip from "@/models/Trip";
import { getDriverFromRequest } from "@/lib/auth";
import { generateUniqueTripCode } from "@/lib/tripCode";

// PUT /api/ride-requests/:id   body: { action: "accept" | "decline" }
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { action } = await req.json();
    if (!["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "action must be 'accept' or 'decline'" }, { status: 400 });
    }

    const request = await RideRequest.findOne({ _id: id, driverId: auth.driverId });
    if (!request) return NextResponse.json({ error: "Ride request not found" }, { status: 404 });

    if (request.status !== "pending") {
      return NextResponse.json({ error: "This request has already been handled" }, { status: 409 });
    }

    if (action === "decline") {
      request.status = "declined";
      await request.save();
      return NextResponse.json({ request });
    }

    // action === "accept": mark request accepted and spin up an Ongoing trip
    request.status = "accepted";
    await request.save();

    const tripCode = await generateUniqueTripCode();

    const trip = await Trip.create({
      tripCode,
      driverId: auth.driverId,
      riderName: request.riderName,
      rideType: request.rideType,
      pickup: request.pickup,
      drop: request.drop,
      fare: request.estimatedFare,
      status: "Ongoing",
    });

    // Link the request to the trip it spawned, so a public tracking
    // endpoint can look up "did this booking turn into a ride?" later.
    request.tripId = trip._id;
    await request.save();

    return NextResponse.json({ request, trip });
  } catch (err) {
    console.error("Update ride request error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}