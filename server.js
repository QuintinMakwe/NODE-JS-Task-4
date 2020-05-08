require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const { mongooseConnectionString, port } = require("./config/config.index");
const adminRoutes = require("./routes/admin.routes");
const tutorRoutes = require("./routes/tutor.routes");
const studentRoutes = require("./routes/student.routes");
const generalRoutes = require("./routes/general.routes");

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

//Set-up extra middleware for the api
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//port routes
app.use("/api/v1/admin/tutor", adminRoutes);
app.use("/api/v1/tutor", tutorRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/general", generalRoutes);

app.use("*", (req, res) => {
  res
    .status(404)
    .json({
      warning:
        "You have reached the end of the internet :) Try entering a valid route next time",
    });
});

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
