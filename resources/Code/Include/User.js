Crafty.c("NetworkUser", {
    init: function() {
        this.requires("Network");
    },

    GetUserData: function() {
        this.Send("GameLoadUser", "Game", "load_user", {});
    },

    Login: function(login, password) {
        this.Send("UsersLogin", {
            user_login: {
                login: login,
                password: password
            }
        });
    }
});


$MEW.User = {
    data: null,
    name: null,
    avatar_href: null,
    is_guest: null,
    is_admin: null,
    is_logged: null,
    is_mod: null,

    load_user: function(cb) {
        $MEW.User.cb = cb;
        $MEW.Network.requires("NetworkUser");
        $MEW.Network.unbind("GameLoadUser", $MEW.User.onLoadUser);
        $MEW.Network.bind("GameLoadUser", $MEW.User.onLoadUser);
        $MEW.Network.GetUserData();
    },

    onLoadUser: function(result) {
        $MEW.User.data = result;
        $MEW.User.name = result.context.name;
        $MEW.User.avatar_href = result.context.avatar.href;
        $MEW.User.is_guest = result.context.is_guest;
        $MEW.User.is_admin = result.context.is_admin;
        $MEW.User.is_logged = result.context.is_logged;
        $MEW.User.is_mod = result.context.is_mod;
        if(!(typeof($MEW.User.cb) === 'undefined')) $MEW.User.cb();
    },

    Login: function(username, password, cb) {
        $MEW.Network.requires("NetworkUser");
        $MEW.Network.unbind("UsersLogin", cb);
        $MEW.Network.bind("UsersLogin", cb);
        $MEW.Network.Login(username, password);
    }

};