class MapsController < ApplicationController
  def get_full_map
    all_data = MapTile.where(:map_id => 1).order('y, x').pluck(:terrain_type)
    render :json =>
    {
      :width => 20,
      :height => 20,
      :data => all_data.each_slice(100).to_a
    }
  end
end