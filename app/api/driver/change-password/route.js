import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { getDriverFromRequest } from "@/lib/auth";

// PUT /api/driver/change-password   body: { currentPassword, newPassword }
export async function PUT(req) {
    try {
        await dbConnect();
        const auth = getDriverFromRequest(req);
        if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "currentPassword and newPassword are required" },
                { status: 400 }
            );
        }
        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: "New password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const driver = await Driver.findById(auth.driverId);
        if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

        // Google-linked accounts never had a local password to begin with.
        if (driver.authProvider === "google") {
            return NextResponse.json(
                { error: "Your account signs in with Google — there's no password to change here." },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(currentPassword, driver.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
        }

        driver.password = await bcrypt.hash(newPassword, 10);
        await driver.save();

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}