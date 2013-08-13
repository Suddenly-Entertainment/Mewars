module.exports = {
  up: function(migration, DataTypes, done) {
    
    migration.createTable('Users',
        {   //
            user_id:       DataTypes.INTEGER.UNSIGNED,
            username: DataTypes.STRING,
            email:    DataTypes.STRING,
            confirmation_token: DataTypes.STRING
        },
        {
            //empty options
        }
    );
    
    done();
  },

  down: function(migration, DataTypes, done) {
    
    migration.dropTable('Users');
    
    done();
  }

};