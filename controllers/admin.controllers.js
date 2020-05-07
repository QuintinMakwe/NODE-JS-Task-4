const Lesson = require("../models/lesson.model");
const Material = require("../models/material.model");
const Student = require("../models/student.model");
const Tutor = require("../models/tutor.model");

module.exports.postMakeAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    //verify that it's a valid tutor
    const isValidTutorCount = await Tutor.find({ email }).count(
      (err, count) => {
        if (err) {
          res.status(400).json({ error: err });
        }
        return count;
      }
    );
    if (isValidTutorCount > 0) {
      await Tutor.updateOne(
        { email },
        {
          $set: {
            admin: true,
          },
        }
      );
      res
        .status(200)
        .json({ message: `Tutor with email ${email} has been made an admin` });
    } else {
      res.status(400).json({ error: "Enter a valid tutor email please" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.createSubject = (req, res) => {};
module.exports.updateSubject = (req, res) => {};
module.exports.deleteSubject = (req, res) => {};
module.exports.deleteCategory = (req, res) => {};
module.exports.getTutors = (req, res) => {};
module.exports.getTutorById = (req, res) => {};
module.exports.deleteTutor = (req, res) => {};
module.exports.createLesson = (req, res) => {};
module.exports.getLesson = (req, res) => {};
module.exports.getLessonById = (req, res) => {};
module.exports.updateLesson = (req, res) => {};
module.exports.deleteLesson = (req, res) => {};
