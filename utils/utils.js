var help = function() {
  console.log('To run a script, type the following command:               ');
  console.log('    "node utils run <scriptname> <arguments>"              ');
  console.log('  <scriptname>:                                            ');
  console.log('    - name of file in scripts directory                    ');
  console.log('    - ".js" at end of name is optional                     ');
  console.log('  <arguments>:                                             ');
  console.log('    - any arguments to pass into script\'s run method      ');
  console.log('                                                           ');
  console.log('To get help on using a script, type the following command: ');
  console.log('    "node utils help <scriptname>"                         ');
  console.log('  <scriptname>:                                            ');
  console.log('    - name of file in scripts directory                    ');
  console.log('    - ".js" at end of name is optional                     ');
  console.log('                                                           ');
  console.log('To create a new script:                                    ');
  console.log('  - Create a new file in the scripts directory.            ');
  console.log('  - Script must export a run method taking two arguments:  ');
  console.log('    1: result from requiring models (db functionality)     ');
  console.log('    2: array of command line arguments                     ');
  console.log('  - Script must export a help method (no arguments) to     ');
  console.log('    explain how to use the script                          ');
};

var loadScript = function(scriptName) {
  return require('./scripts/' + scriptName);
};

var runScript = function() {
  //require database functionality
  global.APP_DIR = '../'; //used by models code
  var db = require('../models');
  
  //use timeout of 1 second to allow db initialization stuff to print
  setTimeout(function() {
    console.log('-------------------------------------------------------');
    console.log('Done checking/initializing database, now running script');
    console.log('-------------------------------------------------------');
    
    var script = loadScript(process.argv[3]);
    
    //get rid of first four arguments before calling script
    process.argv.splice(0, 4);
    
    script.run(db, process.argv);
  }, 1000);
};

var helpScript = function() {
  loadScript(process.argv[3]).help();
};

var validateArgs = function() {
  return (
    (process.argv.length > 3) &&
    (process.argv[2] === 'run' || process.argv[2] == 'help')
  );
};

var main = function() {
  if (validateArgs()) {
    var action = process.argv[2];
    if (action === 'run') {
      runScript();
    } else {
      helpScript();
    }
  } else {
    help();
  }
}

main();