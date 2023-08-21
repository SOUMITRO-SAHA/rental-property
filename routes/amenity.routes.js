const express = require("express");
const router = express.Router();
const amenityController = require("../controller/amenity.controller");

router.get("/all", amenityController.all);
router.post("/add", amenityController.add);
router.delete("/delete", amenityController.delete);

module.exports = router;
