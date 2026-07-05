import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { getAdminFromRequest } from "@/lib/auth";
import { parsePagination } from "@/lib/pagination";

// GET /api/admin/riders?page=1&limit=20&search=ayesha
//
// There is no Rider account model in this system — `riderName` is just a
// free-text field stored on each Trip. This endpoint derives an approximate
// "riders" list by grouping trips by that name. It is NOT a precise unique-
// user count (two different people could share a name, or one person could
// be spelled two different ways across bookings).
export async function GET(req) {
    try {
        await dbConnect();
        const admin = getAdminFromRequest(req);
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const { page, limit, skip } = parsePagination(searchParams, { defaultLimit: 20 });
        const search = searchParams.get("search");

        const matchStage = {};
        if (search) {
            matchStage.riderName = { $regex: search, $options: "i" };
        }

        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: "$riderName",
                    totalTrips: { $sum: 1 },
                    completedTrips: {
                        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
                    },
                    totalSpent: {
                        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, "$fare", 0] },
                    },
                    lastTripAt: { $max: "$createdAt" },
                },
            },
            { $sort: { lastTripAt: -1 } },
        ];

        const allGrouped = await Trip.aggregate(pipeline);
        const total = allGrouped.length;
        const pageSlice = allGrouped.slice(skip, skip + limit);

        const riders = pageSlice.map((r) => ({
            name: r._id,
            totalTrips: r.totalTrips,
            completedTrips: r.completedTrips,
            totalSpent: r.totalSpent,
            lastTripAt: r.lastTripAt,
        }));

        return NextResponse.json({
            riders,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
        });
    } catch (err) {
        console.error("Admin fetch riders error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}