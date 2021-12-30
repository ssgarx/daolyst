module.exports.validateGroupRenameForm = (groupName, groupUserName) => {
  const errors = {};
  if (groupName.trim() === "") {
    errors.username = "Folder name must not be empty";
  }
  if (groupUserName.trim() === "") {
    errors.userusername = "Group username must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
module.exports.validateOneTimeForm = (username, userProfileImg = null) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (!userProfileImg) {
    errors.username = "Add a profile image";
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

const Otp = require("../graphql/models/Otp");
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

//create a function that accepts projectIcon,projectName,projectTag,projectDescription,projectImages,projectVideoLink and make sure that all the fields are filled
module.exports.validateProjectCreation = (
  projectIcon,
  projectName,
  projectTag,
  projectDescription,
  projectImages
) => {
  const errors = {};
  if (projectIcon.trim() === "") {
    errors.projectIcon = "Add icon for your DAO";
  }
  if (projectName.trim() === "") {
    errors.projectName = "Add name for your DAO";
  }
  if (projectTag.trim() === "") {
    errors.projectTag = "Add a tagline";
  }
  if (projectDescription.trim() === "") {
    errors.projectDescription = "Description can't be empty";
  }
  if (projectImages.length < 1) {
    errors.projectImages = "Add atleast one image";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
