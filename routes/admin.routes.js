const express = require("express");
const router = express.Router();

const {
  postMakeAdmin,
  createSubject,
  updateSubject,
  deleteSubject,
  deleteCategory,
  getTutors,
  getTutorById,
  deleteTutor,
  createLesson,
  getLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/admin.controllers");

const { isAdmin } = require("../validation/index.validation");

router.post("/maketutoradmin", isAdmin, postMakeAdmin);

//subject crud
router.post("/createSubject", isAdmin, createSubject);

router.put("/updateSubject/:subjectId", isAdmin, updateSubject);

router.delete("/deletSubject/:subjectId", isAdmin, deleteSubject);

//category crud

router.delete("/deleteCategory", isAdmin, deleteCategory);

//tutors crud
router.get("/", isAdmin, getTutors);

router.get("/:tutorId", isAdmin, getTutorById);

router.delete("/deleteTutor/:tutorId", isAdmin, deleteTutor);

//lesson crud
router.post("/createLesson", isAdmin, createLesson);

router.get("/getLesson", isAdmin, getLesson);

router.get("/getLesson/:lessonId", isAdmin, getLessonById);

router.put("/updateLesson/:lessonId", isAdmin, updateLesson);

router.delete("/deleteLesson/:lessonId", isAdmin, deleteLesson);

module.exports = router;
