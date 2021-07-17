const { model, Schema } = require("mongoose");

const userGroupsSchema = new Schema({
  groupId: String, //same as user id > defines the owner
  groupName: String,
  groupUserName: String,
  isPrivate: Boolean,
  createdAt: String,
  groupFollowers: [
    {
      username: String,
      userusername: String,
      createdAt: String,
    },
  ],
});

module.exports = model("Group", userGroupsSchema);
