// module.exports.validateRegisterInput = (
//   email,
//   password,
//   confirmPassword,
//   username,
//   userusername
// ) => {
//   const errors = {};

//   if (email.trim() === "") {
//     errors.email = "Email must not be empty";
//   } else {
//     const regEx =
//       /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
//     if (!email.match(regEx)) {
//       errors.email = "Email must be a valid email address";
//     }
//   }
//   if (username.trim() === "") {
//     errors.username = "Username must not be empty";
//   }
//   if (userusername.trim() === "") {
//     errors.userusername = "Userusername must not be empty";
//   }

//   if (password === "") {
//     errors.password = "Password must not empty";
//   } else if (password !== confirmPassword) {
//     errors.confirmPassword = "Passwords must match";
//   }

//   return {
//     errors,
//     valid: Object.keys(errors).length < 1,
//   };
// };

// module.exports.validateLoginInput = (email, password) => {
//   const errors = {};
//   if (email.trim() === "") {
//     errors.email = "Email must not be empty";
//   }
//   if (password.trim() === "") {
//     errors.password = "Password must not be empty";
//   }

//   return {
//     errors,
//     valid: Object.keys(errors).length < 1,
//   };
// };

module.exports.validateOneTimeForm = (username, userusername) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (userusername.trim() === "") {
    errors.userusername = "Userusername must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateRegisterInput = (email) => {
  const errors = {};

  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const Otp = require("../models/Otp");
module.exports.validateOtpInput = async (code) => {
  const errors = {};
  let otp;
  if (code.trim() === "" || !code) {
    errors.code = "Please enter a valid Otp";
  } else {
    const otptmp = await Otp.findOne({ code });
    if (!otptmp) {
      errors.code = "Otp did'nt match";
    } else {
      otp = otptmp;
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
    otp,
  };
};

module.exports.validateGroupCreation = (groupName, groupUserName) => {
  const errors = {};
  if (groupName.trim() === "") {
    errors.groupName = "GroupName must not be empty";
  }
  if (groupUserName.trim() === "") {
    errors.groupUserName = "GroupUserName must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
