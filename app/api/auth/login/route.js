import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    const driver = await Driver.findOne({ email: email.toLowerCase() });
    if (!driver) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, driver.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({ driverId: driver._id.toString(), email: driver.email });

    return NextResponse.json({
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        rating: driver.rating,
        isOnline: driver.isOnline,
        totalTrips: driver.totalTrips,
        totalEarnings: driver.totalEarnings,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
