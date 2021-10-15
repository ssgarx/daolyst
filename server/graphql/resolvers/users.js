const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
const linkPreviewGenerator = require("link-preview-generator");
require("dotenv").config();

async function generateLinkPreview(postedLink) {
  const previewData = await linkPreviewGenerator(postedLink);
  return previewData;
}

const { sendOtpMail } = require("../../util/mailer");
const {
  validateRegisterInput,
  validateGroupCreation,
  validateOneTimeForm,
  validateGroupRenameForm,
} = require("../../util/validators");

const { previewGenerator } = require("../../util/linkPreviewGenerator");

// const { SECRET_KEY } = require("../../config");
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
    process.env.SECRET_KEY,
    { expiresIn: "8760h" }
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
        for (let i = 0; i < user?.followingGroupsLists?.length; i++) {
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
    //create a mutation named delete group that takes groupId as input, verifies the user is the owner of the group and deletes the group.
    async deleteGroup(_, { groupId, userId }) {
      try {
        const group = await Group.findById(groupId);
        if (group.groupId.toString() === userId) {
          await Group.findByIdAndDelete(groupId);
          return true;
        }
        return false;
      } catch (err) {
        throw new Error(err);
      }
    },

    //create a mutataion that accepts groupId and postId as input and deletes the post from the groupPosts collection
    async deletePost(_, { id }) {
      try {
        //find the post by id and delete it
        //find post by id
        const post = await GroupPosts.findById(id);
        if (post) {
          await GroupPosts.findByIdAndDelete(id);
          return true;
        }
        return false;
      } catch (err) {
        throw new Error(err);
      }
    },

    //create a new mutation named changeGroupInfo that takes groupId, groupName, groupUserName, isPrivate  as input,
    //then it should update the group with the given groupId and return the updated group
    async changeGroupInfo(_, { groupId, groupName, groupUserName, isPrivate }) {
      //make sure the fields are not empty
      const { valid, errors } = validateGroupRenameForm(
        groupName,
        groupUserName
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //when fields are not empty.
      try {
        //find the group with the given groupId
        const group = await Group.findById(groupId);
        //if groupName and groupUserName are same as previous values, then return the group
        if (
          group.groupName === groupName &&
          group.groupUserName === groupUserName &&
          group.isPrivate === isPrivate
        ) {
          return group;
        }
        //if groupName is different from previous value, then update the groupName
        if (group.groupName !== groupName) {
          //update the groupName
          await Group.findByIdAndUpdate(groupId, {
            groupName,
          });
        }
        //if groupUserName is different from previous value, then update the groupUserName
        if (group.groupUserName !== groupUserName) {
          //check if the groupUserName is already taken
          const groupUserNameExists = await Group.findOne({
            groupUserName,
          });
          if (groupUserNameExists) {
            throw new UserInputError("UserUsername is taken", {
              errors: {
                email: "This UserUsername is taken",
              },
            });
          } else {
            //update the groupUserName
            await Group.findByIdAndUpdate(groupId, {
              groupUserName,
            });
          }
        }
        //if isPrivate is different from previous value, then update the isPrivate

        if (group.isPrivate !== isPrivate) {
          await Group.findByIdAndUpdate(groupId, {
            isPrivate,
          });
          //update the isPrivate
        }
        //return the updated group
        return await Group.findById(groupId);
      } catch (err) {
        throw new Error(err);
      }
    },

    //create a new mutation named changeUserInfo that takes email, username and userusername as input,
    //then it should find a user with the same email in Users collection and update the username and userusername.
    //return true if it is successful
    async changeUserInfo(_, { email, username, userusername }) {
      //make sure the fields are not empty
      const { valid, errors } = validateOneTimeForm(username, userusername);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //when fields are not empty.
      try {
        const user = await User.findOne({
          email,
        });
        //if both username and userusername are same as previous.
        if (user.username === username && user.userusername === userusername) {
          return user;
        }
        //if username us diffrent than previous.
        if (user.username !== username) {
          await User.updateOne(
            {
              email,
            },
            {
              $set: {
                username,
              },
            }
          );
        }
        //if userusername is diffrent than previous.
        if (user.userusername !== userusername) {
          //check if userusername is already taken.
          const userbyuserusername = await User.findOne({ userusername });
          if (userbyuserusername) {
            //if userusername is already taken.
            throw new UserInputError("UserUsername is taken", {
              errors: {
                email: "This UserUsername is taken",
              },
            });
          } else {
            //if userusername is not taken.
            await User.updateOne(
              {
                email,
              },
              {
                $set: {
                  userusername,
                },
              }
            );
          }
        }
        const userUpdated = await User.findOne({
          email,
        });
        return userUpdated;
      } catch (err) {
        throw new Error(err);
      }
    },
    async oneTimeForm(_, { username, userusername }, context) {
      const master = checkAuth(context);
      const { valid, errors } = validateOneTimeForm(username, userusername);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const userbyuserusername = await User.findOne({ userusername });
      if (userbyuserusername) {
        throw new UserInputError("UserUsername is taken", {
          errors: {
            email: "This UserUsername is taken",
          },
        });
      }
      //find a user with the same email in Users collection and save username and userusername to that user
      const user = await User.findOne({ email: master.email });
      if (user) {
        user.username = username;
        user.userusername = userusername;
      }
      await user.save();
      return user;
    },
    async deleteOtps(_, { email }) {
      try {
        const otps = await Otp.find({
          email,
        });
        for (let i = 0; i < otps.length; i++) {
          await Otp.deleteOne({
            _id: otps[i]._id,
          });
        }
        return true;
      } catch (err) {
        throw new Error(err);
      }
    },
    async verifyOtp(_, { code }) {
      let errors = {};
      let otp;
      if (!code) {
        errors.code = "Please enter the otp";
      } else {
        const otptmp = await Otp.findOne({ code });
        if (!otptmp) {
          errors.code = "Otp no match";
        } else {
          otp = otptmp;
        }
      }
      //check if errors is empty
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

      //check if user with the same email already exists.
      let user = await User.findOne({ email });
      if (!user) {
        const newUser = new User({
          email,
          createdAt: new Date().toISOString(),
        });
        user = await newUser.save();
      }

      let genratedOtp = Math.floor(100000 + Math.random() * 900000);
      let token = generateToken(email, user._id);
      const otp = new Otp({
        code: genratedOtp,
        token,
        email,
        createdAt: new Date().toISOString(),
      });
      await otp.save();
      await sendOtpMail(genratedOtp, email);
      return {
        ...user._doc,
        id: user._id,
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
      // const { title, description, domain, img } = await generateLinkPreview(
      //   body
      // );
      const { title, description, domain, img } = await previewGenerator(body);
      //desctructuring the previewData

      //create a newPost from GroupPosts
      const newPost = new GroupPosts({
        postsId: groupId,
        username: user.username,
        userusername: user.userusername,
        postBody: body,
        createdAt: new Date().toISOString(),

        postTitle: title,
        postDescription: description,
        postDomain: domain,
        postImage: img,
      });
      await newPost.save();
      // return newPost;
      const groupPosts = await GroupPosts.find({
        postsId: groupId,
      });
      //add previewData as additional property to groupPosts
      return newPost;
    },
    async followGroup(_, { groupId, uid }) {
      const user = await User.findById(uid);
      const groupInUser = user?.followingGroupsLists?.find(
        (group) => group.id === groupId
      );

      //find group by groupId in Group model
      //if there is, then remove that object from array
      if (groupInUser) {
        user?.followingGroupsLists?.splice(
          user.followingGroupsLists.indexOf(groupInUser),
          1
        );
      } else {
        const getgroup = await Group.findById(groupId);
        user?.followingGroupsLists?.unshift({
          _id: getgroup.id,
          groupId: getgroup.groupId,
          groupName: getgroup.groupName,
          groupUserName: getgroup.groupUserName,
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
