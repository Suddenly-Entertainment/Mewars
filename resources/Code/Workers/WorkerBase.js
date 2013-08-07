var $MEW = {};
// Set up URLs
if (location.hostname === "localhost") {
    $MEW.API_URL = "http://localhost:3000";
    $MEW.NODE_URL = "http://localhost:5000";
    $MEW.RESOURCE_URL = "http://localhost/resources";
} else if (location.hostname === "mew.ryex.c9.io") {
    $MEW.API_URL = "http://mew.ryex.c9.io";
    $MEW.NODE_URL = "http://mew_node.ryex.c9.io";
    $MEW.RESOURCE_URL = "http://mew_resource.ryex.c9.io";
} else if (location.hostname === "api2.equestrianwars.com") {
    $MEW.API_URL = "http://api2.equestrianwars.com";
    $MEW.NODE_URL = "http://node2.equestrianwars.com";
    $MEW.RESOURCE_URL = "http://re.equestrianwars.com";
} else  {
    $MEW.API_URL = "http://api.equestrianwars.com";
    $MEW.NODE_URL = "http://node.equestrianwars.com";
    $MEW.RESOURCE_URL = "http://re.equestrianwars.com";
}

self.importScripts('http://' + $MEW.RESOURCE_URL + '/js/lib/underscore-min.js', 'http://' + $MEW.RESOURCE_URL + '/js/lib/jquery.js');