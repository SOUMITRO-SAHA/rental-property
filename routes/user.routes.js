const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

router.post("/sign-up", userController.signUp);
router.post("/log-in", userController.login);

module.exports = router;
