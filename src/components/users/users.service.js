const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const User = require("./users.model");
const logger = require("../../library/helpers/loggerHelpers");
const jwtHelpers = require("../../library/helpers/jwtHelpers");
const config = require("../../config/");

exports.signUp = async data => {
  // Check if user exists
  const reg_user = await User.findOne({ email: data.email });

  if (reg_user) {
    logger.warn("User Exists. Email already Registered");
    throw new Error("User Exists");
  }
  // If User email is not registered
  // Save the user
  let avatar = await gravatar.url(data.email, {
    s: "200", // Size
    r: "pg", // Rating
    d: "mm" // Default
  });
  const user = new User({
    name: data.name,
    email: data.email,
    age: data.age,
    password: data.password,
    avatar
  });
  await user.save();
  return user;
};

exports.authenticate = async (email, password) => {
  const user = await User.findOne({ email });

  // Check if User Exists
  if (!user) {
    logger.warn("Authentication failed. User not found.");
    throw new Error("Authentication failed. User not found.");
  }

  // Compare hashed password
  const isValidPassword = await bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    logger.warn("Authentication failed. Wrong password.");
    throw new Error("Authentication failed. Wrong password.");
  }

  let token = jwtHelpers.encode({ email }, config.jwtSecret, {
    expiresIn: "1h"
  });
  logger.info(`Auth token created: ${token}`);

  return { token: `${config.tokenType} ${token}` };
};

exports.findUserByEmail = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    logger.warn("User not found.");
    throw new Error("User not found.");
  }
  return user;
};
