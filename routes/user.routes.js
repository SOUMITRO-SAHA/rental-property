const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

// Auth routes
router.post("/auth/sign-up", userController.signUp);
router.post("/auth/log-in", userController.login);
router.get("/auth/log-out", userController.logout);

// Admin routes
router.get("/admin/user/:userId", userController.getUserById);
router.get("/admin/users/all", userController.getAllUsers);
router.patch("/admin/user/:userId", userController.updateUserById);
router.patch("/admin/role/:userId", userController.updateRole);

module.exports = router;
