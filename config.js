function makeSecret(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

global.MEWSESSIONSECRET = global.MEWSESSIONSECRET || makeSecret(32)

var config = {
  debug_enabled: true,
  hostname:       "http://mew-mew.rhcloud.com/",
  ip:             process.env.OPENSHIFT_NODEJS_IP || process.env.VCAP_APP_HOST || 'localhost',
  port:           process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || 3000,
  pg_connect_URI: process.env.OPENSHIFT_POSTGRESQL_DB_URL + process.env.PGDATABASE,
  pg_host:        process.env.OPENSHIFT_POSTGRESQL_DB_HOST || '127.0.0.1',
  pg_port:        process.env.PGPORT || 5432,
  pg_user:        process.env.PGUSER || 'postgres',
  pg_password:    process.env.PGPASSWORD || 'root',
  pg_database:    process.env.PGDATABASE || 'mew',
  db_logging:     console.log, // remember to turn this off in production mode
  database_auto_migrate:   false,
  database_sync_on_start:  false, // creates tables if they do not exist, if assoceations change we'll need to go in and force this  (WARNING FORCING WILL DROP TABLES AND LOSE ALL DATA)
  secret: global.MEWSESSIONSECRET,
};

module.exports = config;
