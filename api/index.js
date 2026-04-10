const { app } = require("../app");

module.exports = async (req, res) => {
  try {
    return app(req, res);
  } catch (error) {
    console.error("❌ Serverless function error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "production" ? "An error occurred" : error.message,
    });
  }
};
