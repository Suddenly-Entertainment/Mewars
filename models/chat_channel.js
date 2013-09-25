module.exports = function(sequelize, DataTypes) {
  return sequelize.define("ChatChannel", {
    name             : {type: DataTypes.STRING,  allowNull: false, unique: true,  defaultValue: ''        },
    last_activity        : {type: DataTypes.DATE,    allowNull: false, unique: false, defaultValue: new Date()},
  });
};