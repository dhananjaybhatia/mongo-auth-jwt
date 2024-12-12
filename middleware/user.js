const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET; // Load JWT_SECRET from environment variables

function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected

  const token = req.headers.authorization;
  const words = token.split(" ");
  const jwtToken = words[1];

  try {
    const decodedValue = jwt.verify(jwtToken, JWT_SECRET);

    if (decodedValue.username) {
      req.username = decodedValue.username;
      next();
    } else {
      res.status(403).json({
        msg: " You are not authorised User",
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Incorrect input",
      err: err.message,
    });
  }
}

module.exports = userMiddleware;
