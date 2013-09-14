/*global $MEW, Crafty*/
$MEW.Routes = {}
$MEW.AddRoute = function(name, headers) {
  $MEW.Routes[name] = headers
}


// These eventualy need to be moved to their apropreate network controller
$MEW.AddRoute("UsersLogin",      ['API', 'POST', '/api/users/login',      'JSON'])   
$MEW.AddRoute("UsersRegister",   ['API', 'POST', '/api/users/register',   'JSON'])    
$MEW.AddRoute("UsersCheckLogin", ['API', 'POST', '/api/users/checkLogin', 'JSON'])    
$MEW.AddRoute("MapsGetChunks",   ['API', 'POST', '/api/get_map_chunks',   'JSON'])      
$MEW.AddRoute("GetGameByID",     ['API', 'POST', '/api/get_game_by_id',   'JSON'])
$MEW.AddRoute("UsersLoginCheck", ['API', 'GET', '/api/users/loginCheck',  'JSON']);
$MEW.AddRoute("UsersLogOut", ['API', 'GET', '/api/users/logout', 'JSON']);         
     


Crafty.c("Network", {

    init: function () {
        this.requires('')
    },
    
    GetHeaders: function(type) {
        return $MEW.Routes[type] || ['', '', '', ''];
    },

    Send: function(type, data) {
        var headers = this.GetHeaders(type);
        var ajax = this.getAjax(type, data, headers);
        if (ajax) ajax.done(this.Receive(type, headers[3])).fail(this.Error(type, headers));
    },

    Receive: function(type, datatype) {
        return function(data) {
            var responce = {};
            if (datatype === 'JSON') {
                try {
                    responce = JSON.parse(data);
                } catch (e) {
                    responce = data;
                }
            } else if (datatype === 'XML') {
                if (data.nodeType) {
                    responce = data;
                } else {
                    var parser = new DOMParser();
                    responce = parser.parseFromString(data, "text/xml");
                }         
            } else {
                responce = data;
            }
            this.trigger(type, responce);
        };
    },

    Error: function(type, headers) {
        return function(e) {
            console.log("[NETWORK] " + type + 'Error', headers, e, e.message, e.stack);
            $MEW.Network.trigger(type + 'Error', {
                type: "Network Error",
                error: e,
                headers: headers
            });
            
        };
    },

    getAjax: function(type, data, headers) {
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
                    }
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
    },
    
    connectSocketIO: function(){
        $MEW.socket = io.connect('http://mew-mew.rhcloud.com');
        $MEW.socket.on("connect", function(data){
          console.log(data);
          $MEW.socket.emit("Auth", $MEW.user.loginToken, function(success){
            if(success){
              console.log("Successfully authenticated");
            }else{
              Crafty.scene("User");
            }
          });
        });
    }
});
