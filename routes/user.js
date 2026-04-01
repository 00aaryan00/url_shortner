const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { handleUserSignup, handleUserLogin, handleUserLogout } = require("../controllers/user");

const router = express.Router();

router.post("/", asyncHandler(handleUserSignup));
router.post("/login", asyncHandler(handleUserLogin));
router.get("/logout", handleUserLogout);

module.exports = router;
