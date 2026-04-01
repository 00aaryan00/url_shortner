const crypto = require("crypto");

const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 7;
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";


// by using jsonwebtoken library, we can easily create and verify JWTs without manually handling the encoding, decoding, and signature verification processes

// const jwt = require("jsonwebtoken");

// const token = jwt.sign(user, "secret");
// const decoded = jwt.verify(token, "secret");





function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(`${normalized}${"=".repeat(padding)}`, "base64").toString("utf8");
}

function createSignature(data) {
  return crypto
    .createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signToken(user) {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = toBase64Url(
    JSON.stringify({
      sub: String(user._id),
      name: user.name,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + DEFAULT_EXPIRY_SECONDS,
    })
  );

  const signature = createSignature(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSignature = createSignature(`${header}.${payload}`);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(fromBase64Url(payload));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      _id: decodedPayload.sub,
      name: decodedPayload.name,
      email: decodedPayload.email,
    };
  } catch (error) {
    return null;
  }
}

module.exports = {
  signToken,
  verifyToken,
};
