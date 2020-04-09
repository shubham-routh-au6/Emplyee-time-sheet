export default (sequelize, DataTypes) => {
    const TaskSubmit = sequelize.define('tasksubmit', {
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
  
    return TaskSubmit;
  };