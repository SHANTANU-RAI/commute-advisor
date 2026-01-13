const express = require("express");
const commuteRoutes = require("./routes/commute");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());

app.use("/commute", commuteRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
