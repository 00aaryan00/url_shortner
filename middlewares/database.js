const { connectToMongoDB } = require("../connect");

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/short-url";

async function ensureDatabase(req, res, next) {
  try {
    await connectToMongoDB(MONGODB_URL);
    return next();
  } catch (error) {
    console.error("Database unavailable", error.message);

    if (req.accepts("html")) {
      return res.status(500).render("notFound", {
        title: "Database Error",
        message: "Unable to connect to database. Please check if MONGODB_URL is set in environment variables.",
      });
    }

    return res.status(500).json({
      error: "Database connection failed.",
      details: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}

module.exports = {
  ensureDatabase,
};
