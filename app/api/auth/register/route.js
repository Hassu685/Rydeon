import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, phone, vehicle } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email, and password are required" },
        { status: 400 }
      );
    }

    const existing = await Driver.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      vehicle,
    });

    const token = signToken({ driverId: driver._id.toString(), email: driver.email });

    return NextResponse.json(
      {
        token,
        driver: {
          id: driver._id,
          name: driver.name,
          email: driver.email,
          rating: driver.rating,
          isOnline: driver.isOnline,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
