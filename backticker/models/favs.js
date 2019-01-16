'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favs = sequelize.define('Favs', {
    tickerSymbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    }
  }, {
      validate: {
        uniqueForeiqnKeyAndId(next) {
          Favs.findOne({
            where: {
              tickerSymbol: this.tickerSymbol,
            }
          })
            .then(fav => {
              if(fav&&fav.userId){
                if (fav.userId == this.userId) {
                  return next('Symbol already exists')
                }
              }
        
              return next()
            })
            .catch(err => console.log(err))
        }
      }
    });
  Favs.associate = function (models) {
    // associations can be defined here
    Favs.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      allowNull: false
    })
  };
  return Favs;
};