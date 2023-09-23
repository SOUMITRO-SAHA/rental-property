const db = require("../config/db");

exports.getUserAppointment = async (req, res) => {
	console.log("Get User by Id");
	const { userId } = req.params;

	try {
		const user = await db.user.findFirst({
			where: {
				id: parseInt(userId),
			},
			include: {
				appointments: true,
			},
		});

		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Successfully find the User",
			appointment: user.appointments,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message:
				"Something went wrong while searching for the user, who booked an appointment",
			error: error.message,
		});
	}
};

exports.getAllAppointments = async (req, res) => {
	try {
		const appointments = await db.appointment.findMany();

		if (!appointments) {
			res.status(404).json({
				success: false,
				message: "No appointments available",
			});
		}

		res.status(200).json({
			success: true,
			appointments,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong, while fetching appointments from the DB",
			error: error.message,
		});
	}
};

exports.createAppointment = async (req, res) => {
	const { userId, startTime, endTime, description } = req.body;

	try {
		const appointment = await db.appointment.create({
			data: {
				userId,
				startTime,
				endTime,
				description,
			},
		});

		if (!appointment) {
			res.status(404).json({
				success: false,
				message: "Appointment not created successfully",
			});
		}

		res.status(200).json({
			success: true,
			message: "Appointment created successfully",
			appointment,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong, while creating the appointment",
			error: error.message,
		});
	}
};
