module.exports = function(sequelize, DataTypes) {
  return sequelize.define("MapChunk", {
    x : DataTypes.INTEGER,
    y : DataTypes.INTEGER
  });
};