const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Commute Weather Advisor API",
      version: "1.0.0",
      description: "Weather-based commute risk and departure recommendation service"
    },
    servers: [
      { url: "http://localhost:3000" }
    ]
  },
  apis: ["./routes/*.js"]
};

module.exports = swaggerJSDoc(options);
