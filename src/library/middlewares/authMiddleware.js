const { sendResponse } = require("../helpers/responseHelpers");
const logger = require("../helpers/loggerHelpers");
const config = require("../../config");
const jwtHelpers = require("../helpers/jwtHelpers");
const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require("http-status-codes");
const userServices = require("../../components/users/users.service");

exports.getAuthorize = async (req, res, next) => {
  // Check header or url parameters or post parameters for token
  const headerAuthorize =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization;

  // Check exist token
  if (!headerAuthorize) {
    logger.warn("Header Authorize Not Found");
    return res.status(UNAUTHORIZED).send(
      sendResponse({
        success: false,
        content: {},
        message: "Header Authorize Not Found"
      })
    );
  }
  // Get token
  const token = headerAuthorize.replace(config.tokenType, "").trim();

  // Decode token
  // Verifies secret and checks exp
  try {
    const decoded = await jwtHelpers.decode(token, config.jwtSecret);
    // Save decoded to request
    req.decoded = decoded;

    // Save user current to request
    const email = decoded.email;
    req.currentUser = await userServices.findUserByEmail(email);
    return next();
  } catch (err) {
    logger.error(`Token Decode Error ${err}`);
    return res.status(INTERNAL_SERVER_ERROR).send(
      sendResponse({
        success: false,
        content: err,
        message: "Token Decode Error"
      })
    );
  }
};
