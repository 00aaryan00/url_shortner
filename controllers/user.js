const User = require("../models/user");
const { signToken } = require("../service/auth");
const { hashPassword, comparePassword } = require("../service/password");


// httpOnly → JS cannot access (security)
// sameSite → CSRF protection
// maxAge → auto expiry

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

function renderAuthView(res, view, payload) {
  return res.status(payload.statusCode || 200).render(view, {
    error: payload.error || "",
    success: payload.success || "",
    formData: payload.formData || {},
  });
}

async function handleUserSignup(req, res) {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!name || !email || !password) {
    return renderAuthView(res, "signup", {
      statusCode: 400,
      error: "Name, email, and password are required.",
      formData: { name, email },
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return renderAuthView(res, "signup", {
      statusCode: 409,
      error: "An account with that email already exists.",
      formData: { name, email },
    });
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = signToken(user);
  res.cookie("uid", token, COOKIE_OPTIONS);
  return res.redirect("/");
}

async function handleUserLogin(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!email || !password) {
    return renderAuthView(res, "login", {
      statusCode: 400,
      error: "Email and password are required.",
      formData: { email },
    });
  }

  const user = await User.findOne({ email });
  const passwordMatches = user ? await comparePassword(password, user.password) : false;

  if (!user || !passwordMatches) {
    return renderAuthView(res, "login", {
      statusCode: 401,
      error: "Invalid email or password.",
      formData: { email },
    });
  }

  const token = signToken(user);
  res.cookie("uid", token, COOKIE_OPTIONS);
  return res.redirect("/");
}

function handleUserLogout(req, res) {
  res.clearCookie("uid", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.redirect("/login");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
};
