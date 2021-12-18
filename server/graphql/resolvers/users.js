const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
require("dotenv").config();

const { sendOtpMail } = require("../../util/mailer");
const {
  validateRegisterInput,
  validateOneTimeForm,
  validateProjectCreation,
} = require("../../util/validators");

// const { SECRET_KEY } = require("../../config");
const User = require("../models/User");
const Otp = require("../models/Otp");

function generateToken(email, id, username, userProfileImg) {
  return jwt.sign(
    {
      email,
      id,
      username,
      userProfileImg,
    },
    process.env.SECRET_KEY,
    { expiresIn: "8760h" }
  );
}

module.exports = {
  Query: {
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
      let token = generateToken(
        email,
        user?._id,
        user?.username ?? "",
        user?.userProfileImg ?? ""
      );
      const otp = new Otp({
        code: genratedOtp,
        token,
        email,
        username: user?.username ?? "",
        userProfileImg: user?.userProfileImg ?? "",
        createdAt: new Date().toISOString(),
      });
      await otp.save();

      // await sendOtpMail(genratedOtp, email);
      console.log("genratedOtp", genratedOtp);
      return {
        ...user._doc,
        id: user._id,
      };
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
    async oneTimeForm(_, { username, userProfileImg }, context) {
      const master = checkAuth(context);
      const { valid, errors } = validateOneTimeForm(username);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const userbyusername = await User.findOne({ username });
      if (userbyusername) {
        throw new UserInputError("Username is taken", {
          errors: {
            email: "This Username is taken",
          },
        });
      }
      //find a user with the same email in Users collection and save username and username to that user
      const user = await User.findOne({ email: master.email });
      if (user) {
        user.username = username;
        user.userProfileImg = userProfileImg;
      }
      await user.save();
      return user;
    },
    //create a mutation that takes accepts
    //projectIcon,projectName,projectTag,projectDescription,projectImages,projectVideoLink
    //as input and creates a new project
    async createProject(
      _,
      {
        projectIcon,
        projectName,
        projectTag,
        projectDescription,
        projectImages,
        projectVideoLink,
      },
      context
    ) {
      const master = checkAuth(context);
      const { valid, errors } = validateProjectCreation(
        projectIcon,
        projectName,
        projectTag,
        projectDescription,
        projectImages
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ email: master.email });
      if (!user) {
        throw new UserInputError("User not found", {
          errors: {
            email: "User not found",
          },
        });
      } else {
        const newProject = {
          projectIcon,
          projectName,
          projectTag,
          projectDescription,
          projectImages,
          projectVideoLink,
          createdAt: new Date().toISOString(),
        };
        //add newProject to user's listedProjects array
        user.listedProjects.push(newProject);
        await user.save();
        return user;
      }
    },
  },
};
