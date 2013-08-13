module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Role", {
    name : DataTypes.STRING
  });
};