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
      groupId: String,
      createdAt: String,
    },
  ],
});

module.exports = model("User", userDataSchema);
