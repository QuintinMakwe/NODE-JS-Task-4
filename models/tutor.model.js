const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Subject = require("./subject.model");

const tutorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
      },
      message: "Enter a valid email",
    },
  },
  subjects: [
    {
      type: String,
      default: null,
    },
  ],
  admin: {
    type: Boolean,
    required: true,
  },
});


module.exports = mongoose.model("Tutor", tutorSchema);
