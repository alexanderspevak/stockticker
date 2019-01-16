'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUnique: function (value, next) {
          User.find({
            where: { userName: value }
          })
            .done(function (error, user) {
              if (error) {
                return next(error)
              }
              if (user) {
                return next('UserName already in use')
              }
              next()
            })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Favs, {
      foreignKey: 'userId',
      as: 'Favs'
    })
    // associations can be defined here
  };
  return User;
};