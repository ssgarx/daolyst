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
      uplysts: [Object],
      views: String,
      creatorId: String,
      creatorName: String,
      creatorUsername: String,
      creatorEmail: String,
      creatorProfileImg: String,
    },
  ],
});

module.exports = model("User", userDataSchema);
