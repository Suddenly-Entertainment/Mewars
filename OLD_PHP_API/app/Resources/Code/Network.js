Crafty.c("Network", {
	Send: function(type, controller, action, perams) {
        //pass, named, post
        var opts = {};
        opts.pass = perams.pass || [null];
        opts.named = perams.named || {'' : ''};
        opts.post = perams.post || {'' : ''};
        return $.post(
        	$MEW.URL + '/game/action/', 
        	{
	            controller: controller,
	            action: action,
	            pass: JSON.stringify(opts.pass),
	            named: JSON.stringify(opts.named),
	            post: JSON.stringify(opts.post)
        	}, 
        	this.Receive
        ).error(function (e) {$MEW.Network.Error(type + "Error", e);});
    },
    
    Receive: function(data) {
    	var responce = {};
    	try {
    		responce = JSON.parse(data);
    	} catch(e) {
    		$MEW.Network.trigger("Error", {type: "JSON Phrase Error", error: e });
    	}
    	if ((typeof responce.type !== 'undefined') && (responce.type !== null)) {
    		$MEW.Network.trigger(responce.type, responce.data);
    	}
    },
    
    Error: function(type, e) {
    	$MEW.Network.trigger(type, {type: "Network Error", error: e });
    }
});
//@ sourceURL=/Game/Network.js
