module.exports = {
  up: function(migration, DataTypes, done) {
    
    migration.createTable('Users',
        {   //
            username: DataTypes.STRING,
            email:    DataTypes.STRING,
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