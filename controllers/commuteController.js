const { DateTime } = require("luxon");
const weatherService = require("../services/weatherService");
const { calculateRiskScore } = require("../utils/scoring");
const { midpoint } = require("../utils/mid_point");


async function getCommuteAdvice(req, res, next) {
  try {
    const { home, office, planned_departure, duration_minutes = 45 } = req.body;

    if (!home || !office) return res.status(400).json({ error: "home and office required" });
    if (typeof home.latitude === "undefined" || typeof office.latitude === "undefined") {
      return res.status(400).json({ error: "latitude/longitude required" });
    }

    let plannedDt;
    if (!planned_departure || planned_departure === "leave now") {
      plannedDt = DateTime.now();
    } else {
      plannedDt = DateTime.fromISO(planned_departure);
      if (!plannedDt.isValid) return res.status(400).json({ error: "invalid planned_departure" });
    }
    
    const plannedHour = plannedDt.startOf("hour");

    const { lat: midLat, lon: midLon } = midpoint(home.latitude, home.longitude, office.latitude, office.longitude);

    const shifts = [-120, -60, 0, 60, 120];

    const evaluations = await Promise.all(shifts.map(async (shift) => {
      const candidate = plannedHour.plus({ minutes: shift });
      
      const point = await weatherService.getHourlyPoint(midLat, midLon, candidate.toISO());
      const evalRes = calculateRiskScore(point);
      return {
        shift,
        candidate_iso: candidate.toISO(),
        point,
        ...evalRes
      };
    }));

    evaluations.sort((a, b) => (a.score - b.score) || (a.shift - b.shift));
    const best = evaluations[0];
    const plannedEval = evaluations.find(e => e.shift === 0);

    let recommendation = "No change needed";
    let recommended_departure = plannedHour.toISO();
    if (best.score + 5 < plannedEval.score) {
      recommended_departure = best.candidate_iso;
      recommendation = best.shift < 0 ? `Leave ${Math.abs(best.shift)} minutes earlier` : `Leave ${best.shift} minutes later`;
    }

    const response = {
      risk_score: plannedEval.score,
      recommendation,
      recommended_departure,
      reason: plannedEval.reasons,
      risk_breakdown: plannedEval.breakdown,
      weather_snapshot: plannedEval.point,
      alternatives: evaluations.map(e => ({
        shift_minutes: e.shift,
        departure: e.candidate_iso,
        score: e.score,
        reasons: e.reasons
      }))
    };

    return res.json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCommuteAdvice };
