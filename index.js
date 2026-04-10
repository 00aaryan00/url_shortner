const { app } = require("./app");

const PORT = Number(process.env.PORT) || 8001;

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
