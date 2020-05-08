const express = require("express");
const router = express.Router();

const {
  postSignUp,
  getTutor,
  bookLesson,
  postLogin,
} = require("../controllers/student.controller");

const { isStudent } = require("../validation/index.validation");

router.post("/signup", postSignUp);

router.post("/login", postLogin);

router.get("/getTutor", isStudent, getTutor);

router.post("/bookLesson", isStudent, bookLesson);
module.exports = router;
