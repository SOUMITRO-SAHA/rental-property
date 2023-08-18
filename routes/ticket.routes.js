const express = require("express");
const router = express.Router();
const ticketController = require("../controller/ticket.controller");
const { isPermitted } = require("../middlewares/auth.middleware");

// This route will be accessible to all the users & Tenents
router.post("/create", ticketController.createTicket);

// This should only available to the People with permission
// Like ADMIN AND MANAGER.
router.post("/all", isPermitted, ticketController.getAllTickets);
router.post("/:ticketId", isPermitted, ticketController.getTicketById);
router.post(
	"/priority/high",
	isPermitted,
	ticketController.getHighPriorityTickets
);
router.post("/update", isPermitted, ticketController.updateTicketStatus);

module.exports = router;
