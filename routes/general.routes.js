const express = require("express");
const router = express.Router();

const {
  getSubjectById,
  getSubject,
  getCategory,
  searchSubject,
  searchTutors,
} = require("../controllers/general.controllers");

const { isLoggedIn } = require("../validation/index.validation");

router.get("/retrieveSubject/:subjectId", isLoggedIn, getSubjectById);

router.get("/retrieveSubject", isLoggedIn, getSubject);

router.get("/retrieveCategory", isLoggedIn, getCategory);

router.post("/searchSubject", isLoggedIn, searchSubject);

router.post("/searchTutors", isLoggedIn, searchTutors);

module.exports = router;
