'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tax = sequelize.define('Tax', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'taxCode cannot be empty'
        }
      }
    },
    taxCode:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'taxCode cannot be empty'
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'taxCode cannot be empty'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER
    }
  }, {});
  Tax.associate = function(models) {
    Tax.belongsTo(models.User, { foreignKey: 'userId'})
  };
  return Tax;
};