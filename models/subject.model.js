const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["primarry", "jss", "sss"],
    required: true,
  },
  material: [
    {
      type: Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Subject", subjectSchema);
