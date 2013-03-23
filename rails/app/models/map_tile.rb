class MapTile < ActiveRecord::Base
  belongs_to :map
  belongs_to :map_chunk
  attr_accessible :terrain_type, :x, :y
end
