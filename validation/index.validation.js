const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config/config.index");

module.exports.errorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports.isAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      return decoded;
    });
    if (decoded.data.isAdmin == true) {
      console.log(decoded);
      next();
    } else {
      res.status(401).json({ err: "You aren't authorized to view this route" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
