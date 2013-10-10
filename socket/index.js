/*
 * This file is a hub to run all other files in this socket folder.
 * This file is required in server.js when initializing server.js
 * What that means is that, it will be run in server.js
 * When ever you require a file here, that basically puts that file on this list to be run.
 * This file can also be used for general socket stuff.
 */
var chat_socket = require(__dirname + "/chat_socket.js");
//var chess_socket = require(__dirname + "/chess_socket.js"); //Commented out until chess_socket is ready