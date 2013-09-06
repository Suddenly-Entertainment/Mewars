// Load libaries
global.APP_DIR = __dirname;
var http    = require('http');
var express = require('express');
var io      = require('socket.io');

var CONFIG  = require('./config');
var Router  = require('./routes');
var db      = require('./models');
var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

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
         console.log('%s: Received %s - terminating MEW ...',
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
      self.server = http.createServer(self.app);
      self.socket = io.listen(self.server, {'flash policy port': -1});

    };

    self.configServer = function() {

      self.app.configure('development', function(){
        self.app.use(express.compress());
        self.app.use(express.static(__dirname + '/public'));
        self.app.use(express.logger());
        self.app.use(express.bodyParser());
        self.app.use(express.cookieParser());
        self.app.use(express.session({ secret: CONFIG.secret}));
        self.app.use(passport.initialize());
        self.app.use(passport.session());
        self.app.use(self.app.router);
      });

      self.app.configure('production', function(){
        self.app.use(express.compress());
        self.app.use(express.static(__dirname + '/public'));
        //self.app.use(express.logger());
        self.app.use(express.bodyParser());
        self.app.use(express.session({ secret: CONFIG.secret}));
        self.app.use(passport.initialize());
        self.app.use(passport.session());
        self.app.use(self.app.router);

      });
          
      self.socket.configure('production', function(){
        /**
        self.socket.enable('browser client minification');  // send minified client
        self.socket.enable('browser client etag');          // apply etag caching logic based on version number
        self.socket.enable('browser client gzip');          // gzip the file
        self.socket.set('log level', 1);                    // reduce logging
        **/
        self.socket.set('transports', [
            'xhr-polling',
            'websocket'
        //  , 'flashsocket'
        //  , 'htmlfile'
        //  , 'jsonp-polling'
        ]);
      });

      self.socket.configure('development', function(){
        self.socket.set('transports', [
              'xhr-polling',
              'websocket'
          //  , 'flashsocket'
          //  , 'htmlfile'
          //  , 'jsonp-polling'
          ]);
      });
      global.io = self.socket;
      Router.route(self.app);
      var socket_stuff = require('./socket');
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
      self.setupTerminationHandlers();

      // Create the express server and routes.
      self.initializeServer();
      self.configServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
      //  Start the app on the specific interface (and port).
      self.server.listen(CONFIG.port, CONFIG.ip, function() {
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