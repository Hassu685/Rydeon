import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { getDriverFromRequest } from "@/lib/auth";

const DEFAULT_PREFERENCES = {
    pushNotifications: true,
    rideSoundAlerts: true,
    language: "en",
};

// Older driver documents (created before `preferences` existed on the
// schema) may not have this field in the database at all. Always fill it
// in on the way out so the frontend never has to guard against undefined.
function withPreferences(driverDoc) {
    const obj = driverDoc.toObject ? driverDoc.toObject() : driverDoc;
    obj.preferences = { ...DEFAULT_PREFERENCES, ...(obj.preferences || {}) };
    return obj;
}

// GET /api/driver/profile  -> the logged-in driver's own profile
export async function GET(req) {
    try {
        await dbConnect();
        const auth = getDriverFromRequest(req);
        if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const driver = await Driver.findById(auth.driverId).select("-password");
        if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

        return NextResponse.json({ driver: withPreferences(driver) });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PUT /api/driver/profile
// body: { name?, phone?, vehicle?: { make, model, plateNumber }, preferences?: { pushNotifications, rideSoundAlerts, language } }
// Email is intentionally not editable here — it's tied to login/auth.
export async function PUT(req) {
    try {
        await dbConnect();
        const auth = getDriverFromRequest(req);
        if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const updates = {};

        if (typeof body.name === "string") {
            const trimmed = body.name.trim();
            if (!trimmed) {
                return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
            }
            updates.name = trimmed;
        }

        if (typeof body.phone === "string") {
            updates.phone = body.phone.trim();
        }

        if (body.vehicle && typeof body.vehicle === "object") {
            updates.vehicle = {
                make: typeof body.vehicle.make === "string" ? body.vehicle.make.trim() : "",
                model: typeof body.vehicle.model === "string" ? body.vehicle.model.trim() : "",
                plateNumber:
                    typeof body.vehicle.plateNumber === "string" ? body.vehicle.plateNumber.trim() : "",
            };
        }

        if (body.preferences && typeof body.preferences === "object") {
            // Merge against the current stored preferences (falling back to
            // defaults for docs that never had this field) so a partial update
            // doesn't wipe out the rest.
            const current = await Driver.findById(auth.driverId).select("preferences");
            const currentPrefs = { ...DEFAULT_PREFERENCES, ...(current?.preferences || {}) };
            updates.preferences = {
                pushNotifications:
                    typeof body.preferences.pushNotifications === "boolean"
                        ? body.preferences.pushNotifications
                        : currentPrefs.pushNotifications,
                rideSoundAlerts:
                    typeof body.preferences.rideSoundAlerts === "boolean"
                        ? body.preferences.rideSoundAlerts
                        : currentPrefs.rideSoundAlerts,
                language:
                    typeof body.preferences.language === "string"
                        ? body.preferences.language
                        : currentPrefs.language,
            };
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const driver = await Driver.findByIdAndUpdate(auth.driverId, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

        return NextResponse.json({ driver: withPreferences(driver) });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}