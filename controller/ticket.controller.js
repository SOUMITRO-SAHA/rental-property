const db = require("../config/db");

// User, Tanent will gonna create a ticket:
exports.createTicket = async (req, res) => {
	const { userId, subject, description } = req.body;
	try {
		// First check the User already created any tickets and the status of that ticket must be resolved:
		const alreadyUnsolvedTickets = await db.ticket.findFirst({
			where: {
				userId: parseInt(userId),
				status: "OPEN",
			},
		});

		if (alreadyUnsolvedTickets) {
			return res.status(406).json({
				success: false,
				message: "A ticket has already been open in your account.",
			});
		}

		// Then, Create a new ticket
		const newTicket = await db.ticket.create({
			data: {
				userId: parseInt(userId),
				subject,
				description,
			},
		});

		if (!newTicket) {
			return res.status(404).json({
				success: false,
				message:
					"Couldn't create new ticket, Something went wrong in the database",
			});
		}

		res.status(200).json({
			success: true,
			menubar: "Successfully created new ticket",
			ticket: newTicket,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while creating tickets",
			error: error.message,
		});
	}
};

// For Admin Panel:
exports.getAllTickets = async () => {};
exports.getTicketById = async () => {};

// Means, The ticket has been created but its status has not been updated for 1 week.
// Sorted the result in ascending order. Means, the ticket created before comes first
exports.getHighPriorityTickets = async () => {};

// Only Admin & Manager can update the ticket status:
exports.updateTicketStatus = async () => {};
