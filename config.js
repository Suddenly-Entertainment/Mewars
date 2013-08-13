var config = {
  hostname:       "http://mew-mew.rhcloud.com/",
  ip:             process.env.OPENSHIFT_NODEJS_IP || process.env.VCAP_APP_HOST || 'localhost',
  port:           process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || 3000,
  pg_connect_URI: process.env.OPENSHIFT_POSTGRESQL_DB_URL,
  pg_host:        process.env.OPENSHIFT_POSTGRESQL_DB_HOST || '127.0.0.1',
  pg_port:        process.env.PGPORT || 5432,
  pg_user:        process.env.PGUSER || 'postgres',
  pg_password:    process.env.PGPASSWORD || 'root',
  pg_database:    process.env.PGDATABASE || 'mew',
  db_logging:     console.log, // remember to turn this off in production mode
  database_auto_migrate:   true,
  database_sync_on_start:  true, // creates tables if they do not exist, if assoceations change we'll need to go in and force this  (WARNING FORCING WILL DROP TABLES AND LOSE ALL DATA)
};

module.exports = config;