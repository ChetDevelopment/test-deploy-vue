const express = require("express");
const userRoute = require("./routes/userRoute");

const app = express();

app.use(express.json());

app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

module.exports = app;
