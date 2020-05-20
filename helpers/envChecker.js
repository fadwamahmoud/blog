require("dotenv").config();

function envChecker() {
  const required = ["DB_HOST", "PRIVATE_KEY", "port"];
  required.forEach((req) => {
    if (!process.env[req]) process.exit();
  });
}
module.exports = {
  envChecker,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_HOST: process.env.DB_HOST,
  port: process.env.port,
};
