const { model, Schema } = require("mongoose");

const userDataSchema = new Schema({
  email: String,
  password: String,
  createdAt: String,

  username: String,
  userusername: String,
  bio: String,

  followingGroupsLists: [
    {
      _id: String,
      groupId: String,
      createdAt: String,
      groupName: String,
    },
  ],
});

module.exports = model("User", userDataSchema);
