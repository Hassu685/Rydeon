import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { signToken } from "@/lib/auth";

// GET /api/auth/google-token
// Call this right after a successful Google sign-in (see /auth/google/finish).
// Reads the NextAuth session cookie, finds-or-creates a matching Driver record,
// and returns the SAME token format used by /api/auth/login and /api/auth/register —
// so the rest of the app only ever has to deal with one kind of token.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not signed in with Google" }, { status: 401 });
    }

    await dbConnect();

    const email = session.user.email.toLowerCase();
    let driver = await Driver.findOne({ email });

    if (!driver) {
      // Google-signed-up drivers get a random unusable password —
      // they'll always authenticate via Google, never via the password field.
      const randomPassword = Math.random().toString(36).slice(-14) + Date.now();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      driver = await Driver.create({
        name: session.user.name || "Driver",
        email,
        password: hashedPassword,
        authProvider: "google",
      });
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
      },
    });
  } catch (err) {
    console.error("Google token exchange error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
