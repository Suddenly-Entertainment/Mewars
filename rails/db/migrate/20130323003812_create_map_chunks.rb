class CreateMapChunks < ActiveRecord::Migration
  def change
    create_table :map_chunks do |t|
      t.integer :map_id
      t.integer :x
      t.integer :y
    end
  end
end
