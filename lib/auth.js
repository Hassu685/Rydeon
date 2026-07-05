import jwt from "jsonwebtoken";

// A missing JWT_SECRET must never fail silently: in production that would mean
// every token is signed with a publicly-known default, letting anyone forge
// a valid driver/admin token. Fail loudly on boot instead of at request time.
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET is not set. Set it in your environment before starting the app in production."
    );
  }
  console.warn(
    "[auth] JWT_SECRET is not set — using an insecure development-only fallback. " +
      "Set JWT_SECRET in .env.local before deploying."
  );
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_this_in_production";
const JWT_EXPIRES_IN = "7d";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Extracts and verifies the driver from the Authorization header.
 * Usage inside a route handler:
 *   const driver = getDriverFromRequest(req);
 *   if (!driver) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 */
export function getDriverFromRequest(req) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return decoded; // { driverId, email }
}

/**
 * Extracts and verifies an admin from the Authorization header.
 * Returns null if the token is missing/invalid OR if the token doesn't
 * carry an admin role (i.e. a driver token can't be used on admin routes).
 * Usage inside a route handler:
 *   const admin = getAdminFromRequest(req);
 *   if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 */
export function getAdminFromRequest(req) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;
  if (decoded.role !== "admin" && decoded.role !== "superadmin") return null;

  return decoded; // { adminId, email, role }
}
