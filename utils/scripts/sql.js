exports.help = function() {
  console.log('This script executes a given sql command in the database  ');
  console.log('  - Only one argument to pass in: a sql command           ');
  console.log('  - No validation/checks on the sql command - be careful! ');
  console.log('  - sql command must be enclosed in quotes                ');
  console.log('  - Table/column names must be enclosed in escaped quotes ');
  console.log('Example Usage:                                            ');
  console.log('  node utils run sql "select * from \\"Maps\\""           ');
};

exports.run = function(db, args) {
  var sql = args[0];
  db.sequelize.query(sql).success(function(results) {
    console.log('Results:');
    for (var i = 0; i < results.length; i++) {
      console.log(results[i]);
    }
  });
};