import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Trip from "@/models/Trip";
import RideRequest from "@/models/RideRequest";
import Driver from "@/models/Driver";
import { getDriverFromRequest } from "@/lib/auth";

// GET /api/driver/stats
// Returns everything the dashboard's stat cards + earnings chart + performance bars need.
export async function GET(req) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const driver = await Driver.findById(auth.driverId);
    if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Today's earnings + trip count
    const todaysTrips = await Trip.find({
      driverId: auth.driverId,
      status: "Completed",
      completedAt: { $gte: startOfToday },
    });
    const todaysEarnings = todaysTrips.reduce((sum, t) => sum + t.fare, 0);

    // Weekly earnings grouped by day (for the AreaChart)
    const weeklyTripsRaw = await Trip.aggregate([
      {
        $match: {
          driverId: driver._id,
          status: "Completed",
          completedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          earnings: { $sum: "$fare" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // The aggregation above only returns days that had at least one completed
    // trip, and its keys are raw "YYYY-MM-DD" strings — but the dashboard's
    // AreaChart expects exactly 7 points labeled "Mon".."Sun", including
    // zero-earning days (otherwise the chart shows gaps or a misaligned axis).
    // Build the full 7-day range here and merge the aggregated totals into it.
    const earningsByDate = {};
    weeklyTripsRaw.forEach((d) => {
      earningsByDate[d._id] = d.earnings;
    });

    const weeklyEarnings = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString("en-US", { weekday: "short" });
      weeklyEarnings.push({ day: label, earnings: earningsByDate[dateKey] || 0 });
    }

    // Acceptance / completion / cancellation rates
    const totalRequests = await RideRequest.countDocuments({ driverId: auth.driverId });
    const acceptedRequests = await RideRequest.countDocuments({
      driverId: auth.driverId,
      status: "accepted",
    });
    const acceptanceRate = totalRequests > 0 ? Math.round((acceptedRequests / totalRequests) * 100) : 0;

    const totalTripsAllTime = await Trip.countDocuments({ driverId: auth.driverId });
    const completedTrips = await Trip.countDocuments({
      driverId: auth.driverId,
      status: "Completed",
    });
    const cancelledTrips = await Trip.countDocuments({
      driverId: auth.driverId,
      status: "Cancelled",
    });
    const completionRate = totalTripsAllTime > 0 ? Math.round((completedTrips / totalTripsAllTime) * 100) : 0;
    const cancellationRate = totalTripsAllTime > 0 ? Math.round((cancelledTrips / totalTripsAllTime) * 100) : 0;

    return NextResponse.json({
      todaysEarnings,
      todaysTripCount: todaysTrips.length,
      rating: driver.rating,
      totalTrips: driver.totalTrips,
      totalEarnings: driver.totalEarnings,
      isOnline: driver.isOnline,
      weeklyEarnings,
      performance: {
        acceptanceRate,
        completionRate,
        cancellationRate,
      },
    });
  } catch (err) {
    console.error("Fetch stats error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
