const express = require("express");
const commuteRouter = require("./routes/commute");

const app = express();
app.use(express.json());

app.use("/commute-advice", commuteRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
