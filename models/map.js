module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Map", {
    name : DataTypes.STRING
  });
};