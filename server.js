require("dotenv").config();
const express = require("express");
const { connectDb } = require("./src/services/mongoose");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/persons", require("./src/routes/person"));

connectDb().catch((err) => console.error("Failed connected Db", err));

app.listen(port, (err) => {
  err
    ? console.error("Failed running Server", err)
    : console.log(`Server running on: http://localhost:${port}`);
});
