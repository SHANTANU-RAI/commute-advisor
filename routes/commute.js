const express = require("express");
const router = express.Router();
const { getCommuteAdvice } = require("../controllers/commuteController");

/**
 * @swagger
 * /commute-advice:
 *   post:
 *     summary: Get weather-based commute advice
 *     description: Calculates weather risk and recommends the best departure time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               home:
 *                 type: object
 *               office:
 *                 type: object
 *               planned_departure:
 *                 type: string
 *               duration_minutes:
 *                 type: number
 *
 *     responses:
 *       200:
 *         description: Commute risk and recommendation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 risk_score:
 *                   type: number
 *                 recommendation:
 *                   type: string
 *                 recommended_departure:
 *                   type: string
 *
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/", getCommuteAdvice);

module.exports = router;
