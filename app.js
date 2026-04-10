require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const { ensureDatabase } = require("./middlewares/database");
const asyncHandler = require("./middlewares/asyncHandler");
const { handleRedirectShortURL } = require("./controllers/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth);

app.get("/url/:shortId", ensureDatabase, asyncHandler(handleRedirectShortURL));
app.use("/url", ensureDatabase, restrictToLoggedinUserOnly, urlRoute);
app.use("/user", ensureDatabase, userRoute);
app.use("/", staticRoute);

app.use((req, res) => {
  res.status(404).render("notFound", {
    title: "Page not found",
    message: "The page you requested does not exist.",
  });
});

app.use((error, req, res, next) => {
  console.error("❌ Error:", error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  const title = statusCode === 404 ? "Page not found" : statusCode === 500 ? "Something went wrong" : "Request failed";
  
  return res.status(statusCode).render("notFound", {
    title: title,
    message: error.message || "An unexpected error occurred.",
  });
});

module.exports = {
  app,
};
