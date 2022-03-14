const express = require("express");
const mongoose = require("mongoose");
const foodRouteHandler = require("./routeHandlers/foodRouteHandler");
require("dotenv").config();
const url = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.phoda.mongodb.net/${process.env.DATA_BASE}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());

mongoose
  .connect(url)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

app.use("/food", foodRouteHandler);

app.get("/", (req, res) => {
  res.send("hello world");
});

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json("error", { error: err });
}

app.listen(5000, () => {
  console.log("listening on port 5000");
});
