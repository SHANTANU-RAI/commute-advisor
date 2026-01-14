const express = require("express");
const commuteRoutes = require("./routes/commute");
const { errorHandler } = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");


const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/commute-advice", commuteRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
