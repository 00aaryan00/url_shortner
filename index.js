require("dotenv").config();


const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const asyncHandler = require("./middlewares/asyncHandler");
const { handleRedirectShortURL } = require("./controllers/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = Number(process.env.PORT) ;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/short-url";

connectToMongoDB(MONGODB_URL).then(() => console.log("MongoDB connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth);

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", asyncHandler(handleRedirectShortURL));

app.use((req, res) => {
  res.status(404).render("notFound", {
    title: "Page not found",
    message: "The page you requested does not exist.",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  return res.status(statusCode).render("notFound", {
    title: statusCode === 500 ? "Something went wrong" : "Request failed",
    message: error.message || "An unexpected error occurred.",
  });
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
