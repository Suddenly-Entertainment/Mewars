module.exports = {
    'route': function(app) {
        var routes = {};
        //add controlers
        routes['home'] = require(__dirname + "/home");

        for (var controler in routes) {
            for (var verb in routes[controler]) {
                for (var route in controler[verb]) {
                    app[verb](route, verb[route]);
                }
            }
        }

        
    }
};