import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Trip from "@/models/Trip";
import Driver from "@/models/Driver";
import { getAdminFromRequest } from "@/lib/auth";

// GET /api/admin/reports?months=6
export async function GET(req) {
    try {
        await dbConnect();
        const admin = getAdminFromRequest(req);
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const months = Math.min(Math.max(parseInt(searchParams.get("months") || "6", 10), 1), 24);

        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // --- This month vs last month revenue ---
        const [thisMonthRevAgg, lastMonthRevAgg] = await Promise.all([
            Trip.aggregate([
                { $match: { status: "Completed", completedAt: { $gte: startOfThisMonth } } },
                { $group: { _id: null, revenue: { $sum: "$fare" } } },
            ]),
            Trip.aggregate([
                {
                    $match: {
                        status: "Completed",
                        completedAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
                    },
                },
                { $group: { _id: null, revenue: { $sum: "$fare" } } },
            ]),
        ]);
        const monthlyRevenue = thisMonthRevAgg[0]?.revenue || 0;
        const lastMonthRevenue = lastMonthRevAgg[0]?.revenue || 0;
        const revenueGrowthPct =
            lastMonthRevenue > 0
                ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 1000) / 10
                : null;

        // --- New drivers this month (real) ---
        const newDriversThisMonth = await Driver.countDocuments({
            createdAt: { $gte: startOfThisMonth },
        });

        // --- New riders this month (approximate) ---
        // Riders aren't real accounts — this treats a rider's *first ever trip*
        // (by name) as their "join date". Not a precise unique-user count.
        const firstSeenAgg = await Trip.aggregate([
            { $group: { _id: "$riderName", firstSeenAt: { $min: "$createdAt" } } },
            { $match: { firstSeenAt: { $gte: startOfThisMonth } } },
            { $count: "count" },
        ]);
        const newRidersThisMonth = firstSeenAgg[0]?.count || 0;

        // --- Monthly cumulative growth for the trend chart ---
        const monthlyGrowth = [];
        for (let i = months - 1; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const label = monthDate.toLocaleDateString("en-US", { month: "short" });

            const [driversAsOf, riderNamesAsOf] = await Promise.all([
                Driver.countDocuments({ createdAt: { $lt: monthEnd } }),
                Trip.distinct("riderName", { createdAt: { $lt: monthEnd } }),
            ]);

            monthlyGrowth.push({
                month: label,
                drivers: driversAsOf,
                riders: riderNamesAsOf.length,
            });
        }

        return NextResponse.json({
            monthlyRevenue,
            lastMonthRevenue,
            revenueGrowthPct, // null if there's no prior-month data to compare against
            newDriversThisMonth,
            newRidersThisMonth,
            monthlyGrowth,
        });
    } catch (err) {
        console.error("Admin reports error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}