const express = require("express");
const router = express.Router();

const { errorHandler, isAdmin } = require("../validation/index.validation");
const {
  getSignUp,
  postSignUp,
  postLogin,
} = require("../controllers/tutor.controllers");

router.get("/signup", isAdmin, errorHandler(getSignUp));

router.post("/signup", errorHandler(postSignUp));

router.post("/login", errorHandler(postLogin));

module.exports = router;
