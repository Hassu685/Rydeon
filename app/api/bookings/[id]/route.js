import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import RideRequest from "@/models/RideRequest";
import Driver from "@/models/Driver";

// GET /api/bookings/[id]
// Public — used by the rider-facing page to poll a booking's current
// status (pending / accepted / rejected / completed etc.) after creation.
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
        }

        const booking = await RideRequest.findById(id).populate(
            "driverId",
            "name phone vehicleType vehicleNumber isOnline"
        );

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({
            bookingId: booking._id,
            status: booking.status,
            riderName: booking.riderName,
            riderPhone: booking.riderPhone,
            rideType: booking.rideType,
            pickup: booking.pickup,
            drop: booking.drop,
            distanceKm: booking.distanceKm,
            estimatedFare: booking.estimatedFare,
            driver: booking.driverId || null,
            createdAt: booking.createdAt,
        });
    } catch (err) {
        console.error("Get booking error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}