if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize'),
        sequelize = null;

    CONFIG = require(global.APP_DIR + '/config');

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

    if (CONFIG.auto_migrate) {
        migrate(sequelize);
    }

    global.db = {
        Sequelize: Sequelize,
        sequelize: sequelize,
        User:      sequelize.import(__dirname + '/user')

        // add your other models here
    };

  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */
}

module.exports = global.db;