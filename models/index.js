if (!global.hasOwnProperty('db')) {
    
    var watcher = require(__dirname + '/watcher')
    
    var Sequelize = require('sequelize'),
        sequelize = null;

    var CONFIG = require(global.APP_DIR + '/config');
    
    var dbready = function() {
        console.log("DB Ready");
        global.db.ready = true;
    }

    var migrate = function(sequelize) {
        var migrationsPath = global.APP_DIR + '/migrations';
        var migratorOptions = { path: migrationsPath },
            migrator        = sequelize.getMigrator(migratorOptions);

        sequelize.migrate();
    };
    
    sequelize = new Sequelize(CONFIG.pg_database, CONFIG.pg_user, CONFIG.pg_password, {
        dialect:  'postgres',
        protocol: 'postgres',
        port:     CONFIG.pg_port,
        host:     CONFIG.pg_host,
        logging:  CONFIG.db_logging,
        pool: { maxConnections: 5, maxIdleTime: 30},
        maxConcurrentQueries: 100,
        syncOnAssociation: false,
    });

    global.db = {
        Sequelize : Sequelize,
        sequelize : sequelize,
        ready     : false,
        watcher   : watcher,
        User      : sequelize.import(__dirname + '/user'),
        Role      : sequelize.import(__dirname + '/role'),
        Map       : sequelize.import(__dirname + '/map'),
        MapChunk  : sequelize.import(__dirname + '/map_chunk'),
        MapTile   : sequelize.import(__dirname + '/map_tile'),
        ChatChannel : sequelize.import(__dirname + '/chat_channel'),
        ChatMessage : sequelize.import(__dirname + '/chat_message'),

        // add your other models here
    };

    /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
    */
    
    //User
    global.db.User.belongsTo(global.db.Role);

    //Map
    global.db.Map.hasMany(global.db.MapChunk);
    global.db.Map.hasMany(global.db.MapTile);

    //MapChunk
    global.db.MapChunk.belongsTo(global.db.Map);
    global.db.MapChunk.hasMany(global.db.MapTile);

    //MapTile
    global.db.MapTile.belongsTo(global.db.Map);
    global.db.MapTile.belongsTo(global.db.MapChunk);
    
    //ChatChannel
    global.db.ChatChannel.hasMany(global.db.ChatMessage);
    
    //ChatMessage
    global.db.ChatMessage.belongsTo(global.db.ChatChannel);


    if (CONFIG.database_sync_on_start) {
        global.db.sequelize.sync().success(function() {
            console.log("[AUTOSYNC] Database Synced Sucessfuly");
            if (CONFIG.database_auto_migrate) {
                migrate(sequelize);
                dbready();
            } else {
                dbready();
            }
        }).error(function(error) {
            console.log("[AUTOSYNC] Could Not Sync Database", error.stack);
        });
    } else if (CONFIG.database_auto_migrate) {
        migrate(sequelize);
        dbready();
    } else {
        dbready();
    }
}

module.exports = global.db;