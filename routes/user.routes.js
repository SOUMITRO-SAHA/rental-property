const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { authoriseAdmin } = require("../middlewares/auth.middleware");

// Auth routes
router.post("/auth/sign-up", userController.signUp);
router.post("/auth/log-in", userController.login);
router.get("/auth/log-out", userController.logout);

// Admin routes
router.get("/admin/user/:userId", userController.getUserById);
router.get("/admin/users/all", userController.getAllUsers);
router.patch(
	"/admin/user/:userId",
	authoriseAdmin,
	userController.updateUserById
);
router.patch("/admin/role/:userId", authoriseAdmin, userController.updateRole);

module.exports = router;
