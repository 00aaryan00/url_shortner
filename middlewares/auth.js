const { verifyToken } = require("../service/auth");

function getUserFromRequest(req) {
  const token = req.cookies?.uid;
  if (!token) return null;
  return verifyToken(token);
}

function restrictToLoggedinUserOnly(req, res, next) {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.redirect("/login");
  }

  req.user = user;
  return next();
}

function checkAuth(req, res, next) {
  req.user = getUserFromRequest(req);
  return next();
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth,
};
