const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config/config.index");
const Tutor = require("../models/tutor.model");

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
      next();
    } else {
      res
        .status(401)
        .json({ error: "You aren't authorized to view this route" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.isTutor = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      return decoded;
    });
    if (decoded.data.tutor == true) {
      next();
    } else {
      res
        .status(401)
        .json({ error: "You aren't authorized to view this route" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.isStudent = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      return decoded;
    });
    if (decoded.data.tutor == false) {
      next();
    } else {
      res
        .status(401)
        .json({ error: "You aren't authorized to view this route" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      return decoded;
    });

    if (decoded.data.email) {
      next();
    } else {
      res
        .status(401)
        .json({ error: "You should be logged in to access this route" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.isDeactivated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      return decoded;
    });

    const currentlyLoggedInUser = decoded.data.id;
    let tutorActivated = await Tutor.findById(currentlyLoggedInUser);
    if (tutorActivated.isActive == false) {
      return res
        .status(401)
        .json({ error: "You have been deactivated by the admin" });
    }
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
