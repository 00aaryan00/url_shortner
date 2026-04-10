const express = require("express");
const { ensureDatabase } = require("../middlewares/database");
const asyncHandler = require("../middlewares/asyncHandler");
const { renderHome, renderSignup, renderLogin } = require("../controllers/static");

const router = express.Router();

router.get("/", ensureDatabase, asyncHandler(renderHome));
router.get("/signup", renderSignup);
router.get("/login", renderLogin);

module.exports = router;
