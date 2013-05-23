class MapsController < ApplicationController
  def get_map_chunks
    map_id = params[:map_id].to_i
    coordinates = params[:coordinates]
    if (coordinates == nil)
      render :json => []
    else
      chunk_size = 10
      chunks = []
      coordinates.each do |index, coordinate|
        x = coordinate[:x].to_i
        y = coordinate[:y].to_i
        tile = MapTile.where(:map_id => map_id, :x => x, :y => y).first
        if (tile != nil)
          map_chunk = tile.map_chunk
          tile_data = MapTile.where(:map_chunk_id => map_chunk.id).order('x,y').pluck(:terrain_type)
          chunks << {
            :width => chunk_size,
            :height => chunk_size,
            :chunk_x => map_chunk.x,
            :chunk_y => map_chunk.y,
            :data => tile_data.each_slice(chunk_size).to_a
          }
        end
      end
      render :json => chunks
    end
  end
end