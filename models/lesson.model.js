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
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
      },
      message: "Enter a valid email",
    },
  },
  subject: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["primary", "jss", "sss"],
    required: true,
  },
  data: [
    {
      type: String, //this should contain link to the google sheet(s) for this subject
      required: true,
      default: null,
      validate: {
        validator: function (value) {
          return /(https?):\/\/([\w-]+(\.[\\w-]+)*\.([a-z]+))(([\w.,@?^=%&amp;:\/~+#()!-]*)([\w@?^=%&amp;\/~+#()!-]))?/gi.test(
            value
          );
        },
        message: "Enter a valid url please",
      },
    },
  ],
});

module.exports = mongoose.model("Lesson", lessonSchema);
