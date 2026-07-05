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
    const days = Math.min(Math.max(parseInt(searchParams.get("days") || "7", 10), 1), 90);

    const rangeStart = new Date();
    rangeStart.setDate(rangeStart.getDate() - (days - 1));
    rangeStart.setHours(0, 0, 0, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    // Totals across the whole platform
    const totalDrivers = await Driver.countDocuments();
    const activeDrivers = await Driver.countDocuments({ isOnline: true, isSuspended: false });
    const suspendedDrivers = await Driver.countDocuments({ isSuspended: true });
    const newDriversThisWeek = await Driver.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

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

    // This-week vs last-week comparison, for real (not made up) trend %s
    const [thisWeekAgg, lastWeekAgg] = await Promise.all([
      Trip.aggregate([
        { $match: { status: "Completed", completedAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, revenue: { $sum: "$fare" }, trips: { $sum: 1 } } },
      ]),
      Trip.aggregate([
        {
          $match: {
            status: "Completed",
            completedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
          },
        },
        { $group: { _id: null, revenue: { $sum: "$fare" }, trips: { $sum: 1 } } },
      ]),
    ]);

    const revenueThisWeek = thisWeekAgg[0]?.revenue || 0;
    const revenueLastWeek = lastWeekAgg[0]?.revenue || 0;
    const tripsThisWeek = thisWeekAgg[0]?.trips || 0;
    const tripsLastWeek = lastWeekAgg[0]?.trips || 0;

    // % change is only meaningful once there's a prior-week baseline to compare against.
    const pctChange = (current, previous) => {
      if (previous === 0) return null;
      return Math.round(((current - previous) / previous) * 1000) / 10;
    };

    const revenueChangePct = pctChange(revenueThisWeek, revenueLastWeek);
    const tripsChangePct = pctChange(tripsThisWeek, tripsLastWeek);

    // Daily revenue trend for charting — backfilled so every day in the
    // requested range appears (even zero-revenue days), otherwise the chart
    // would show gaps or a misleadingly short line.
    const dailyTrendRaw = await Trip.aggregate([
      { $match: { status: "Completed", completedAt: { $gte: rangeStart } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          revenue: { $sum: "$fare" },
          trips: { $sum: 1 },
        },
      },
    ]);

    const trendByDate = {};
    dailyTrendRaw.forEach((d) => {
      trendByDate[d._id] = { revenue: d.revenue, trips: d.trips };
    });

    const dailyTrend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const entry = trendByDate[dateKey];
      dailyTrend.push({
        day: label,
        revenue: entry?.revenue || 0,
        trips: entry?.trips || 0,
      });
    }

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

    // Riders aren't a real account/collection in this system — `riderName` is
    // just a free-text field on each Trip. This is the best available
    // approximation (distinct names seen), not a precise unique-user count.
    const distinctRiderNames = await Trip.distinct("riderName");

    return NextResponse.json({
      totals: {
        totalDrivers,
        activeDrivers,
        suspendedDrivers,
        newDriversThisWeek,
        totalRevenue,
        totalCompletedTrips,
        totalTripsAllStatuses,
        cancellationRate,
        distinctRiderNames: distinctRiderNames.length,
      },
      today: {
        revenue: todaysRevenue,
        trips: todaysTrips,
      },
      weekOverWeek: {
        revenueThisWeek,
        revenueLastWeek,
        revenueChangePct, // null if there's no prior-week data to compare against
        tripsThisWeek,
        tripsLastWeek,
        tripsChangePct,
      },
      dailyTrend,
      topDrivers,
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}