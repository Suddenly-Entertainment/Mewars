namespace :mew do
  desc "Test to make sure namespace is accessible"
  task :test_rake do
    puts "Hello!"
  end

  desc "Generate world map from png"
  task :generate_world_map, [:mapname, :filename] => :environment do |t, args|
    #check if map with given name already exists - if so, exit
    if (Map.where(:name => args.mapname).count > 0)
      puts "Map name \"#{args.mapname}\" already in use"
      exit
    end
    
    #configurable settings
    chunk_size = 10
    insert_capacity = 10000
    color_mapping = {
      0x00FF00FF => 0,    #grass
      0x00A080FF => 1,    #everfree grass
      0xFFFF00FF => 2,    #flowers
      0x808000FF => 3,    #dirt
      0x400000FF => 4,    #mud
      0x808040FF => 5,    #barren
      0x000080FF => 6,    #bridge
      0x404000FF => 7,    #swamp
      0x00A000FF => 8,    #bushes
      0x008000FF => 9,    #forest
      0x008040FF => 10,   #everfree forest
      0x804040FF => 11,   #rocky
      0xC0C0C0FF => 12,   #snow
      0x8080FFFF => 13,   #ice
      0x0000FFFF => 14,   #water
      0x000000FF => 15,   #ravine
      0xFF8000FF => 16,   #volcano
      0xFF00FFFF => 17,   #mountain
      0xFF80FFFF => 18,   #snow mountain
      0xA08050FF => 19,   #desert 2
      0xFF0000FF => 20,   #lava
      0xC8C864FF => 21,   #quicksand
      0x8000FFFF => 22,   #poison joke
      0x408000FF => 23,   #apple trees
      0x800040FF => 24,   #zap apple trees
      0xFF80B0FF => 25,   #gemstones
      0xFFFFFFFF => 26,   #diamonds
      0xFFA080FF => 27    #desert 1
    } 

    #load map
    img = ChunkyPNG::Image.from_datastream(ChunkyPNG::Datastream.from_file("app/assets/images/maps/#{args.filename}"))

    #save chunks to db
    map = Map.create({:name => args.mapname})
    inserts = []
    (0..img.width-1).step(chunk_size) do |x|
      (0..img.height-1).step(chunk_size) do |y|
        inserts.push "(#{map.id}, #{x}, #{y})"
        if (inserts.count >= insert_capacity)
          MapChunk.connection.execute "INSERT INTO map_chunks (map_id, x, y) VALUES #{inserts.join(", ")}"
          inserts = []
        end
      end
    end
    if (inserts.count > 0)
      MapChunk.connection.execute "INSERT INTO map_chunks (map_id, x, y) VALUES #{inserts.join(", ")}"
    end

    #save tiles to db
    map = Map.find(map.id) #make sure newly saved chunk data is accessible
    inserts = []
    map.map_chunks.each do |chunk|
      (0..chunk_size-1).each do |x_offset|
        (0..chunk_size-1).each do |y_offset|
          tile_x = chunk.x + x_offset
          tile_y = chunk.y + y_offset
          index = tile_x + (tile_y * img.width)
          terrain_id = -1
          if (color_mapping.has_key?(img.pixels[index]))
            terrain_id = color_mapping[img.pixels[index]]
          else
            puts "invalid color at #{tile_x},#{tile_y}"
            exit
          end
          inserts.push "(#{map.id}, #{chunk.id}, #{tile_x}, #{tile_y}, #{terrain_id})"
          if (inserts.count >= insert_capacity)
            MapTile.connection.execute "INSERT INTO map_tiles (map_id, map_chunk_id, x, y, terrain_type) VALUES #{inserts.join(", ")}"
            inserts = []
          end
        end
      end
    end
    if (inserts.count > 0)
      MapTile.connection.execute "INSERT INTO map_tiles (map_id, chunk_id, x, y, terrain_type) VALUES #{inserts.join(", ")}"
    end
  end
end
