class RenameChunkIdToMapChunkIdForTiles < ActiveRecord::Migration
  def change
    rename_column :map_tiles, :chunk_id, :map_chunk_id
  end
end