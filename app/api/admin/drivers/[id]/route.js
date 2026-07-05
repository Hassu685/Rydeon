import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import Trip from "@/models/Trip";
import { getAdminFromRequest } from "@/lib/auth";

// GET /api/admin/drivers/:id  -> driver profile + their last 10 trips
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const admin = getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Next.js 15+ passes `params` as a Promise — awaiting a plain object
    // (older Next.js versions) is a no-op, so this works either way.
    const { id } = await params;

    const driver = await Driver.findById(id).select("-password");
    if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

    const recentTrips = await Trip.find({ driverId: id }).sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({ driver, recentTrips });
  } catch (err) {
    console.error("Admin get driver error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PUT /api/admin/drivers/:id
// body can include any of: { isSuspended, isOnline, name, phone, rating }
// e.g. { "isSuspended": true }  to suspend a driver
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const admin = getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const allowedFields = ["isSuspended", "isOnline", "name", "phone", "rating", "vehicle"];
    const updates = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const driver = await Driver.findByIdAndUpdate(id, updates, { new: true }).select(
      "-password"
    );
    if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

    return NextResponse.json({ driver });
  } catch (err) {
    console.error("Admin update driver error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE /api/admin/drivers/:id
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const admin = getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const driver = await Driver.findByIdAndDelete(id);
    if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

    return NextResponse.json({ message: "Driver deleted" });
  } catch (err) {
    console.error("Admin delete driver error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
