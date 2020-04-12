const { Sequlize,DataTypes} = require("sequelize")
const db = require("../db");

const Task = db.define('task', {
      taskTitle: {
        type: DataTypes.STRING,
      },
      taskMembers:{
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      taskTL:{
        type: DataTypes.STRING
      },
      taskDetails:{
        type: DataTypes.STRING
      }
    });
  
    Task.associate = (models) => {
      Task.belongsTo(models.Company, {
        foreignKey: 'owner',
      });
      };
  module.exports = Task;