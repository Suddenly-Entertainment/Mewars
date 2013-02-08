$MEW.Routes ={
    "UsersLogin":     ['API', 'POST', '/api/users/login' ],
    "UsersRegester":  ['API', 'POST', '/api/users']
};

Crafty.c("Network", {
    
    
    Send: function(type, data) {
        var ajax = this.getAjax(type, data);
        if (ajax) ajax.done(this.Receive).fail(this.Error);
    },
    
    Receive: function(type) {
        return function (data) {
            var responce = {};
            try {
                responce = JSON.parse(data);
            } catch(e) {
                responce = data;
            }
            this.trigger(type, responce);
        };
    },
    
    Error: function(type) {
        return function (e) {
            $MEW.Network.trigger(type + 'Error', {type: "Network Error", error: e });
        };
    },
    
    getAjax: function (type, data) {
        var headers = $MEW.Routes[type] || ['', '', ''];
        if (headers[0] == 'API'){
            return $.ajax({
                type: headers[1],
                url: $MEW.URL + headers[2],
                data: data,
                context: this,
                headers: {
                    'X-Transaction': headers[1] + ' ' + type,
                    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                }
            });
        }
        if (headers[0] === ''){
            var error = new Error("Unspesified end point for network call '" + type + "'");
            console.log(error.message, error.stack );
        }
    }
});
