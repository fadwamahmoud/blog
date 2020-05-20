const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;
const hash = async (text) => {
  return bcrypt.hash(text, SALT_ROUNDS);
};
const compare = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
module.exports = { hash, compare };
