module.exports = {
  hostname: "http://mew-mew.rhcloud.com/",
  ip: process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP,
  port:  process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  postgress_connect_URI: process.env.OPENSHIFT_POSTGRESQL_DB_UR,
  postgress_host:        process.env.OPENSHIFT_POSTGRESQL_DB_HOST,
  postgress_port:        process.env.PGPORT
  postgress_user:        process.env.PGUSER,
  postgress_password:    process.env.PGPASSWORD,
  postgress_database:    process.env.PGDATABASE  
}