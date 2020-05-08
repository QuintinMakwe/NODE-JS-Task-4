const express = require("express");
const router = express.Router();

const { isTutor } = require("../validation/index.validation");
const {
  postSignUp,
  postLogin,
  postTakeSubject,
  getRegisteredSubject,
  postUpdateSubject,
  deleteSubject,
} = require("../controllers/tutor.controllers");

router.post("/signup", postSignUp);

router.post("/login", postLogin);

router.post("/registerSubject", isTutor, postTakeSubject);

router.get("/viewRegisteredSubject/", isTutor, getRegisteredSubject);

router.put("/updateSubject/:subjectId", isTutor, postUpdateSubject);

router.delete("/deleteSubject/:subjectId", isTutor, deleteSubject);
module.exports = router;
