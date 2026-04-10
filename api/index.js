const { app, ensureAppReady } = require("../app");

module.exports = async (req, res) => {
  try {
    await ensureAppReady();
    return app(req, res);
  } catch (error) {
    console.error("Failed to initialize app", error);
    return res.status(503).send("Service temporarily unavailable. Database connection failed.");
  }
};
