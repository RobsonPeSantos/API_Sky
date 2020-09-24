const express = require("express");
const router = express.Router();
const auth = require("../Auth/auth");

const userController = require("../Controller/userController");

router.post("/sign-up", userController.signUp);

router.post("/sign-in", userController.signIn);

router.get("/find-user", auth, userController.findUser);

module.exports = router;
