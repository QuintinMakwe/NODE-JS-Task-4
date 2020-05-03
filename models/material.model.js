const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const materialSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  dataUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Material", materialSchema);
