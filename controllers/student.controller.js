const Lesson = require("../models/lesson.model");
const Student = require("../models/student.model");
const Tutor = require("../models/tutor.model");
const Subject = require("../models/subject.model");

const { jwtSecret } = require("../config/config.index");

const { checkEmptyFields } = require("../validation/index.validation");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.postSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //check for empty fields
    const checkTrimData = checkEmptyFields(req.body);
    if (checkTrimData) {
      return res
        .status(400)
        .json({ error: `You can't leave the ${checkTrimData} field empty` });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const studentCount = await Student.find({ email }).count((err, count) => {
      if (err) {
        return res.json({ error: err });
      }
      return count;
    });

    if (studentCount > 0) {
      return res
        .status(400)
        .json({ message: "Tutor with email already exists" });
    } else {
      const student = await new Student({
        name,
        email,
        password: hashedPassword,
      }).save();

      res.status(200).json({
        message: student,
      });
    }
  } catch (err) {
    res.status(300).json({ error: err.message });
  }
};
module.exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check for empty fields
    const checkTrimData = checkEmptyFields(req.body);
    if (checkTrimData) {
      return res
        .status(400)
        .json({ error: `You can't leave the ${checkTrimData} field empty` });
    }
    const studentCount = await Student.find({ email }).count((err, count) => {
      if (err) {
        return res.json({ error: err });
      }
      return count;
    });

    //If email exists
    if (studentCount > 0) {
      let hashedPassword = await Student.find({ email }).select({
        password: 1,
      });
      hashedPassword = hashedPassword[0].password;
      const isRightPassword = bcrypt.compareSync(password, hashedPassword);
      if (isRightPassword == true) {
        const student = await Student.find({ email: email });
        //sign jwt
        const payload = {
          email: student[0].email,
          isAdmin: student[0].admin,
          name: student[0].name,
          id: student[0]._id,
          tutor: false,
        };
        const token = jwt.sign({ data: payload }, jwtSecret, {
          expiresIn: "1d",
          issuer: "QuintinMakwe",
        });
        //register token in cookie
        res.cookie("token", token, {
          expires: new Date(Date.now() + 86400000),
          secure: false,
          httpOnly: true,
        });
        res.json({ token, student });
      } else {
        res
          .status(400)
          .json({ error: "You've entered a wrong email or password" });
      }
    } else {
      res
        .status(400)
        .json({ error: "You've entered a wrong email or password" });
    }
  } catch (err) {
    res.json({ error: err.messge });
  }
};
module.exports.getTutor = async (req, res) => {
  try {
    //see all tutors taking a subject in category
    const { subject, category } = req.body;
    //check for empty fields
    const checkTrimData = checkEmptyFields(req.body);
    if (checkTrimData) {
      return res
        .status(400)
        .json({ error: `You can't leave the ${checkTrimData} field empty` });
    }
    //search subject model with that subject name and category, if match return subjectId
    //search all the tutors.subject for the returned subject and return the tutors
    const isValidSubject = await Subject.find({
      name: subject,
      category,
    }).count((err, count) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return count;
    });
    if (isValidSubject > 0) {
      //return subject id
      let searchedSubject = await Subject.find({
        name: subject,
        category,
      }).select({ _id: 1 });
      searchedSubject = searchedSubject[0]._id;
      //search all the tutors.subject for the returned subject and return the tutors
      const tutorsSubjectArray = await Tutor.find().select({ subjects: 1 });
      let tutorsTeachingSubject = [];
      tutorsSubjectArray.forEach((subject) => {
        if (subject.subjects.includes(searchedSubject)) {
          tutorsTeachingSubject.push(subject._id);
        }
      });

      //after getting the tutors, put in an array and send back to user
      let result = [];
      //   tutorsTeachingSubject.forEach(async (tutorId) => {
      //     const tutor = await Tutor.find({ _id: tutorId });
      //     console.log(tutor[0]);

      //     result.push(tutor[0]);
      //   });
      for (let i = 0; i < tutorsTeachingSubject.length; i++) {
        const tutor = await Tutor.find({ _id: tutorsTeachingSubject[i] });
        result.push(tutor[0]);
      }

      res.status(200).json({ message: result });
    } else {
      res.status(400).json({
        error:
          "You've entered an invalid subject or category or both. Ensure that subject is under the right category",
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.bookLesson = async (req, res) => {
  try {
    const { name, tutor, subject } = req.body;
    //check for empty fields
    const checkTrimData = checkEmptyFields(req.body);
    if (checkTrimData) {
      return res
        .status(400)
        .json({ error: `You can't leave the ${checkTrimData} field empty` });
    }
    const isValidLesson = await Lesson.find({ name, tutor, subject }).count(
      (err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      }
    );
    if (isValidLesson > 0) {
      const lesson = await Lesson.find({ name, tutor, subject });
      //get the current logged in user
      const token = req.cookies.token;
      const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          res.status(400).json({ error: err });
        }
        return decoded;
      });
      const currentLoggedInUser = decoded.data.id;
      let student = await Student.findById(currentLoggedInUser);
      //check that they've not booked for course already
      if (student.lessons.includes(lesson[0]._id)) {
        return res
          .status(400)
          .json({ error: "You can't book for a lesson twice" });
      }
      await student.lessons.push(lesson[0]._id);
      await Student.updateOne(
        { _id: currentLoggedInUser },
        {
          $set: {
            lessons: student.lessons,
          },
        }
      );
      res.status(200).json({ message: student });
    } else {
      res
        .status(400)
        .json({ error: "Please enter a valid lesson information" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
