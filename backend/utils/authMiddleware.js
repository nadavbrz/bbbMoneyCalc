const { verify } = require("jsonwebtoken");
const User = require("../models/user");
const secretKey = process.env.SECRET_KEY || "secret";

function validateJSONToken(token) {
  return new Promise((resolve, reject) => {
    if (!token || typeof token !== 'string') {
      return reject(new Error('No valid token provided'));
    }
    verify(token, secretKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

async function checkAuthMiddleware(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Not authenticated. Auth header missing." });
  }

  const authFragments = req.headers.authorization.split(" ");
  if (authFragments.length !== 2) {
    return res.status(401).json({ message: "Not authenticated. Invalid auth header." });
  }

  const authToken = authFragments[1];
  try {
    const validatedToken = await validateJSONToken(authToken);
    const user = await User.findById(validatedToken.userId);

    if (!user) {
      return res.status(401).json({ message: "Not authenticated. User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated", error: err.message });
  }
}

module.exports = { checkAuthMiddleware };
