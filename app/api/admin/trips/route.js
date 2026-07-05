import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { getAdminFromRequest } from "@/lib/auth";
import { parsePagination } from "@/lib/pagination";

// GET /api/admin/trips?page=1&limit=20&status=Completed&driverId=...&from=2026-06-01&to=2026-07-04
export async function GET(req) {
  try {
    await dbConnect();
    const admin = getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePagination(searchParams, { defaultLimit: 20 });
    const status = searchParams.get("status");
    const driverId = searchParams.get("driverId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (driverId && !mongoose.isValidObjectId(driverId)) {
      return NextResponse.json({ error: "driverId is not a valid id" }, { status: 400 });
    }

    const filter = {};
    if (status) filter.status = status;
    if (driverId) filter.driverId = driverId;
    if (from || to) {
      filter.createdAt = {};
      if (from) {
        const fromDate = new Date(from);
        if (isNaN(fromDate.getTime())) {
          return NextResponse.json({ error: "from is not a valid date" }, { status: 400 });
        }
        filter.createdAt.$gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        if (isNaN(toDate.getTime())) {
          return NextResponse.json({ error: "to is not a valid date" }, { status: 400 });
        }
        filter.createdAt.$lte = toDate;
      }
    }

    const trips = await Trip.find(filter)
      .populate("driverId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Trip.countDocuments(filter);

    return NextResponse.json({
      trips,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Admin fetch trips error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
