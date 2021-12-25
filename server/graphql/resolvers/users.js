const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
const uuid = require("uuid");
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

    //create a paginated query that returns listedProjects of all the users in the database
    async getLystedDaos(_, { page, limit }) {
      try {
        //return all users in the database
        const users = await User.find({})
          .sort({ createdAt: -1 })
          .skip(page * limit)
          .limit(limit);
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    //creqt a mutation that takes accepts email as input and returns all projects
    async getAllProjects(_, { email }, context) {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new UserInputError("User not found", {
          errors: {
            email: "User not found",
          },
        });
      } else {
        return user;
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
          _id: uuid.v4(),
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
    //create a mutation that takes accepts email and projectId as input
    async upLystProject(
      _,
      { upLysterEmail, projectOwnerEmail, projectId },
      context
    ) {
      try {
        //find user with the email using upLysterEmail
        const uplyster = await User.findOne({ email: upLysterEmail });
        const projectOwner = await User.findOne({ email: projectOwnerEmail });
        let uplystedProject = null;
        for (let i = 0; i < projectOwner.listedProjects.length; i++) {
          if (projectOwner.listedProjects[i]._id == projectId) {
            uplystedProject = projectOwner.listedProjects[i];
          }
        }
        console.log("uplystedProject", uplystedProject.uplysts.length);
        let uplysted = false;
        for (let i = 0; i < uplystedProject.uplysts.length; i++) {
          if (uplystedProject.uplysts[i].email == upLysterEmail) {
            uplysted = true;
            break;
          }
        }
        console.log("uplysted", uplysted);
        if (uplysted) {
          console.log("REMMOVING");
          let tmp = uplystedProject.uplysts.filter(
            (uplyst) => uplyst.email !== upLysterEmail
          );
          uplystedProject.uplysts = [...tmp];
        } else {
          uplystedProject.uplysts = [...uplystedProject.uplysts, uplyster];
        }
        let tmp = projectOwner.listedProjects.filter(
          (project) => project._id !== uplystedProject._id
        );
        projectOwner.listedProjects = [...tmp, uplystedProject];
        await projectOwner.save();
        return true;
      } catch (err) {
        console.log("err", err);
        return false;
      }
    },
    //create a mutation that takes accepts projectId as input and deletes the project
    async deleteProject(_, { projectId }, context) {
      const master = checkAuth(context);
      const user = await User.findOne({ email: master.email });
      if (!user) {
        throw new UserInputError("User not found", {
          errors: {
            email: "User not found",
          },
        });
      } else {
        let tmp = user.listedProjects.filter(
          (project) => project._id !== projectId
        );
        user.listedProjects = [...tmp];
        await user.save();
        return true;
      }
    },
  },
};
