class MapChunk < ActiveRecord::Base
  belongs_to :map
  has_many :map_tiles
  attr_accessible :x, :y
end
