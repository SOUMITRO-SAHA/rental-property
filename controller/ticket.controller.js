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
exports.getAllTickets = async (req, res) => {
	try {
		const tickets = await db.ticket.findMany();

		if (!tickets) {
			return res.status(404).json({
				success: false,
				message: "No tickets found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Successfully fetched all tickets.",
			tickets,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while fetching tickets",
			error: error.message,
		});
	}
};

exports.getTicketById = async (req, res) => {
	const { ticketId } = req.params;
	try {
		const ticket = await db.ticket.findFirst({
			where: { ticketId: parseInt(ticketId) },
		});

		if (!ticket) {
			return res.status(404).json({
				success: false,
				message: "Ticket not found.",
			});
		}

		res.status(200).json({
			success: true,
			message: "Successfully fetched the ticket.",
			ticket,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while fetching the ticket",
			error: error.message,
		});
	}
};

// Get Tickets By Status:
exports.getAllTicketsByStatus = async () => {};

// Means, The ticket has been created but its status has not been updated for 1 week.
// Sorted the result in ascending order. Means, the ticket created before comes first
exports.getHighPriorityTickets = async (req, res) => {
	try {
		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		const highPriorityTickets = await db.ticket.findMany({
			where: {
				status: "OPEN",
				createdAt: {
					lt: oneWeekAgo,
				},
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		if (!highPriorityTickets || highPriorityTickets.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No high priority tickets found.",
			});
		}

		res.status(200).json({
			success: true,
			message: "Successfully fetched high priority tickets.",
			tickets: highPriorityTickets,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while fetching high priority tickets.",
			error: error.message,
		});
	}
};

// Only Admin & Manager can update the ticket status:
exports.updateTicketStatus = async (req, res) => {
	const { ticketId, newStatus } = req.body;

	try {
		const updatedTicket = await db.ticket.update({
			where: {
				ticketId: parseInt(ticketId),
			},
			data: {
				status: newStatus,
			},
		});

		if (!updatedTicket) {
			return res.status(404).json({
				success: false,
				message: "Failed to update ticket status.",
			});
		}

		res.status(200).json({
			success: true,
			message: "Ticket status updated successfully.",
			ticket: updatedTicket,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while updating ticket status.",
			error: error.message,
		});
	}
};
