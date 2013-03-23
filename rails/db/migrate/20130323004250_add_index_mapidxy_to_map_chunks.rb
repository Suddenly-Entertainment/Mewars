class AddIndexMapidxyToMapChunks < ActiveRecord::Migration
  def change
    add_index :map_chunks, [:map_id, :x, :y]
  end
end
