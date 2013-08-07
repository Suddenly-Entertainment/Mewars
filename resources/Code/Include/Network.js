/*global $MEW, Crafty*/
$MEW.Routes = {
    "UsersLogin":     ['API', 'POST', '/api/users/login' ],
    "UsersRegester":  ['API', 'POST', '/api/users'],
    "MapsGetChunks":  ['API', 'POST', '/api/get_map_chunks'],
    "GetGameByID":    ['API', 'POST', '/api/get_game_by_id'],
    "GetResourceXML": ['RESOURCE', 'GET', '/xml/file/Resources.xml'],
    
};

Crafty.c("Network", {

    init: function () {
        this.csrf_token = $('meta[name="csrf-token"]').attr('content');
    },

    Send: function(type, data) {
        var ajax = this.getAjax(type, data);
        if (ajax) ajax.done(this.Receive(type)).fail(this.Error);
    },

    Receive: function(type) {
        return function(data) {
            var responce = {};
            try {
                responce = JSON.parse(data);
            } catch (e) {
                responce = data;
            }
            this.trigger(type, responce);
        };
    },

    Error: function(type) {
        return function(e) {
            $MEW.Network.trigger(type + 'Error', {
                type: "Network Error",
                error: e
            });
        };
    },

    getAjax: function(type, data) {
        var headers = $MEW.Routes[type] || ['', '', ''];
        var error;
        if (headers[0] === 'API') {
            return $.ajax(
                {
                    type: headers[1],
                    url: $MEW.API_URL + headers[2],
                    data: data,
                    context: this,
                    xhrFields: {
                        withCredentials: true
                    },
                    headers: {
                        'X-Transaction': headers[1] + ' ' + type,
                        'X-CSRF-Token': this.csrf_token
                    }
                }
            );
        } else if (headers[0] === 'RESOURCE') {
            return $.ajax(
                {
                    type: headers[1],
                    url: $MEW.RESOURCE_URL + headers[2],
                    data: data,
                    context: this,
                    xhrFields: {
                        withCredentials: true
                    },
                }
            );
        } else if (headers[0] === 'NODE') {
            error = new Error("Unspesified end point for network call '" + type + "'");
            console.log(error.message, error.stack);
        } else if (headers[0] === '') {
            error = new Error("Unspesified end point for network call '" + type + "'");
            console.log(error.message, error.stack);
        }
    },
    
    pBind: function(type, func) {
        this.unbind(type, func);
        this.bind(type, func);
    }
});
