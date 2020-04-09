export default (sequelize, DataTypes) => {
    const Company = sequelize.define('company', {
      Cname: {
        type: DataTypes.STRING,
        unique: true,
      },
      Cemployee:{
        type: DataTypes.ARRAY(DataTypes.INTEGER)
      }
    });
  
    Company.associate = (models) => {
      // Company.belongsToMany(models.User, {
      //   through: 'member',
      //   foreignKey: 'companyId',
      // });
      Company.belongsTo(models.User, {
        foreignKey: 'owner',
      });
    };
  
    return Company;
  };