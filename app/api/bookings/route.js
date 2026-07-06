import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import RideRequest from "@/models/RideRequest";
import PlatformSettings from "@/models/PlatformSettings";

// A placeholder trip distance used only for the fare estimate shown to the
// rider before a driver accepts. There's no maps/geocoding integration in
// this system, so pickup/drop are free-text addresses with no way to
// compute a real distance between them yet.
const PLACEHOLDER_DISTANCE_KM = 5;

// POST /api/bookings   body: { riderName, phone, pickup, drop, rideType }
// Public — no authentication. This is the only way a ride request gets
// created without an already-logged-in driver. It picks the first available
// online, non-suspended driver as a simple (not geo-aware) match.
export async function POST(req) {
    try {
        await dbConnect();
        const { riderName, phone, pickup, drop, rideType } = await req.json();

        if (!riderName || !phone || !pickup || !drop) {
            return NextResponse.json(
                { error: "riderName, phone, pickup, and drop are required" },
                { status: 400 }
            );
        }

        const settings = await PlatformSettings.findOneAndUpdate(
            {},
            {},
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (settings.maintenanceMode) {
            return NextResponse.json(
                { error: "Bookings are temporarily paused for maintenance. Please try again shortly." },
                { status: 503 }
            );
        }

        // Naive matching: first available online, unsuspended driver. Sorted by
        // least-recently-updated so it doesn't always hand every booking to the
        // same driver — this is NOT real dispatch logic (no location awareness).
        const driver = await Driver.findOne({ isOnline: true, isSuspended: false }).sort({
            updatedAt: 1,
        });

        if (!driver) {
            return NextResponse.json(
                { error: "No drivers are available right now. Please try again in a few minutes." },
                { status: 503 }
            );
        }

        const estimatedFare = Math.round(
            settings.baseFare + settings.perKmRate * PLACEHOLDER_DISTANCE_KM
        );

        const request = await RideRequest.create({
            driverId: driver._id,
            riderName,
            riderPhone: phone,
            rideType: rideType || "",
            pickup,
            drop,
            distanceKm: PLACEHOLDER_DISTANCE_KM,
            estimatedFare,
        });

        return NextResponse.json(
            {
                bookingId: request._id,
                status: request.status,
                estimatedFare,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Create booking error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}