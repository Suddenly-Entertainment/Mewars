//Usage: At command line, run "node utils <scriptname> <arguments>"
//       <scriptname> = name of file in scripts directory ('.js' optional)
//       <arguments> = any arguments to pass into the script's execute method
//
//Scripts must export a function named 'execute' that takes two arguments:
//  Argument 1: returned value from requiring Mewars/models (this is our database interaction)
//  Argument 2: array of arguments provided from command line (excluding 'node', 'utils', and the script name)

process.argv.splice(0, 2);                        //remove 'node' and 'utils' from arguments
var scriptname = process.argv.shift();            //'pop' script name off of remaining args
var script = require('./scripts/' + scriptname);  //require specified script
var db = require('../models');                    //require db functionality
script.execute(db, process.argv);                 //call exports.execute method from specified script file