module.exports = function(sequelize, DataTypes) {
  return sequelize.define("MapTile", {
    x : DataTypes.INTEGER,
    y : DataTypes.INTEGER,
    terrain_type : DataTypes.INTEGER
  });
};