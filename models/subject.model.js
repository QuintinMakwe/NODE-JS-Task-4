const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: {
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

subjectSchema.pre("updateOne", async function (next) {
  if (this._update.$set.category) {
    const validCategory = ["primary", "sss", "jss"];
    if (validCategory.includes(this._update.$set.category)) {
      next();
    } else {
      throw new Error("Enter a valid category please");
    }
  }
  if (this._update.$set.data) {
    this._update.$set.data.forEach((data) => {
      const testUrl = /(https?):\/\/([\w-]+(\.[\\w-]+)*\.([a-z]+))(([\w.,@?^=%&amp;:\/~+#()!-]*)([\w@?^=%&amp;\/~+#()!-]))?/gi.test(
        data
      );
      if (testUrl == false) {
        throw new Error(`Enter a valid url, ${data} is not a valid url`);
      }
    });
  }
  next();
});

module.exports = mongoose.model("Subject", subjectSchema);
