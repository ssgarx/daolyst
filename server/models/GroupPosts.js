const { model, Schema } = require("mongoose");

const groupPostsSchema = new Schema({
  postsId: String, //same as group id > defines the owner group
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
});

module.exports = model("GroupPosts", groupPostsSchema);
