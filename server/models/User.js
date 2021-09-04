const { model, Schema } = require("mongoose");

const userDataSchema = new Schema({
  email: String,
  createdAt: String,

  username: String,
  userusername: String,

  followingGroupsLists: [
    {
      _id: String,
      groupId: String,
      createdAt: String,
      groupName: String,
      groupUserName: String,
    },
  ],
});

module.exports = model("User", userDataSchema);
