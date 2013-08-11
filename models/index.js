if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize'),
        sequelize = null;

    CONFIG = require(global.APP_DIR + '/config');
 
    sequelize = new Sequelize(CONFIG.pg_database, CONFIG.pg_user, CONFIG.pg_password, {
        dialect:  'postgres',
        protocol: 'postgres',
        port:     CONFIG.pg_port,
        host:     CONFIG.pg_host,
        logging:  CONFIG.db_logging
    });

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