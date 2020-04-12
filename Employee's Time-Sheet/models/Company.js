const { Sequlize,DataTypes} = require("sequelize")
const db = require("../db");

const Company = db.define(
    "company",   {
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
  
module.exports = Company;