const { validationResult } = require("express-validator");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const AuthOptions = require("../utils/authOptions");
const { AuthRoles } = require("../utils/AuthRoles");

// ================= [Authentication] ================== //

exports.signUp = async (req, res) => {
	console.log("Signing up...");
	try {
		const errors = validationResult(req);

		// If there is error then return Error
		if (!errors.isEmpty()) {
			res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const { name, email, password } = req.body;
		if (!(name && email && password)) {
			res.status(406).json({
				success: false,
				message: "All fields are required",
			});
		}
		// Before Creating a new User first check whether the user already exists or not:
		const existingUser = await db.user.findFirst({
			where: { email: email },
		});

		if (existingUser) {
			return res.status(404).json({
				success: false,
				message: "User already exists",
			});
		}

		// Before Storing the Password make it Encrypted:
		const encryptedPassword = await bcrypt.hash(password, 10);

		const user = await db.user.create({
			data: {
				name: name,
				email: email,
				password: encryptedPassword,
			},
		});

		// Create a token to sent the user
		const token = jwt.sign(
			{
				id: user.id,
				email,
			},
			config.JWT_SECRET,
			{
				expiresIn: config.JWT_EXPIRY,
			}
		);

		// Now making the password undefined
		user.token = token;
		user.password = undefined;

		// Now Sending a cookie to the client to store the token and Sending a response to the client
		res.status(200).cookie("token", token, AuthOptions).json({
			success: true,
			message: "Successfully Signed Up",
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while creating a new user",
			errors: error.message,
		});
	}
};

exports.login = async (req, res) => {
	console.log("Login...");
	try {
		const errors = validationResult(req);

		// If there is error then return Error
		if (!errors.isEmpty()) {
			res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const { email, password } = req.body;
		if (!(email && password)) {
			res.status(406).json({
				success: false,
				message: "All fields are required",
			});
		}

		// Now, Check whether the user exists or not
		const user = await db.user.findFirst({
			where: {
				email: email,
			},
		});

		// Check whether the user exists
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User does not exist",
			});
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		// Now, check the password:
		if (user && passwordMatch) {
			// Then Successfully Login,
			const token = jwt.sign({ id: user.id, email }, config.JWT_SECRET, {
				expiresIn: config.JWT_EXPIRY,
			});

			// Making the Password undefined
			user.token = token;
			user.password = undefined;

			// Sending Response to the client
			res.status(200).cookie("token", token, AuthOptions).json({
				success: true,
				message: "Successfully logged in",
				user,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while Login...",
			error: error.message,
		});
	}
};

exports.logout = async (req, res) => {
	console.log("Log Out");
	try {
		res.clearCookie("token", AuthOptions);

		res.status(200).json({
			success: true,
			message: "Successfully logged out",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while logging out",
			error: error.message,
		});
	}
};

// Only Admins Can do this:
exports.updateRole = async (req, res) => {
	console.log("Update Role");
	const { userId } = req.params;
	const { role } = req.body;
	try {
		// First Checking for Valid Auth Roles:
		if (!Object.values(AuthRoles).includes(role)) {
			res.status(400).json({
				success: true,
				message: "Invalid role",
			});
		}
		// Now, Update the role fo the User:
		const user = await db.user.update({
			where: { id: parseInt(userId) },
			data: { role: role },
		});
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}
		res.status(200).json({
			success: true,
			message: "User updated successfully",
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while updating the user role",
			error: error.message,
		});
	}
};

// ================= [CRUD on User] ================== //
exports.updateUserById = async (req, res) => {
	console.log("Updating user by ID...");
	try {
		const { userId } = req.params;
		const updatedUserData = req.body;

		// Check if userId is valid and required fields are present in the request
		if (!userId) {
			return res.status(400).json({
				success: false,
				message: "Invalid or incomplete data provided.",
			});
		}

		// Update the user in the database
		const updatedUser = await db.user.update({
			where: { id: Number(userId) },
			data: updatedUserData,
		});

		// Response to the Client
		res.status(200).json({
			success: true,
			message: "User updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while updating the user",
			error: error.message,
		});
	}
};

exports.getUserById = async (req, res) => {
	console.log("Getting user by ID...");
	try {
		const { userId } = req.params;

		// Check if userId is valid
		if (!userId) {
			return res.status(400).json({
				success: false,
				message: "Invalid user ID provided",
			});
		}
		console.log("Id", userId);

		// Get the user from the database
		const user = await db.user.findFirst({
			where: {
				id: Number(userId),
			},
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while fetching the user",
			error: error.message,
		});
	}
};

exports.getAllUsers = async (req, res) => {
	console.log("Getting all users...");
	try {
		const users = await db.user.findMany();

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while fetching users",
			error: error.message,
		});
	}
};
