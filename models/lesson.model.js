const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  timeStart: {
    type: Date,
    required: true,
  },
  timeEnd: {
    type: Date,
    required: true,
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
  material: {
    type: Schema.Types.ObjectId,
    ref: "Material",
    required: true,
  },
});

module.exports = mongoose.model("Lesson", lessonSchema);
