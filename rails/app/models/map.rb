class Map < ActiveRecord::Base
  has_many :map_chunks
  has_many :map_tiles
  attr_accessible :name
end
