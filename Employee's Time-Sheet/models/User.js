'use strict';
const Sequelize = require('sequelize');
export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username:{
            type:DataTypes.STRING,
            required: true,
        },
        email:{
            type:DataTypes.STRING,
            required: true,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            required: true
        },
        isEmployer:{
            type:DataTypes.BOOLEAN,
            required:true,
            defaultValue:false,
        },
        companyName:{
            type:DataTypes.STRING,
            required:true
        },
        isEmployee:{
            type:DataTypes.BOOLEAN,
            required:true,
            defaultValue:false,
        },
        isEmailVerified:{
            type:DataTypes.BOOLEAN,
            defaultValue: false,
        }, 
        isEmailVerifiedByEmployer:{
            type:DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isLoggedIn:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
        
    });
  
    // User.associate = (models) => {
    //   User.belongsToMany(models.Company, {
    //     through: 'member',
    //     foreignKey: 'userId',
    //   });
    // };
  
    return User;
  };