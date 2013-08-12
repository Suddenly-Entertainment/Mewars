module.exports = {
  hostname:       "http://mew-mew.rhcloud.com/",
  ip:             process.env.OPENSHIFT_NODEJS_IP,
  port:           process.env.OPENSHIFT_NODEJS_PORT || 8080,
  pg_connect_URI: process.env.OPENSHIFT_POSTGRESQL_DB_UR,
  pg_host:        process.env.OPENSHIFT_POSTGRESQL_DB_HOST,
  pg_port:        process.env.PGPORT,
  pg_user:        process.env.PGUSER,
  pg_password:    process.env.PGPASSWORD,
  pg_database:    process.env.PGDATABASE,
  db_logging:     true
};