module.exports = function(sequelize, DataTypes) {
  return sequelize.define("ChatMessage", {
    username             : {type: DataTypes.STRING,  allowNull: false, unique: false,  defaultValue: ''        },
    msg                  : {type: DataTypes.STRING,  allowNull: false, unique: false,  defaultValue: ''        },
  });
};