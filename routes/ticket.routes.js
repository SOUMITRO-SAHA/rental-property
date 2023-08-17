const express = require("express");
const router = express.Router();
const ticketController = require("../controller/ticket.controller");

router.post("/create", ticketController.createTicket);

module.exports = router;
