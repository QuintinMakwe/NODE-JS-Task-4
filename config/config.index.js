require("dotenv").config();

module.exports = {
  mongooseConnectionString: process.env.LOCAL_CONNECTION_STRING,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};
