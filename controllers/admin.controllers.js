const Lesson = require("../models/lesson.model");
const Student = require("../models/student.model");
const Subject = require("../models/subject.model");
const Tutor = require("../models/tutor.model");

const ObjectId = require("mongodb").ObjectID;

module.exports.postMakeAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    //verify that it's a valid tutor
    const isValidTutorCount = await Tutor.find({ email }).count(
      (err, count) => {
        if (err) {
          return res.status(400).json({ error: err });
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

module.exports.createSubject = async (req, res) => {
  try {
    const { name, category, data } = req.body;
    //verify that subject doesn't already exist
    const subjectCount = await Subject.find({ name, category }).count(
      (err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      }
    );
    if (subjectCount > 0) {
      res.status(400).json({
        error:
          "Subject already exist, enter another subject or add material for already existing subject",
      });
    } else {
      if (!data) {
        return res
          .status(400)
          .json({ error: "You have to input at least one data url" });
      }
      const subject = await new Subject({ name, category, data }).save();
      res.status(200).json({ subject });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.updateSubject = async (req, res) => {
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

    if (subjectCount > 0) {
      await Subject.findByIdAndDelete(subjectId);

      res.status(200).json({ message: "Deleted subject successfully" });
    } else {
      res.status(400).json({ error: "Enter a valid subject" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.deleteCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const validCategory = ["primary", "sss", "jss"];
    if (validCategory.includes(category)) {
      const subjectToDelete = await Subject.find({ category }).select({
        _id: 1,
      });
      subjectToDelete.forEach(async (subjectId) => {
        await Subject.findByIdAndDelete(subjectId);
      });
      res
        .status(200)
        .json({ message: `Deleted all subject in ${category} category` });
    } else {
      res.status(400).json({ error: "Enter a valid category please" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.getTutors = async (req, res) => {
  try {
    const tutor = await Tutor.find();
    res.status(200).json({ tutor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.getTutorById = async (req, res) => {
  try {
    const { tutorId } = req.params;
    //check that tutor id is valid
    const isValidTutorCount = await Tutor.find({ _id: tutorId }).count(
      (err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      }
    );
    if (isValidTutorCount) {
      const tutor = await Tutor.findById(tutorId);

      res.status(200).json({ message: tutor });
    } else {
      res.status(400).json({ error: "Please enter a valid tutor" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.deleteTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    //check that tutor id is valid
    const isValidTutorCount = await Tutor.find({ _id: tutorId }).count(
      (err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      }
    );
    if (isValidTutorCount) {
      await Tutor.findByIdAndDelete(tutorId);
      res.status(200).json({ message: "Tutor deleted successfully" });
    } else {
      res.status(400).json({ error: "Please enter a valid tutor" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.createLesson = async (req, res) => {
  try {
    const {
      name,
      timeStart,
      timeEnd,
      tutor,
      data,
      category,
      subject,
    } = req.body;
    //check that time start is not in the past and timeEnd is greater that timeStart
    if (
      new Date(timeStart).getTime() < new Date().getTime() ||
      new Date(timeEnd).getTime() < new Date().getTime()
    ) {
      return res.status(400).json({
        error: "You can't schedule a lesson to start or end in the past",
      });
    }
    if (new Date(timeStart).getTime() < new Date(timeEnd).getTime()) {
      //check that tutor is in the db
      const isValidTutorCount = await Tutor.find({ email: tutor }).count(
        (err, count) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          return count;
        }
      );
      const isValidSubjectCount = await Subject.find({
        category,
        name: subject,
      }).count((err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      });
      if (isValidTutorCount > 0 && isValidSubjectCount > 0) {
        //get the tutor id
        const lesson = await new Lesson({
          name,
          timeStart,
          timeEnd,
          tutor,
          data,
          subject,
          category,
        }).save();
        res.status(200).json({ message: lesson });
      } else {
        res.status(400).json({
          error:
            "To create lesson, enter a valid tutor name and valid subject under the right category",
        });
      }
    } else {
      res
        .status(400)
        .json({ error: "You lesson has to end after the start Date" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.find();

    res.status(200).json({ message: lesson });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const isValidLessonCount = await Lesson.find({ _id: lessonId }).count(
      (err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      }
    );
    if (isValidLessonCount > 0) {
      const lesson = await Lesson.findById(lessonId);

      res.status(200).json({ message: lesson });
    } else {
      res.status(400).json({ error: "Enter a valid lesson" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const {
      name,
      data,
      timeStart,
      timeEnd,
      tutor,
      subject,
      category,
    } = req.body;

    const isValidLessonCount = await Lesson.find({ _id: lessonId }).count(
      (err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      }
    );
    if (isValidLessonCount > 0) {
      if (name) {
        await Lesson.updateOne(
          { _id: lessonId },
          {
            $set: {
              name,
            },
          }
        );
      }
      if (timeStart) {
        await Lesson.updateOne(
          { _id: lessonId },
          {
            $set: {
              timeStart,
            },
          }
        );
      }
      if (timeEnd) {
        await Lesson.updateOne(
          { _id: lessonId },
          {
            $set: {
              timeEnd,
            },
          }
        );
      }
      if (tutor) {
        await Lesson.updateOne(
          { _id: lessonId },
          {
            $set: {
              tutor,
            },
          }
        );
      }
      if (subject) {
        await Lesson.updateOne(
          { _id: lessonId },
          {
            $set: {
              subject,
            },
          }
        );
      }
      if (category) {
        await Lesson.updateOne(
          { _id: lessonId },
          {
            $set: {
              category,
            },
          }
        );
      }
      if (data) {
        let lessonData = await Lesson.find({ _id: lessonId }).select({
          data: 1,
        });
        if (lessonData[0].data.includes(data)) {
          return res.status(400).json({ error: "Data url already exists" });
        }
        await lessonData[0].data.push(data);
        await Lesson.updateOne(
          { _id: lessonId },
          {
            $set: {
              data: lessonData[0].data,
            },
          }
        );
      }

      res.status(200).json({ message: "Updated Lesson successfully" });
    } else {
      res.status(400).json({ error: "Enter a valid lesson" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const isValidLessonCount = await Lesson.find({ _id: lessonId }).count(
      (err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return count;
      }
    );
    if (isValidLessonCount > 0) {
      await Lesson.findByIdAndDelete(lessonId);
      res.status(200).json({ message: "Successfully deleted lesson" });
    } else {
      res.status(400).json({ error: "Enter a valid id" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
