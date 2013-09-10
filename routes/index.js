module.exports = {
    'route': function(app) {
        var controlers = {};
        //add controlers
        controlers['home'] = require(__dirname + "/home").verbs;
        controlers['resource'] = require(__dirname + "/resource").verbs;
        controlers['code'] = require(__dirname + '/code').verbs;
        controlers['xml'] = require(__dirname + '/xml').verbs;
        controlers['game'] = require(__dirname + '/game').verbs;
        controlers['user'] = require(__dirname + '/user').verbs;
        controlers['debug'] = require(__dirname + '/debug').verbs;

        // loop through and add routes
        for (var controler_name in controlers) {
            var controler = controlers[controler_name];
            for (var verb in controler) {
                var routes = controler[verb];
                for (var route in routes) {
                    // we dont want to care if middleware is a function or an array of functions
                    // so lets ensure that weathers it an array or not we call the path mounting 
                    // function with an array of arguments in the right order
                    var middleware = routes[route];
                    var args = [].concat(route, middleware);
                    app[verb].apply(app, args);
                }
            }
        }


    }
};