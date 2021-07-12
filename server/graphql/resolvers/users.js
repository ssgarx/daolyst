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
const { exists } = require("../../models/User");

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
      console.log("uid", uid);
      console.log("isPrivate", isPrivate);
      console.log("groupUserName", groupUserName);
      console.log("groupName", groupName);
      const user = await User.findById(uid);
      console.log("user", user);
      const { errors, valid } = validateGroupCreation(groupName, groupUserName);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const existingGroupUserName = await User.find({
        "userOwnedGroupIds.groupUserName": groupUserName,
      });
      console.log("existingGroupUserName", existingGroupUserName.length);
      if (existingGroupUserName.length > 0) {
        throw new UserInputError("Group username is taken", {
          errors: {
            email: "This group username is taken",
          },
        });
      }
      const existingUser = await User.findById(user.id);
      console.log("existingUser", existingUser);
      if (existingUser) {
        existingUser.userOwnedGroupIds.unshift({
          owneruserusername: user.username,
          groupName: groupName,
          groupUserName: groupUserName,
          isPrivate: isPrivate,
          createdAt: new Date().toISOString(),
        });
        await existingUser.save();
        return existingUser;
      } else throw new UserInputError("ExistingUser not found");
    },
  },
};
