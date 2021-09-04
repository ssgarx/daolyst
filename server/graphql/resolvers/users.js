const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
const nodemailer = require("nodemailer");

async function sendOtpMail(otp) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>${otp}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
const {
  validateRegisterInput,
  validateGroupCreation,
  validateOneTimeForm,
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
    { expiresIn: "12h" }
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
      await sendOtpMail(genratedOtp);
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
