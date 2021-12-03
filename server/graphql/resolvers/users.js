const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
require("dotenv").config();

const { sendOtpMail } = require("../../util/mailer");
const { validateRegisterInput } = require("../../util/validators");

// const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
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
      let token = generateToken(email, user._id);
      const otp = new Otp({
        code: genratedOtp,
        token,
        email,
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
  },
};
