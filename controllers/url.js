const { nanoid } = require("nanoid");
const Url = require("../models/url");

function getBaseUrl(req) {
  return process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
}

function isValidHttpUrl(value) {
  try {
    const parsedUrl = new global.URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

async function loadUserUrls(userId) {
  return Url.find({ createdBy: userId }).sort({ createdAt: -1 });
}
 // Helper function to render the home page with dynamic state (errors, success messages, form data, etc.)
 // give this function obj to frontend(home.ejs file) and render accordingly
async function renderHomeWithState(req, res, payload) {
  return res.status(payload.statusCode || 200).render("home", {
    error: payload.error || "",
    success: payload.success || "",
    generatedShortUrl: payload.generatedShortUrl || "",
    formData: payload.formData || { url: "" },
    urls: await loadUserUrls(req.user._id),
    baseUrl: getBaseUrl(req),
  });
}

async function handleGenerateNewShortURL(req, res) {
  const originalUrl = req.body.url?.trim();

  if (!originalUrl) {
    return renderHomeWithState(req, res, {
      statusCode: 400,
      error: "Please enter a URL to shorten.",
    });
  }

  if (!isValidHttpUrl(originalUrl)) {
    return renderHomeWithState(req, res, {
      statusCode: 400,
      error: "Please enter a valid URL that starts with http:// or https://.",
      formData: { url: originalUrl },
    });
  }

  const existingUrl = await Url.findOne({
    redirectURL: originalUrl,
    createdBy: req.user._id,
  });

  if (existingUrl) {
    return res.redirect(`/?created=${existingUrl.shortId}&existing=1`);
  }

  const shortId = nanoid(8);
  await Url.create({
    shortId,
    redirectURL: originalUrl,
    visitHistory: [],
    createdBy: req.user._id,
  });

  return res.redirect(`/?created=${shortId}`);
}

async function handleGetAnalytics(req, res) {
  const result = await Url.findOne({
    shortId: req.params.shortId,
    createdBy: req.user._id,
  });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found." });
  }

  return res.json({
    shortId: result.shortId,
    redirectURL: result.redirectURL,
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function handleRedirectShortURL(req, res) {
  const entry = await Url.findOneAndUpdate(
    { shortId: req.params.shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    { new: true }
  );

  if (!entry) {
    return res.status(404).render("notFound", {
      title: "Short URL not found",
      message: "That short link does not exist or may have been removed.",
    });
  }

  return res.redirect(entry.redirectURL);
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleRedirectShortURL,
};
