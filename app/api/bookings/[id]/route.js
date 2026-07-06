import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import RideRequest from "@/models/RideRequest";
import Trip from "@/models/Trip";
import Driver from "@/models/Driver";

// GET /api/bookings/:id
// Public — no authentication. Intentionally returns only the minimal,
// non-sensitive fields a waiting rider needs (status + driver first name),
// not the full driver or trip document.
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
        }

        const request = await RideRequest.findById(id);
        if (!request) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        let driverName = null;
        let tripCode = null;

        if (request.status === "accepted" && request.tripId) {
            const [driver, trip] = await Promise.all([
                Driver.findById(request.driverId).select("name"),
                Trip.findById(request.tripId).select("tripCode status"),
            ]);
            driverName = driver?.name || null;
            tripCode = trip?.tripCode || null;
        }

        return NextResponse.json({
            status: request.status,
            estimatedFare: request.estimatedFare,
            driverName,
            tripCode,
        });
    } catch (err) {
        console.error("Fetch booking status error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}