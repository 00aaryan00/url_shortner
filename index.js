const { app, ensureAppReady } = require("./app");

const PORT = Number(process.env.PORT) || 8001;

ensureAppReady()
  .then(() => {
    app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
