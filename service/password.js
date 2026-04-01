const crypto = require("crypto");
const util = require("util");

//can also use bcrypt or argon2 for password hashing, but scrypt is built-in and secure enough for most use cases.

const scrypt = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function comparePassword(password, hashedPassword) {
  if (!hashedPassword || !hashedPassword.includes(":")) return false;

  const [salt, storedHash] = hashedPassword.split(":");
  const derivedKey = await scrypt(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, "hex"); //Convert stored string → binary format

  if (storedBuffer.length !== derivedKey.length) return false;

  return crypto.timingSafeEqual(storedBuffer, derivedKey);
}

module.exports = {
  hashPassword,
  comparePassword,
};
