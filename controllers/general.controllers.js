const Lesson = require("../models/lesson.model");
const Student = require("../models/student.model");
const Tutor = require("../models/tutor.model");
const Subject = require("../models/subject.model");

const { jwtSecret } = require("../config/config.index");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");

module.exports.getSubjectById = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { category } = req.body;
    //verify that it's a valid category
    const validCategory = ["primary", "sss", "jss"];
    if (validCategory.includes(category)) {
      const isValidSubjectCount = await Subject.find({
        _id: subjectId,
        category,
      }).count((err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      });
      if (isValidSubjectCount > 0) {
        const subject = await Subject.find({ _id: subjectId, category });
        res.status(200).json({ message: subject });
      } else {
        res
          .status(400)
          .json({ error: "Please enter a valid subject Id or category" });
      }
    } else {
      res.status(400).json({ error: "Enter a valid category please" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.getSubject = async (req, res) => {
  try {
    const { category } = req.body;
    //verify that it's a valid category
    const validCategory = ["primary", "sss", "jss"];
    if (validCategory.includes(category)) {
      const subjectsInCategory = await Subject.find({ category });
      res.status(200).json({ message: subjectsInCategory });
    } else {
      res.status(400).json({ error: "Please enter a valid category" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.getCategory = async (req, res) => {
  try {
    const category = await Subject.find();
    res.status(200).json({ message: category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.searchSubject = async (req, res) => {
  try {
    const { subjectName } = req.body;
    const subject = await Subject.find({
      $text: { $search: subjectName },
    }).exec();
    res.status(200).json({ message: subject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.searchTutors = async (req, res) => {
  try {
    const { tutorName } = req.body;
    const tutor = await Tutor.find({ $text: { $search: tutorName } }).exec();
    res.status(200).json({ message: tutor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
