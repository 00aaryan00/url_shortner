const { connectToMongoDB } = require("../connect");

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/short-url";

async function ensureDatabase(req, res, next) {
  try {
    if (!MONGODB_URL || MONGODB_URL === "mongodb://localhost:27017/short-url") {
      console.warn("⚠️ MONGODB_URL not set in environment variables");
      return res.status(500).render("notFound", {
        title: "Configuration Error",
        message: "Database URL is not configured. Please contact the site administrator.",
      });
    }

    await connectToMongoDB(MONGODB_URL);
    return next();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    if (req.accepts("html")) {
      return res.status(500).render("notFound", {
        title: "Database Connection Error",
        message: "Unable to connect to database. Please try again in a moment.",
      });
    }

    return res.status(500).json({
      error: "Database connection failed",
      details: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

module.exports = {
  ensureDatabase,
};
