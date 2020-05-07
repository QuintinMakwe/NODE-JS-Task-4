const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
      type: Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },
  ],
  admin: {
    type: Boolean,
    required: true,
  },
});

tutorSchema.pre("save", function (next) {
  console.log(this.subjects.length);
  console.log("these is the name", this.name);
  //perform subject validation here

  next();
});

module.exports = mongoose.model("Tutor", tutorSchema);
