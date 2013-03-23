namespace :mew do
  desc "Test to make sure namespace is accessible"
  task :test_rake do
    puts "Hello!"
  end

  desc "Sample map generating task"
  task :sample_generate_map => :environment do
    map_number = Map.count + 1
    map = Map.create({:name => "Sample Map #{map_number}"})
    map_width = 1000
    map_height = 1000
    chunk_size = 10
    insert_capacity = 10000

    chunk_inserts = []
    (0..map_width-1).step(chunk_size) do |x|
      (0..map_height-1).step(chunk_size) do |y|
        chunk_inserts.push "(#{map.id}, #{x}, #{y})"
      end
    end
    MapChunk.connection.execute "INSERT INTO map_chunks (map_id, x, y) VALUES #{chunk_inserts.join(", ")}"

    map = Map.find(map.id)
    tile_inserts = []
    map.map_chunks.each do |chunk|
      (0..chunk_size-1).each do |x_offset|
        (0..chunk_size-1).each do |y_offset|
          tile_inserts.push "(#{map.id}, #{chunk.id}, #{chunk.x + x_offset}, #{chunk.y + y_offset}, 1)"
          if (tile_inserts.count >= insert_capacity)
            MapTile.connection.execute "INSERT INTO map_tiles (map_id, chunk_id, x, y, terrain_type) VALUES #{tile_inserts.join(", ")}"
            tile_inserts = []
          end
        end
      end
    end
    if (tile_inserts.count > 0)
      MapTile.connection.execute "INSERT INTO map_tiles (map_id, chunk_id, x, y, terrain_type) VALUES #{tile_inserts.join(", ")}"
    end
  end
end

