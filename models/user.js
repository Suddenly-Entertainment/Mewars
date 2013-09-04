module.exports = function(sequelize, DataTypes) {
  return sequelize.define("User", {
    username             : {type: DataTypes.STRING,  allowNull: false, unique: true, defaultValue: ''},
    email                : {type: DataTypes.STRING,  allowNull: false, unique: true, defaultValue: ''},
    password             : {type: DataTypes.STRING,  allowNull: false, defaultValue: ''},
    confirmed            : {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    confirmation_token   : {type: DataTypes.STRING,  allowNull: false, unique: true},
    reset_password_token : {type: DataTypes.STRING,  allowNull: true, unique: true},
    logged_in: {type: DataTypes.BOOLEAN, allowNull: false, unique: false, defaultValue: false},
    last_activity: {type: DataTypes.DATE, allowNull: false, unique: false, defaultValue: sequelize.NOW},
  });
};