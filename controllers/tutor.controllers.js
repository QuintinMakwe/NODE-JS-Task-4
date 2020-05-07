const Lesson = require("../models/lesson.model");
const Material = require("../models/material.model");
const Student = require("../models/student.model");
const Tutor = require("../models/tutor.model");

const { jwtSecret } = require("../config/config.index");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.getSignUp = (req, res) => {
  res.status(200).json({
    message:
      "You arrived the get sign up page, a form should be displayed here",
  });
};

module.exports.postSignUp = async (req, res) => {
  try {
    const { name, email, admin, password } = req.body;
    //create a route to create subjects
    const hashedPassword = bcrypt.hashSync(password, 10);
    const tutorCount = await Tutor.find({ email }).count((err, count) => {
      if (err) {
        return res.json({ error: err });
      }
      return count;
    });

    if (tutorCount > 0) {
      return res
        .status(400)
        .json({ message: "User with email already exists" });
    } else {
      const tutor = await new Tutor({
        name,
        email,
        admin,
        password: hashedPassword,
      }).save();

      res.status(200).json({ message: tutor });
    }
  } catch (err) {
    res.status(300).json({ error: err.message });
  }
};

module.exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tutorCount = await Tutor.find({ email }).count((err, count) => {
      if (err) {
        return res.json({ error: err });
      }
      return count;
    });

    //If email exists
    if (tutorCount > 0) {
      let hashedPassword = await Tutor.find({ email }).select({ password: 1 });
      hashedPassword = hashedPassword[0].password;
      const isRightPassword = bcrypt.compareSync(password, hashedPassword);
      if (isRightPassword == true) {
        const tutor = await Tutor.find({ email: email });
        const payload = {
          email: tutor[0].email,
          isAdmin: tutor[0].admin,
          name: tutor[0].name,
          id: tutor[0]._id,
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
        res.json({ token, tutor });
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
