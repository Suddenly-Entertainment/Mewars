class AddIndexMapidxyToMapTiles < ActiveRecord::Migration
  def change
    add_index :map_tiles, [:map_id, :x, :y]
  end
end
