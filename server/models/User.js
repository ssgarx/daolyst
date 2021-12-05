const { model, Schema } = require("mongoose");

const userDataSchema = new Schema({
  email: String,
  createdAt: String,
  username: String,
  userProfileImg: String,
});

module.exports = model("User", userDataSchema);
