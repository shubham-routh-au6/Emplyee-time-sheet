const express = require('express');
require('dotenv').config();
const userNormalRoutes = require('./routes/userNormalRoutes');
const userApiRoutes = require('./routes/employerApiRoutes');
const employeeApiRoutes = require('./routes/employeeApiRoutes');
const db = require('./db');


const app = express();

app.use(express.json());
app.use(userNormalRoutes);
app.use(userApiRoutes);
app.use(employeeApiRoutes);


db.sync({}).then(() => {
    app.listen(8180, ()=>console.log('Server is up at port 8180'));
});