function calculateRiskScore(point) {
  let score = 0;
  const reasons = [];
  const breakdown = { AQI: 0, rain: 0, wind: 0, visibility: 0, temp: 0 };

  const aqi = typeof point.us_aqi === "number" ? point.us_aqi : null;
  const rain = typeof point.rain_prob === "number" ? point.rain_prob : 0;
  const wind = typeof point.wind_speed === "number" ? point.wind_speed : 0;
  const visibility = typeof point.visibility === "number" ? point.visibility : 999999;
  const temp = typeof point.temp === "number" ? point.temp : 999;

  if (aqi !== null && aqi >= 100) {
    score += 45; breakdown.AQI = 45;
    reasons.push(`Poor air quality (US AQI ${aqi})`);
  }
  if (rain > 60) {
    score += 30; breakdown.rain = 30;
    reasons.push(`High rain probability (${Math.round(rain)}%)`);
  }
  if (wind > 25) {
    score += 20; breakdown.wind = 20;
    reasons.push(`Strong winds (${Math.round(wind)} km/h)`);
  }
  if (visibility < 2000) {
    score += 10; breakdown.visibility = 10;
    reasons.push(`Low visibility (${(visibility/1000).toFixed(1)} km)`);
  }
  if (temp < 5) {
    score += 15; breakdown.temp = 15;
    reasons.push(`Low temperature (${temp.toFixed(1)}°C)`);
  }

  if (score === 0) reasons.push("No major weather or AQ issues detected");

  return { score: Math.min(score, 100), reasons, breakdown };
}

module.exports = { calculateRiskScore };
