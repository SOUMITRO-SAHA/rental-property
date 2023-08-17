const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointment.controller");

router.get("/all", appointmentController.getAllAppointments);
router.get("/:userId", appointmentController.getUserAppointment);
router.post("/add", appointmentController.createAppointment);

module.exports = router;
