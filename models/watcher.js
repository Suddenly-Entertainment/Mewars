var pg = require('pg');
var async = require('async');

CONFIG = require(global.APP_DIR + '/config');

var watcher = {};
watcher.callbacks = {};
watcher.client = new pg.Client(CONFIG.pg_connect_URI);
watcher.client.connect();

watcher.client.on('notification', function(msg) {
  // we will handle the notification messages here they should get returned as proper json strings
  console.log(msg);
  console.log(watcher.callbacks);
});


/********************************************************************
 * add_watcher : adds a watch procedure to teh database to notify of 
 *   table changes
 * 
 * name  => String name to give to the watcher
 * table => String name of the table this watch operation is on
 * when  => String SQL thats describes when teh trigger activates.
 *   it is structured like so 'TIME OPERATION_LIST' 
 *   time is either 'BEFORE' or 'AFTER'
 *   OPERATION_LIST is a list of operations the trigger should 
 *   activate on seperated by 'OR'
 *   possible operatiosn are 'INSERT', 'UPDATE', and 'DELETE'
 * cb =>  A callback for when the a notification is recieved it will find and call that function with the message.
 * Example:
 *   add_watcher('chat_messages', 'ChatMessages', 'AFTER INSERT OR UPDATE', cb)
 * 
 ********************************************************************/
 
watcher.add_watcher = function(name, table, when, cb) {
  
  var create_function_query = "CREATE OR REPLACE FUNCTION " + name + "_trigger() RETURNS trigger AS $$ " +
    "DECLARE " +
    "BEGIN " +
    "  PERFORM pg_notify('" + name + "', '{ table: ' || TG_TABLE_NAME || ', id: ' || NEW.id || '}' ); " +
    "  RETURN new; " +
    "END; " +
    "$$ LANGUAGE plpgsql ;";

  var drop_trigger_query = "DROP TRIGGER IF EXISTS watched_" + name + "_trigger ON  " + table + ";"

  var create_trigger_query = "CREATE TRIGGER watched_" + name + "_trigger " + when + " ON " + table + " " +
    "FOR EACH ROW EXECUTE PROCEDURE " + name + "_trigger();";

  var listen_query = "LISTEN " + name
  
  console.log(create_function_query);
  watcher.client.query(create_function_query)
  
    console.log(drop_trigger_query);
  watcher.client.query(drop_trigger_query)
  
    console.log(create_trigger_query);
  watcher.client.query(create_trigger_query)
  
      console.log(listen_query);
  watcher.client.query(listen_query)
  
  watcher.callbacks[name] = cb;
}
module.exports = watcher;



module.exports = watcher