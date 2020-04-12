const { Sequlize,DataTypes} = require("sequelize")
const db = require("../db");

const TaskSubmit = db.define('tasksubmit', {
      taskId: {
        type: DataTypes.INTEGER,
        required:true
      },
      taskMembers:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        required:true
      },
      taskCompleted:{
        type: DataTypes.BOOLEAN,
        required:true
      },
      reportUrl:{
        type: DataTypes.STRING,
        required:true
      }
    });
  
    TaskSubmit.associate = (models) => {
        TaskSubmit.belongsTo(models.Task, {
        foreignKey: 'owner',
      });
      };
  
   module.exports = TaskSubmit