class AddIndexChunkidToMapTiles < ActiveRecord::Migration
  def change
    add_index :map_tiles, :chunk_id
  end
end
