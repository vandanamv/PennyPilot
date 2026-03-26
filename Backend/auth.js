const crypto = require("crypto");

const LEGACY_JWT_SECRET = "Manoj";
const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;

const getJwtSecret = () => process.env.JWT_SECRET || LEGACY_JWT_SECRET;

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `${HASH_PREFIX}$${salt}$${derivedKey}`;
};

const isHashedPassword = (storedPassword) =>
  typeof storedPassword === "string" && storedPassword.startsWith(`${HASH_PREFIX}$`);

const verifyHashedPassword = (password, storedPassword) => {
  if (!isHashedPassword(storedPassword)) {
    return false;
  }

  const [, salt, storedKey] = storedPassword.split("$");

  if (!salt || !storedKey) {
    return false;
  }

  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(storedKey, "hex");

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedBuffer, derivedKey);
};

const verifyPassword = (password, storedPassword) => {
  if (isHashedPassword(storedPassword)) {
    return verifyHashedPassword(password, storedPassword);
  }

  return storedPassword === password;
};

module.exports = {
  getJwtSecret,
  hashPassword,
  isHashedPassword,
  verifyPassword,
};
