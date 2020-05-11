const express = require("express");
const router = express.Router();

const { isTutor, isDeactivated } = require("../validation/index.validation");
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

router.post("/registerSubject", isTutor, isDeactivated, postTakeSubject);

router.get(
  "/viewRegisteredSubject/",
  isTutor,
  isDeactivated,
  getRegisteredSubject
);

router.put(
  "/updateSubject/:subjectId",
  isTutor,
  isDeactivated,
  postUpdateSubject
);

router.delete(
  "/deleteSubject/:subjectId",
  isTutor,
  isDeactivated,
  deleteSubject
);
module.exports = router;
