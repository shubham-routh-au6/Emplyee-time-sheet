import express from 'express';
require('dotenv').config();
const userNormalRoutes = require('./routes/userNormalRoutes');
const userApiRoutes = require('./routes/employerApiRoutes');
const employeeApiRoutes = require('./routes/employeeApiRoutes');
import models from './models';


const app = express();

app.use(express.json());
app.use(userNormalRoutes);
app.use(userApiRoutes);
app.use(employeeApiRoutes);


models.sequelize.sync().then(() => {
    app.listen(8183, ()=>console.log('Server is up at port 8183'));
});