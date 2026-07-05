import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import RideRequest from "@/models/RideRequest";
import { getDriverFromRequest } from "@/lib/auth";

// GET /api/ride-requests?status=pending
// Poll this endpoint (e.g. every 5s) from the dashboard to show incoming ride requests.
export async function GET(req) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    const requests = await RideRequest.find({ driverId: auth.driverId, status }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("Fetch ride requests error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/ride-requests
// Creates a new incoming ride request for a driver (called by your matching/dispatch logic).
export async function POST(req) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { riderName, pickup, drop, distanceKm, estimatedFare } = body;

    if (!riderName || !pickup || !drop || estimatedFare == null) {
      return NextResponse.json(
        { error: "riderName, pickup, drop, and estimatedFare are required" },
        { status: 400 }
      );
    }

    const request = await RideRequest.create({
      driverId: auth.driverId,
      riderName,
      pickup,
      drop,
      distanceKm,
      estimatedFare,
    });

    return NextResponse.json({ request }, { status: 201 });
  } catch (err) {
    console.error("Create ride request error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
