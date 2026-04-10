const { connectToMongoDB } = require("../connect");

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/short-url";

async function ensureDatabase(req, res, next) {
  try {
    await connectToMongoDB(MONGODB_URL);
    return next();
  } catch (error) {
    console.error("Database unavailable", error);

    if (req.accepts("html")) {
      return res.status(503).render("notFound", {
        title: "Service unavailable",
        message: "The database is temporarily unavailable. Please try again in a moment.",
      });
    }

    return res.status(503).json({
      error: "Service temporarily unavailable. Database connection failed.",
    });
  }
}

module.exports = {
  ensureDatabase,
};
