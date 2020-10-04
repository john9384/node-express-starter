const express = require("express");
const router = express.Router();
const { catchErrors } = require("../../library/helpers/errorHandlers");
const { getAuthorize } = require("../../library/middlewares/authMiddleware");
const userController = require("./users.controller");

// Unprotected User routes
router.get("/", (req, res) => res.json({ msg: process.env.APP_NAME }));
router.post("/authenticate", catchErrors(userController.postAuthenticate));
router.post("/sign-up", catchErrors(userController.postSignUp));
router.get(
  "/get-user-current",
  getAuthorize,
  catchErrors(userController.getCurrentUser)
);

module.exports = router;
