const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET; // Load JWT_SECRET from environment variables

function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const token = req.headers.authorization;

  // token is like - Bearer asdlfjas;fjkalkfj : you need to only the gibberish not the bearer word.
  const words = token.split(" ");
  const jwtToken = words[1];
  try {
    const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
    if (decodedValue.username) {
      next();
    } else {
      res.status(403).json({
        msg: "You are not authenticated",
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Incorrect input",
      error: err.message,
    });
  }
}

module.exports = adminMiddleware;
