const { validationResult } = require("express-validator");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const AuthOptions = require("../utils/authOptions");

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

		const { name, email, password, role } = req.body;
		if (!(name && email && password && role)) {
			res.status(406).json({
				success: false,
				message: "All fields are required",
			});
		}

		// Before Storing the Password make it Encrypted:
		const encryptedPassword = await bcrypt.hash(password, 10);

		const user = await db.user.create({
			data: {
				name: name,
				email: email,
				password: encryptedPassword,
				role: role,
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
			res.status(404).json({
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

// ================= [CRUD on User] ================== //
exports.updateUserById = async (req, res) => {};
exports.getUserById = async (req, res) => {};
exports.getAllUsers = async (req, res) => {};
