const Lesson = require("../models/lesson.model");
const Student = require("../models/student.model");
const Tutor = require("../models/tutor.model");
const Subject = require("../models/subject.model");

const { jwtSecret } = require("../config/config.index");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.postSignUp = async (req, res) => {
  try {
    const { name, email, admin, password, subjects } = req.body;
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
        .json({ message: "Tutor with email already exists" });
    } else {
      if (subjects) {
        return res.status(400).json({
          error:
            "Please leave out the subjects field. You get an opportunity to register subjects after you are logged in",
        });
      } else {
        const tutor = await new Tutor({
          name,
          email,
          admin,
          password: hashedPassword,
        }).save();

        res.status(200).json({
          message: tutor,
        });
      }
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
        //sign jwt
        const payload = {
          email: tutor[0].email,
          isAdmin: tutor[0].admin,
          name: tutor[0].name,
          id: tutor[0]._id,
          tutor: true,
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

module.exports.postTakeSubject = async (req, res) => {
  try {
    const { subject, category } = req.body;
    //check that it's a valid category
    const validCategory = ["primary", "jss", "sss"];
    if (validCategory.includes(category)) {
      //check that subject exist
      const subjectCount = await Subject.find({
        name: subject,
        category,
      }).count((err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      });
      //return all valid subjects and format it
      const validSubject = await Subject.find();
      const validSubjectData = [];
      validSubject.forEach((subject) => {
        validSubjectData.push(`${subject.name} : ${subject.category}`);
      });
      if (subjectCount > 0) {
        //get the logged in tutor and update their document accordingly
        const token = req.cookies.token;
        const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
          if (err) {
            res.status(400).json({ error: err });
          }
          return decoded;
        });
        //get id of logged in user
        const loggedInUserEmail = decoded.data.email;
        //get the subjects of the logged in user
        let tutorSubject = await Tutor.find({ email: loggedInUserEmail });
        //to get the id of the subject you want to register
        let subjectId = await Subject.find({ name: subject, category });
        //check that the subject hasn't been registered before
        if (tutorSubject[0].subjects.includes(subjectId[0]._id)) {
          return res
            .status(400)
            .json({ error: "You can't register for same subject twice" });
        }
        await tutorSubject[0].subjects.push(subjectId[0]._id);
        await Tutor.updateOne(
          { email: loggedInUserEmail },
          {
            $set: {
              subjects: tutorSubject[0].subjects,
            },
          }
        );
        await res.json({ message: "Registered subject succcessfully" });
      } else {
        res.status(400).json({
          error: `Please Enter a valid subject. Here is a list of valid subjects and their categories you can register for -> ${validSubjectData}`,
        });
      }
    } else {
      res.status(400).json({ error: "You entered an invalid category" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.getRegisteredSubject = async (req, res) => {
  try {
    //get the logged in tutor
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      return decoded;
    });
    const loggedInUserEmail = decoded.data.email;
    const tutorSubject = await Tutor.find({ email: loggedInUserEmail })
      .populate("subjects")
      .exec();
    res.status(200).json({ message: tutorSubject[0].subjects });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.postUpdateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, category, data } = req.body;
    //check that it's a valid subject
    const subjectCount = await Subject.find({
      _id: subjectId,
    }).count((err, count) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return count;
    });
    //check that tutor registered for the subject
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      return decoded;
    });
    const loggedInUserEmail = decoded.data.email;
    //return all the subjects tutor is registered to
    let tutorSubject = await Tutor.find({ email: loggedInUserEmail });
    tutorSubject = tutorSubject[0].subjects;
    if (tutorSubject.includes(subjectId)) {
      if (subjectCount > 0) {
        if (name) {
          await Subject.updateOne(
            { _id: subjectId },
            {
              $set: {
                name,
              },
            }
          );
        }
        if (category) {
          await Subject.updateOne(
            { _id: subjectId },
            {
              $set: {
                category,
              },
            }
          );
        }

        if (data) {
          let subjectData = await Subject.find({ _id: subjectId }).select({
            data: 1,
          });
          if (subjectData[0].data.includes(data)) {
            return res.status(400).json({ error: "Data url already exists" });
          }
          await subjectData[0].data.push(data);
          await Subject.updateOne(
            { _id: subjectId },
            {
              $set: {
                data: subjectData[0].data,
              },
            }
          );
        }

        res.status(200).json({ message: `Updated subject successfully` });
      } else {
        res.status(400).json({
          error: "Please enter a valid subject",
        });
      }
    } else {
      res
        .status(400)
        .json({ error: "You can't update a subject you didn't register" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    //check that it's a valid subject
    const subjectCount = await Subject.find({
      _id: subjectId,
    }).count((err, count) => {
      if (err) {
        res.status(500).json({ error: err });
      }
      return count;
    });
    //check that tutor registered for the subject
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      return decoded;
    });
    const loggedInUserEmail = decoded.data.email;
    //return all the subjects tutor is registered to
    let tutorSubject = await Tutor.find({ email: loggedInUserEmail });
    tutorSubject = tutorSubject[0].subjects;
    if (tutorSubject.includes(subjectId)) {
      if (subjectCount > 0) {
        await Subject.findByIdAndDelete(subjectId);

        res.status(200).json({ message: "Deleted subject successfully" });
      } else {
        res.status(400).json({ error: "Enter a valid subject" });
      }
    } else {
      res
        .status(400)
        .json({ error: "You can't delete a subject you didn't register for" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
