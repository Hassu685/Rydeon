import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { signToken } from "@/lib/auth";

// POST /api/admin/auth/register
// body: { name, email, password, setupKey }
// setupKey must match process.env.ADMIN_SETUP_KEY so random users can't create admin accounts.
export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, setupKey } = await req.json();

    if (!name || !email || !password || !setupKey) {
      return NextResponse.json(
        { error: "name, email, password, and setupKey are required" },
        { status: 400 }
      );
    }

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json({ error: "Invalid setup key" }, { status: 403 });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email: email.toLowerCase(), password: hashedPassword });

    const token = signToken({ adminId: admin._id.toString(), email: admin.email, role: admin.role });

    return NextResponse.json(
      { token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Admin register error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
