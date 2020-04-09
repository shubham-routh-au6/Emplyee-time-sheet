import Sequelize from 'sequelize';
require('dotenv').config();
const sequelize = new Sequelize('projectTesting', process.env.DB_NAME, process.env.DB_PASS, {
  dialect: 'postgres',
});

const models = {
  User: sequelize.import('./User'),
  Company: sequelize.import('./Company'),
  Task: sequelize.import('./Task'),
  TaskSubmitted:sequelize.import('./tasksubmitted')
//   Team: sequelize.import('./team'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;