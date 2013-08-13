module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addIndex('MapChunks', ['MapId', 'x', 'y'], { indexName: 'index_map_chunks_on_map_id_and_x_and_y'});
    done();
  },
  down: function(migration, DataTypes, done) {
    migration.removeIndex('MapChunks', 'index_map_chunks_on_map_id_and_x_and_y');
    done();
  }
};