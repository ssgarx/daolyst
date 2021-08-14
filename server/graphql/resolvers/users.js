const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");

const {
  validateRegisterInput,
  validateGroupCreation,
  validateOtpInput,
} = require("../../util/validators");

const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const Group = require("../../models/Group");
const GroupPosts = require("../../models/GroupPosts");
const Otp = require("../../models/Otp");

function generateToken(email, id) {
  return jwt.sign(
    {
      email,
      id,
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
    async getAllRelevantPosts(_, { uid }) {
      try {
        const user = await User.findById(uid);
        let relevantGroupsIds = [];
        for (let i = 0; i < user.followingGroupsLists.length; i++) {
          relevantGroupsIds.push(user.followingGroupsLists[i]._id);
        }
        const groups = await Group.find({
          groupId: uid,
        });
        for (let i = 0; i < groups.length; i++) {
          relevantGroupsIds.push(groups[i]._id);
        }

        let postsArray = [];
        for (let i = 0; i < relevantGroupsIds.length; i++) {
          const posts = await GroupPosts.find({
            postsId: relevantGroupsIds[i],
          });
          postsArray.push(posts);
        }
        return postsArray;
      } catch (err) {
        throw new Error(err);
      }
    },
    //create a new query named checkIfNewUser that takes email as input.
    //it should find a user with the same email in Users collection and return true if it exists
    //otherwise return false
    async checkIfNewUser(_, { email }) {
      try {
        const user = await User.findOne({
          email,
        });
        if (user.username) {
          return false;
        }
        return true;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async verifyOtp(_, { code }) {
      let errors = {};
      let otp;
      if (!code) {
        errors.code = "Please enter the otp";
      } else {
        const otptmp = await Otp.findOne({ code });
        console.log("otptmp", otptmp);
        if (!otptmp) {
          errors.code = "Otp no match";
        } else {
          otp = otptmp;
        }
      }
      //check if errors is empty
      console.log("Object.keys(errors)", errors);
      console.log("Object.keys(errors).length", Object.keys(errors).length);
      if (Object.keys(errors).length !== 0) {
        throw new UserInputError("Errors", { errors });
      }
      return { ...otp._doc };
    },

    async register(_, { email }) {
      const { valid, errors } = validateRegisterInput(email);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const newUser = new User({
        email,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      let genratedOtp = Math.floor(100000 + Math.random() * 900000);
      let token = generateToken(email, newUser._id);
      const otp = new Otp({
        code: genratedOtp,
        token,
        email,
        createdAt: new Date().toISOString(),
      });
      await otp.save();

      return {
        ...res._doc,
        id: res._id,
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
