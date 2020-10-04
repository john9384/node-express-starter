const {
  ACCEPTED,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = require("http-status-codes");
const userService = require("./users.service");
const { sendResponse } = require("../../library/helpers/responseHelpers");

exports.postSignUp = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;

    const userData = {
      name,
      email,
      age,
      password
    };
    const user = await userService.signUp(userData);

    return res.status(CREATED).send(
      sendResponse({
        success: true,
        content: user,
        message: "User Registerd"
      })
    );
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).send(
      sendResponse({
        success: false,
        content: err,
        message: err.message
      })
    );
  }
};
exports.postAuthenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    let token = await userService.authenticate(email, password);

    return res.status(ACCEPTED).send(
      sendResponse({
        success: true,
        content: token,
        message: "User Logged in"
      })
    );
  } catch (err) {
    return res.status(NOT_FOUND).send(
      sendResponse({
        success: false,
        content: err,
        message: err.message
      })
    );
  }
};
exports.getCurrentUser = async (req, res) => {
  try {
    const email = req.decoded.email;
    const user = await userService.findUserByEmail(email);

    return res.status(ACCEPTED).send(
      sendResponse({
        success: true,
        content: user,
        message: "User Registerd"
      })
    );
  } catch (err) {
    return res.status(NOT_FOUND).send(
      sendResponse({
        success: false,
        content: err,
        message: err.message
      })
    );
  }
};
