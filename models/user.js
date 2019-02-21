'use strict';
const password = require('../helpers/password.js');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: "Name cannot be less than 2 chars and more than 100 chars"
        }
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "email cannot be empty"
        },

        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "password cannot be empty"
        },
        isUnique: function() {
          return User.findOne({
                where: {
                  email: this.email
                }
              })
              .then((data) => {
                  if (data) {
                    throw ('Email already exist')
                  }
              })
              .catch((err) => {
                throw (err)
              })
          }
        }
      }
    }, {});

  User.associate = function(models) {
   User.hasMany(models.Tax, { foreignKey: 'userId'})
  };

  User.beforeCreate((user, options) => {
    let hashPassword = password.hashPassword(user.password);
    user.password = hashPassword;
  })

  return User;
};