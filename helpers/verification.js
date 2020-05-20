const util = require("util");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./envChecker");
const User = require("../Models/userModel");

const verifyUser = async (req) => {
  try {
    const vrfy = util.promisify(jwt.verify);
    const token = req.headers.authorization;
    const payload = await vrfy(token, JWT_SECRET);
    return (user = await User.findOne({ username: payload.username }));
  } catch (error) {
    throw new Error("verification error");
  }
};

module.exports = verifyUser;
