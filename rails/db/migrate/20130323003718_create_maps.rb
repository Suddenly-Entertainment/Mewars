class CreateMaps < ActiveRecord::Migration
  def change
    create_table :maps do |t|
      t.string :name
    end
  end
end
