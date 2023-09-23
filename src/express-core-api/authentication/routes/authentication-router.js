const express = require("express");
const {
  auth,
  createAuth,
} = require("../controllers/authentication-controller");
const authRouter = express.Router();

authRouter.post("/auth", auth);
authRouter.post("/create-auth", createAuth);

module.exports = authRouter;
