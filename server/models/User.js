const { model, Schema } = require("mongoose");

const userDataSchema = new Schema({
  email: String,
  createdAt: String,
  username: String,
  userProfileImg: String,

  listedProjects: [
    {
      _id: String,
      projectIcon: String,
      projectName: String,
      projectTag: String,
      projectDescription: String,
      projectImages: [String],
      projectVideoLink: String,
      createdAt: String,
    },
  ],
});

module.exports = model("User", userDataSchema);
