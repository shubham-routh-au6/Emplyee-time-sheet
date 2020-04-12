const { Sequelize } = require("sequelize");
require('dotenv').config();
const connectDB = new Sequelize(
  process.env.DB_HOST,
  process.env.DB_NAME,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST1,
    dialect:"postgres"
}
);

connectDB
.authenticate()
.then(()=>{
  console.log("Postgres database has been connected successfully");
})
.catch(err=>{
  console.error(
    "Connection failed Database not connected error:",
   err
   );
});
module.exports = connectDB