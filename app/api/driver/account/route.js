import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { getDriverFromRequest } from "@/lib/auth";

// DELETE /api/driver/account
// Deletes the driver's own account. Their past Trip records are intentionally
// left in place (not cascade-deleted) so completed-ride history / financial
// records stay intact for reporting — only the driver's own profile is removed.
export async function DELETE(req) {
    try {
        await dbConnect();
        const auth = getDriverFromRequest(req);
        if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const driver = await Driver.findByIdAndDelete(auth.driverId);
        if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

        return NextResponse.json({ message: "Account deleted" });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}