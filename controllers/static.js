const URL = require("../models/url");

function getBaseUrl(req) {
  return process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
}

async function renderHome(req, res) {
  if (!req.user) {
    return res.redirect("/login");
  }

  const urls = await URL.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  const createdShortId = req.query.created?.trim();
  const generatedShortUrl = createdShortId ? `${getBaseUrl(req)}/url/${createdShortId}` : "";
  const success = createdShortId
    ? req.query.existing === "1"
      ? "That destination already had a short URL, so the existing one is shown below."
      : "Short URL created successfully."
    : "";

  return res.render("home", {
    error: "",
    success,
    generatedShortUrl,
    formData: { url: "" },
    urls,
    baseUrl: getBaseUrl(req),
  });
}

function renderSignup(req, res) {
  if (req.user) {
    return res.redirect("/");
  }

  return res.render("signup", {
    error: "",
    success: "",
    formData: {},
  });
}

function renderLogin(req, res) {
  if (req.user) {
    return res.redirect("/");
  }

  return res.render("login", {
    error: "",
    success: "",
    formData: {},
  });
}

module.exports = {
  renderHome,
  renderSignup,
  renderLogin,
};
