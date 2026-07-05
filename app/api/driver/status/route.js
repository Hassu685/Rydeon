import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { getDriverFromRequest } from "@/lib/auth";

// PUT /api/driver/status   body: { isOnline: true | false }
export async function PUT(req) {
  try {
    await dbConnect();
    const auth = getDriverFromRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { isOnline } = await req.json();
    if (typeof isOnline !== "boolean") {
      return NextResponse.json({ error: "isOnline must be true or false" }, { status: 400 });
    }

    const driver = await Driver.findByIdAndUpdate(
      auth.driverId,
      { isOnline },
      { new: true }
    );

    if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

    return NextResponse.json({ isOnline: driver.isOnline });
  } catch (err) {
    console.error("Update status error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
