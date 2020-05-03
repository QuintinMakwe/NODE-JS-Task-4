const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
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
  category: {
    type: String,
    enum: ["primary", "jss", "sss"],
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
