import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { getAdminFromRequest } from "@/lib/auth";
import { parsePagination } from "@/lib/pagination";

// GET /api/admin/drivers?page=1&limit=20&search=ali&isOnline=true&isSuspended=false
export async function GET(req) {
  try {
    await dbConnect();
    const admin = getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePagination(searchParams, { defaultLimit: 20 });
    const search = searchParams.get("search");
    const isOnline = searchParams.get("isOnline");
    const isSuspended = searchParams.get("isSuspended");

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (isOnline !== null && isOnline !== undefined && isOnline !== "") {
      filter.isOnline = isOnline === "true";
    }
    if (isSuspended !== null && isSuspended !== undefined && isSuspended !== "") {
      filter.isSuspended = isSuspended === "true";
    }

    const drivers = await Driver.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Driver.countDocuments(filter);

    return NextResponse.json({
      drivers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Admin fetch drivers error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
