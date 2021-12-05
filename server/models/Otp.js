const { model, Schema } = require("mongoose");

const userOtpSchema = new Schema({
  code: String,
  token: String,
  email: String,
  username: String,
  createdAt: String,
});

module.exports = model("Otp", userOtpSchema);
