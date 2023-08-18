const express = require("express");
const router = express.Router();
const ticketController = require("../controller/ticket.controller");
const { isPermitted } = require("../middlewares/auth.middleware");

// This route will be accessible to all the users & Tenents
router.post("/create", ticketController.createTicket);

// This should only available to the People with permission
// Like ADMIN AND MANAGER.
router.get("/all", isPermitted, ticketController.getAllTickets);
router.get("/:ticketId", isPermitted, ticketController.getTicketById);
router.get(
	"/priority/high",
	isPermitted,
	ticketController.getHighPriorityTickets
);
router.patch("/update", isPermitted, ticketController.updateTicketStatus);

module.exports = router;
