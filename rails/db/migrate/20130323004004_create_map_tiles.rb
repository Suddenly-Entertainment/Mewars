class CreateMapTiles < ActiveRecord::Migration
  def change
    create_table :map_tiles do |t|
      t.integer :chunk_id
      t.integer :map_id
      t.integer :x
      t.integer :y
      t.integer :terrain_type
    end
  end
end
