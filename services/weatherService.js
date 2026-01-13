const axios = require("axios");
const NodeCache = require("node-cache");
const { DateTime } = require("luxon");

const cache = new NodeCache({ stdTTL: 600 }); 

function buildUrls(lat, lon, timezone = "auto") {
  const weatherVars = "temperature_2m,precipitation_probability,windspeed_10m,visibility";
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${weatherVars}&forecast_days=2&timezone=${timezone}`;
  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi,pm2_5&forecast_days=2&timezone=${timezone}`;
  return { weatherUrl, aqUrl };
}


async function fetchForecast(lat, lon) {
  const key = `${lat},${lon}`;
  let payload = cache.get(key);
  if (payload) return payload;

  const { weatherUrl, aqUrl } = buildUrls(lat, lon);
  const [wRes, aRes] = await Promise.all([axios.get(weatherUrl), axios.get(aqUrl)]);
  
  payload = {
    weather: wRes.data.hourly || {},
    aqi: aRes.data.hourly || {}
  };
  
  cache.set(key, payload);
  return payload;
}


async function getHourlyPoint(lat, lon, timeIso) {
  const forecast = await fetchForecast(lat, lon);
  const times = forecast.weather.time || [];
  const target = DateTime.fromISO(timeIso).startOf("hour").toISO();

  
  let idx = times.indexOf(target);
  if (idx === -1) {
    let best = 0, bestDiff = Infinity;
    const targetTs = DateTime.fromISO(target).toMillis();
    for (let i = 0; i < times.length; i++) {
      const ts = DateTime.fromISO(times[i]).toMillis();
      const diff = Math.abs(ts - targetTs);
      if (diff < bestDiff) {
        best = i; 
        bestDiff = diff;
      }
    }
    idx = best;
  }

  const w = forecast.weather;
  const a = forecast.aqi;

  return {
    time: w.time ? w.time[idx] : null,
    temp: w.temperature_2m ? w.temperature_2m[idx] : null,
    rain_prob: w.precipitation_probability ? w.precipitation_probability[idx] : null,
    wind_speed: w.windspeed_10m ? w.windspeed_10m[idx] : null,
    visibility: w.visibility ? w.visibility[idx] : null, // meters
    us_aqi: a.us_aqi ? a.us_aqi[idx] : null,
    pm2_5: a.pm2_5 ? a.pm2_5[idx] : null
  };
}

module.exports = { getHourlyPoint, fetchForecast };