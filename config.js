var config = {
  hostname:       "http://mew-mew.rhcloud.com/",
  ip:             process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  port:           process.env.OPENSHIFT_NODEJS_PORT || 8080,
  pg_connect_URI: process.env.OPENSHIFT_POSTGRESQL_DB_URL,
  pg_host:        process.env.OPENSHIFT_POSTGRESQL_DB_HOST || '127.0.0.1',
  pg_port:        process.env.PGPORT || 5432,
  pg_user:        process.env.PGUSER || 'postgres',
  pg_password:    process.env.PGPASSWORD || 'root',
  pg_database:    process.env.PGDATABASE || 'mew',
  db_logging:     console.log,
  auto_migrate:   false
};

module.exports = config;