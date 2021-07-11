const { model, Schema } = require("mongoose");

const userDataSchema = new Schema({
  email: String,
  password: String,
  createdAt: String,

  username: String,
  userusername: String,
  bio: String,
  userOwnedGroupIds: [
    {
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
      groupPosts: [
        {
          username: String,
          userusername: String,
          postBody: String,
          createdAt: String,
          postLikes: [
            {
              username: String,
              userusername: String,
              createdAt: String,
            },
          ],
          postViews: [
            {
              username: String,
              userusername: String,
              createdAt: String,
            },
          ],
        },
      ],
    },
  ],
  userFollowingGroupIds: [
    {
      groupName: String,
      groupUserName: String,
    },
  ],
});

module.exports = model("User", userDataSchema);
