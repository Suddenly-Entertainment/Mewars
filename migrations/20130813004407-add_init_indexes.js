module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addIndex('MapChunks', ['MapId', 'x', 'y'], { indexName: 'index_map_chunks_on_map_id_and_x_and_y'});
    migration.addIndex('Users', ['confirmation_token'], { indexName: 'index_users_on_confirmation_token', indicesType: 'UNIQUE'});
    migration.addIndex('Users', ['reset_password_token'], { indexName: 'index_users_on_reset_password_token', indicesType: 'UNIQUE'});
    migration.addIndex('Users', ['email'], { indexName: 'index_users_on_email', indicesType: 'UNIQUE'});
    migration.addIndex('Users', ['username'], { indexName: 'index_users_on_username', indicesType: 'UNIQUE'});
    done();
  },
  down: function(migration, DataTypes, done) {
    migration.removeIndex('MapChunks', 'index_map_chunks_on_map_id_and_x_and_y');
    migration.removeIndex('Users', 'index_users_on_confirmation_token');
    migration.removeIndex('Users', 'index_users_on_reset_password_token');
    migration.removeIndex('Users', 'index_users_on_email');
    migration.removeIndex('Users', 'index_users_on_username');
    done();
  }
};