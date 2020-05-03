require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const { mongooseConnectionString, port } = require("./config/config.index");

//Mongoose set-up
mongoose.connect(mongooseConnectionString, {
  useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
  console.log(`An error occured connecting to the DB server ${err}`);
});

mongoose.connection.on("connected", (err, res) => {
  console.log("Mongoose connected out successfully...");
});

//Body parser set-up
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set-up extra middleware for the api
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
