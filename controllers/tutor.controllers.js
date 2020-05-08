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
        //retrieve all the valid subjects
        const validSubjects = await Subject.find().select({ name: 1 });
        const validSubjectName = []
        validSubjects.forEach(subject => {
            validSubjectName.push(subject.name)
        })

        //filter out the subjects that are not valid
        const subjectCheck = subjects.filter(subject => {
            return validSubjectName.includes(subject) == true
        })
        
        if(subjectCheck.length > 0){
            const tutor = await new Tutor({
                name,
                email,
                admin,
                password: hashedPassword,
                subjects : subjectCheck 
              }).save();

            res.status(200).json({ message: tutor , meta: "If all the subjects you provided did not reflect in your record, note that this is because the subject is not a valid registered subject in the Database"});
        }else{
            res.status(400).json({error: "The subject(s) you entered isn't a valid subject in the db, you can leave out the subject field and go register for subject after you are logged in" })
        }
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
