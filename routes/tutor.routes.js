const express = require("express");
const router = express.Router();

const { isTutor } = require("../validation/index.validation");
const { postSignUp, postLogin } = require("../controllers/tutor.controllers");

router.post("/signup", postSignUp);

router.post("/login", postLogin);

module.exports = router;
