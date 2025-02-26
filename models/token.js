const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (id) => {
  const payload = { id };
  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "3d" });
  return token;
};

module.exports = {
  createToken,
};