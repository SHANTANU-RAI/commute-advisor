const express = require("express");
const router = express.Router();
const commuteController = require("../controllers/commuteController");

router.post("/", commuteController.getCommuteAdvice);

module.exports = router;
