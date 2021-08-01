const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");

const {
  validateRegisterInput,
  validateLoginInput,
  validateGroupCreation,
} = require("../../util/validators");

const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const Group = require("../../models/Group");
const GroupPosts = require("../../models/GroupPosts");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    async getGroups(_, { uid }) {
      try {
        const groups = await Group.find({
          groupId: uid,
        });
        return groups;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getGroupPosts(_, { groupId }) {
      try {
        const groupPosts = await GroupPosts.find({
          postsId: groupId,
        });
        return groupPosts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getGroupInfo(_, { groupId }) {
      try {
        const group = await Group.findById(groupId);
        return group;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getOwnerInfo(_, { groupOwnerId }) {
      try {
        const owner = await User.findById(groupOwnerId);
        return owner;
      } catch (err) {
        throw new Error(err);
      }
    },
    async searchGroups(_, { searchedText, uid }) {
      try {
        const groups = await Group.find({
          $or: [{ groupName: { $regex: `.*${searchedText}.*` } }],
          isPrivate: false,
          groupId: { $ne: uid },
        });
        return groups;
      } catch (err) {
        throw new Error(err);
      }
    },
    //create a query that takes uid as input & finds the user by uid.
    async getAllRelevantPosts(_, { uid }) {
      try {
        const user = await User.findById(uid);
        let relevantGroupsIds = [];
        //loop through user.followingGroupsLists and add id to relevantGroupsIds
        for (let i = 0; i < user.followingGroupsLists.length; i++) {
          relevantGroupsIds.push(user.followingGroupsLists[i]._id);
        }
        //find all the groups in Group model that have uid as groupId and add their ids to releventGroupsIds
        const groups = await Group.find({
          groupId: uid,
        });
        //loop through groups and add their ids to relevantGroupsIds
        for (let i = 0; i < groups.length; i++) {
          relevantGroupsIds.push(groups[i]._id);
        }

        let postsArray = [];
        //loop through relevantGroupsIds
        for (let i = 0; i < relevantGroupsIds.length; i++) {
          //for each id find all the posts in GroupPosts model that have the id as postsId and add them to postsArray
          const posts = await GroupPosts.find({
            postsId: relevantGroupsIds[i],
          });
          //add the posts to postsArray
          postsArray.push(posts);
        }
        return postsArray;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong crendetials";
        throw new UserInputError("Wrong crendetials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      {
        registerInput: {
          email,
          password,
          confirmPassword,
          username,
          userusername,
          bio,
        },
      }
    ) {
      const { valid, errors } = validateRegisterInput(
        email,
        password,
        confirmPassword,
        username,
        userusername
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const userbyemail = await User.findOne({ email });
      if (userbyemail) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      }
      const userbyuserusername = await User.findOne({ userusername });
      if (userbyuserusername) {
        throw new UserInputError("UserUsername is taken", {
          errors: {
            email: "This UserUsername is taken",
          },
        });
      }
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password,
        username,
        userusername,
        bio,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async createGroup(_, { groupName, groupUserName, isPrivate, uid }) {
      const user = await User.findById(uid);
      const { errors, valid } = validateGroupCreation(groupName, groupUserName);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const existingGroupUserName = await Group.find({
        groupUserName: groupUserName,
      });
      if (existingGroupUserName.length > 0) {
        throw new UserInputError("Group username is taken", {
          errors: {
            email: "This group username is taken",
          },
        });
      }
      const newGroup = new Group({
        groupId: user.id,
        groupName: groupName,
        groupUserName: groupUserName,
        isPrivate: isPrivate,
        createdAt: new Date().toISOString(),
      });
      await newGroup.save();
      return newGroup;
    },
    async createGroupPost(_, { uid, groupId, body }) {
      const user = await User.findById(uid);
      //create a newPost from GroupPosts
      const newPost = new GroupPosts({
        postsId: groupId,
        username: user.username,
        userusername: user.userusername,
        postBody: body,
        createdAt: new Date().toISOString(),
      });
      await newPost.save();
      // return newPost;
      const groupPosts = await GroupPosts.find({
        postsId: groupId,
      });
      return newPost;
    },
    async followGroup(_, { groupId, uid }) {
      const user = await User.findById(uid);
      const groupInUser = user.followingGroupsLists.find(
        (group) => group.id === groupId
      );

      //find group by groupId in Group model
      //if there is, then remove that object from array
      if (groupInUser) {
        user.followingGroupsLists.splice(
          user.followingGroupsLists.indexOf(groupInUser),
          1
        );
      } else {
        const getgroup = await Group.findById(groupId);
        user.followingGroupsLists.unshift({
          _id: getgroup.id,
          groupId: getgroup.groupId,
          groupName: getgroup.groupName,
          createdAt: new Date().toISOString(),
        });
      }
      await user.save();

      const group = await Group.findById(groupId);
      const userInGroup = group.groupFollowers.find(
        (follower) => follower.followersId === uid
      );

      if (userInGroup) {
        group.groupFollowers.splice(
          group.groupFollowers.indexOf(userInGroup),
          1
        );
      } else {
        group.groupFollowers.unshift({
          followersId: uid,
          createdAt: new Date().toISOString(),
        });
      }
      await group.save();
      return user;
    },
  },
};
