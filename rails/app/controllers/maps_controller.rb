class MapsController < ApplicationController
  def get_map_chunk
    map_id = params[:map_id].to_i
    x = params[:x].to_i
    y = params[:y].to_i
    tile = MapTile.where(:map_id => map_id, :x => x, :y => y).first
    map_chunk = tile.map_chunk
    tile_data = MapTile.where(:map_chunk_id => map_chunk.id).order('x,y').pluck(:terrain_type)
    render :json =>
    {
      :width => 10,
      :height => 10,
      :chunk_x => map_chunk.x,
      :chunk_y => map_chunk.y,
      :data => tile_data.each_slice(10).to_a
    }
  end
end