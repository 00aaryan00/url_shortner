const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", asyncHandler(handleGenerateNewShortURL));
router.get("/analytics/:shortId", asyncHandler(handleGetAnalytics));

module.exports = router;
