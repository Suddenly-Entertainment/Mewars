module.exports = {
    'route': function(app) {
        var routes = {};
        //add controlers
        routes['home'] = require(__dirname + "/home").verbs;


        // loop through and add routes
        for (var controler in routes) {
            for (var verb in routes[controler]) {
                for (var route in routes[controler][verb]) {
                    app[verb](route, routes[controler][verb][route]);
                }
            }
        }


    }
};