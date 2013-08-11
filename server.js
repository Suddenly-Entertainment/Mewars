// Load libaries
// 
global.APP_DIR = __dirname;
var express = require('express');

var CONFIG  = require('./config');
var Router  = require('./routes');
var db      = require('./models');


/**
 *  Define the application.
 */
var MewApp = function() {

    //  Scope.
    var self = this;


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.app = express();
        Router.route(self.app);
        
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(CONFIG.port, CONFIG.ip, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), CONFIG.ip, CONFIG.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var app = new MewApp();
app.initialize();
app.start();

