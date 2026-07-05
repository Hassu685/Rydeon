import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Trip from "@/models/Trip";
import Driver from "@/models/Driver";
import { getDriverFromRequest } from "@/lib/auth";
import { parsePagination } from "@/lib/pagination";
import { generateUniqueTripCode } from "@/lib/tripCode";

// GET /api/trips?page=1&limit=10&status=Completed
export async function GET(req) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePagination(searchParams, { defaultLimit: 10 });
    const status = searchParams.get("status");

    const filter = { driverId: auth.driverId };
    if (status) filter.status = status;

    const trips = await Trip.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Trip.countDocuments(filter);

    return NextResponse.json({
      trips,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Fetch trips error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/trips  (typically called when a ride request is accepted and completed)
export async function POST(req) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { riderName, pickup, drop, fare, status } = body;

    if (!riderName || !pickup || !drop || fare == null) {
      return NextResponse.json(
        { error: "riderName, pickup, drop, and fare are required" },
        { status: 400 }
      );
    }

    const tripCode = await generateUniqueTripCode();

    const trip = await Trip.create({
      tripCode,
      driverId: auth.driverId,
      riderName,
      pickup,
      drop,
      fare,
      status: status || "Ongoing",
      completedAt: status === "Completed" ? new Date() : undefined,
    });

    // Keep driver aggregate stats in sync when a trip completes
    if (trip.status === "Completed") {
      await Driver.findByIdAndUpdate(auth.driverId, {
        $inc: { totalTrips: 1, totalEarnings: fare },
      });
    }

    return NextResponse.json({ trip }, { status: 201 });
  } catch (err) {
    console.error("Create trip error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
