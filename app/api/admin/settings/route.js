import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PlatformSettings from "@/models/PlatformSettings";
import { getAdminFromRequest } from "@/lib/auth";

// GET /api/admin/settings -> the single platform settings document
// (created with defaults on first access if it doesn't exist yet).
export async function GET(req) {
    try {
        await dbConnect();
        const admin = getAdminFromRequest(req);
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const settings = await PlatformSettings.findOneAndUpdate(
            {},
            {},
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ settings });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PUT /api/admin/settings
// body: { baseFare?, perKmRate?, commissionPct?, surgePricingEnabled?, maintenanceMode?, serviceZones? }
export async function PUT(req) {
    try {
        await dbConnect();
        const admin = getAdminFromRequest(req);
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const updates = {};

        const numericFields = ["baseFare", "perKmRate", "commissionPct"];
        for (const field of numericFields) {
            if (body[field] !== undefined) {
                const num = Number(body[field]);
                if (Number.isNaN(num) || num < 0) {
                    return NextResponse.json({ error: `${field} must be a non-negative number` }, { status: 400 });
                }
                updates[field] = num;
            }
        }

        if (typeof body.surgePricingEnabled === "boolean") {
            updates.surgePricingEnabled = body.surgePricingEnabled;
        }
        if (typeof body.maintenanceMode === "boolean") {
            updates.maintenanceMode = body.maintenanceMode;
        }
        if (Array.isArray(body.serviceZones)) {
            updates.serviceZones = body.serviceZones
                .filter((z) => typeof z === "string" && z.trim())
                .map((z) => z.trim());
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const settings = await PlatformSettings.findOneAndUpdate({}, updates, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true,
        });

        return NextResponse.json({ settings });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}