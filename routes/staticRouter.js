const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { renderHome, renderSignup, renderLogin } = require("../controllers/static");

const router = express.Router();

router.get("/", asyncHandler(renderHome));
router.get("/signup", renderSignup);
router.get("/login", renderLogin);

module.exports = router;
