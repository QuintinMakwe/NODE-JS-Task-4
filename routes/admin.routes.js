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

const { isAdmin, isDeactivated } = require("../validation/index.validation");

router.post("/maketutoradmin", isAdmin, isDeactivated, postMakeAdmin);

//subject crud
router.post("/createSubject", isAdmin, isDeactivated, createSubject);

router.put("/updateSubject/:subjectId", isAdmin, isDeactivated, updateSubject);

router.delete(
  "/deletSubject/:subjectId",
  isAdmin,
  isDeactivated,
  deleteSubject
);

//category crud

router.delete("/deleteCategory", isAdmin, isDeactivated, deleteCategory);

//tutors crud
router.get("/", isAdmin, isDeactivated, getTutors);

router.get("/:tutorId", isAdmin, isDeactivated, getTutorById);

router.put("/deactivateTutor/:tutorId", isAdmin, isDeactivated, deleteTutor);

//lesson crud
router.post("/createLesson", isAdmin, isDeactivated, createLesson);

router.get("/getLesson", isAdmin, isDeactivated, getLesson);

router.get("/getLesson/:lessonId", isAdmin, isDeactivated, getLessonById);

router.put("/updateLesson/:lessonId", isAdmin, isDeactivated, updateLesson);

router.delete("/deleteLesson/:lessonId", isAdmin, isDeactivated, deleteLesson);

module.exports = router;
