const { Sequlize,DataTypes} = require("sequelize")
const db = require("../db");

const User = db.define('user', {
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
  
 module.exports = User;