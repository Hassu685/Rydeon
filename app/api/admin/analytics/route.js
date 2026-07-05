import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Trip from "@/models/Trip";
import Driver from "@/models/Driver";
import { getAdminFromRequest } from "@/lib/auth";

// GET /api/admin/analytics?days=30
// Platform-wide revenue and driver metrics for the admin dashboard.
export async function GET(req) {
  try {
    await dbConnect();
    const admin = getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    const rangeStart = new Date();
    rangeStart.setDate(rangeStart.getDate() - (days - 1));
    rangeStart.setHours(0, 0, 0, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Totals across the whole platform
    const totalDrivers = await Driver.countDocuments();
    const activeDrivers = await Driver.countDocuments({ isOnline: true, isSuspended: false });
    const suspendedDrivers = await Driver.countDocuments({ isSuspended: true });

    const allCompletedTrips = await Trip.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$fare" }, totalTrips: { $sum: 1 } } },
    ]);
    const totalRevenue = allCompletedTrips[0]?.totalRevenue || 0;
    const totalCompletedTrips = allCompletedTrips[0]?.totalTrips || 0;

    const todaysRevenueAgg = await Trip.aggregate([
      { $match: { status: "Completed", completedAt: { $gte: startOfToday } } },
      { $group: { _id: null, revenue: { $sum: "$fare" }, trips: { $sum: 1 } } },
    ]);
    const todaysRevenue = todaysRevenueAgg[0]?.revenue || 0;
    const todaysTrips = todaysRevenueAgg[0]?.trips || 0;

    // Daily revenue trend for charting
    const dailyTrend = await Trip.aggregate([
      { $match: { status: "Completed", completedAt: { $gte: rangeStart } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          revenue: { $sum: "$fare" },
          trips: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top 5 drivers by all-time earnings
    const topDrivers = await Driver.find({})
      .select("name email totalEarnings totalTrips rating")
      .sort({ totalEarnings: -1 })
      .limit(5);

    // Cancellation rate across the platform
    const totalTripsAllStatuses = await Trip.countDocuments();
    const cancelledCount = await Trip.countDocuments({ status: "Cancelled" });
    const cancellationRate =
      totalTripsAllStatuses > 0 ? Math.round((cancelledCount / totalTripsAllStatuses) * 100) : 0;

    return NextResponse.json({
      totals: {
        totalDrivers,
        activeDrivers,
        suspendedDrivers,
        totalRevenue,
        totalCompletedTrips,
        cancellationRate,
      },
      today: {
        revenue: todaysRevenue,
        trips: todaysTrips,
      },
      dailyTrend: dailyTrend.map((d) => ({ day: d._id, revenue: d.revenue, trips: d.trips })),
      topDrivers,
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
