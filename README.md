# 🚦 Weather-Based Commute Advisor – Backend

This service analyzes weather and air quality conditions for a commuter's travel window and recommends whether they should change their departure time to reduce health and travel risk.

It combines:

- Hourly weather forecasts
- Air Quality Index (AQI)
- A deterministic risk-scoring engine
- A time-window comparison algorithm

---

## 🛠 Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd commute-advisor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the server
```bash
npm start
```

The server runs on:
```
http://localhost:3000
```

---

## 📚 API Documentation

Complete API documentation is available through **Swagger UI**.

Once the server is running, visit:
```
http://localhost:3000/api-docs
```

This interactive documentation allows you to:
- View all available endpoints
- See request/response schemas
- Test API calls directly from the browser

All functions in the codebase are documented using **JSDoc** comments, providing detailed information about parameters, return types, and usage examples.

---

## 📡 API Usage

### Endpoint
```
POST /commute-advice
```

### Request Body

| Field              | Type                      | Description                                      |
|--------------------|---------------------------|--------------------------------------------------|
| home               | object                    | Latitude & longitude of the starting point       |
| office             | object                    | Latitude & longitude of the destination          |
| planned_departure  | ISO string or "leave now" | When the user intends to leave                   |
| duration_minutes   | number (optional)         | Expected commute duration (default 45)           |

**Example:**
```json
{
  "home": {
    "latitude": 28.5847,
    "longitude": 77.3520
  },
  "office": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "planned_departure": "2026-01-13T18:49:00",
  "duration_minutes": 45
}
```

---

### Response Body

**Example:**
```json
{
  "risk_score": 45,
  "recommendation": "No change needed",
  "recommended_departure": "2026-01-13T18:00:00.000+05:30",
  "reason": [
    "Poor air quality (US AQI 198)"
  ],
  "risk_breakdown": {
    "AQI": 45,
    "rain": 0,
    "wind": 0,
    "visibility": 0,
    "temp": 0
  },
  "weather_snapshot": {
    "time": "2026-01-14T00:00",
    "temp": 8.1,
    "rain_prob": 0,
    "wind_speed": 3.7,
    "visibility": 24140,
    "us_aqi": 198,
    "pm2_5": 119.7
  },
  "alternatives": [
    {
      "shift_minutes": -120,
      "departure": "2026-01-13T16:00:00.000+05:30",
      "score": 45,
      "reasons": [
        "Poor air quality (US AQI 198)"
      ]
    },
    {
      "shift_minutes": -60,
      "departure": "2026-01-13T17:00:00.000+05:30",
      "score": 45,
      "reasons": [
        "Poor air quality (US AQI 198)"
      ]
    },
    {
      "shift_minutes": 0,
      "departure": "2026-01-13T18:00:00.000+05:30",
      "score": 45,
      "reasons": [
        "Poor air quality (US AQI 198)"
      ]
    },
    {
      "shift_minutes": 60,
      "departure": "2026-01-13T19:00:00.000+05:30",
      "score": 45,
      "reasons": [
        "Poor air quality (US AQI 198)"
      ]
    },
    {
      "shift_minutes": 120,
      "departure": "2026-01-13T20:00:00.000+05:30",
      "score": 45,
      "reasons": [
        "Poor air quality (US AQI 198)"
      ]
    }
  ]
}
```

---

## 🧮 Weather Risk Scoring Logic

Each commute window is evaluated using deterministic rules based on the forecasted conditions.

| Condition                | Score Added |
|--------------------------|-------------|
| US AQI ≥ 100             | +45         |
| Rain probability > 60%   | +30         |
| Wind speed > 25 km/h     | +20         |
| Visibility < 2 km        | +10         |
| Temperature < 5°C        | +15         |

The total score is capped at **100**.

A structured breakdown is returned so users and systems can understand why a score was produced.

---

## ⏱ Departure Window Evaluation

Instead of evaluating only one time, the system evaluates **five possible departure windows**:
```
[-120, -60, 0, +60, +120] minutes
```

Meaning:

- 2 hours earlier
- 1 hour earlier
- Planned time
- 1 hour later
- 2 hours later

Each window is scored independently. The lowest-risk window is chosen, and if it is at least **5 points safer** than the planned time, a recommendation is issued.

This allows the system to say:

> "Avoid 8–9am due to heavy rain. Leaving at 7am is safer."

---

## 📍 Why We Use the Mid-Point Instead of Home or Office

The service does not use only home or office weather.

Instead, it calculates:
```
(midpoint latitude, midpoint longitude)
```

This better represents what the commuter experiences during the journey — not just at the start or end. It acts as a lightweight approximation of the full route without needing a routing API.

---

## ⚖ Assumptions & Trade-offs

### Assumptions

- Weather and air-quality data from Open-Meteo is accurate and available.
- The commute happens within the next few hours, where forecasts are most reliable.
- Hourly forecasts are sufficient to evaluate travel risk for typical urban commutes.

### Trade-offs

- **Hourly resolution** was used because most free weather APIs do not provide minute-level forecasts.
- **Midpoint sampling** was chosen instead of full route sampling to avoid calling a routing API and to keep latency low.
- **Caching** is done using raw latitude & longitude. In a production system, rounding coordinates (e.g., 2 decimal places) would improve cache reuse for nearby users.

---