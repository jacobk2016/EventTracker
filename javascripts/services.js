var app = app || {};

app.Services = function (parseapi, parseAppId, parseRestApiKey) {
    var choose = '#wrapper';
    var choosepost = '#viewPost';

    function getHeaders() {
        var headers = {
            'X-Parse-Application-Id': 'hSdKMU5hs7Ixycu8DjpMVnKv1CeVdGz68LMe0deI',
                    'X-Parse-REST-API-Key': '2VbpvGCDQYcWQWt9A9P79yqEBUkMDdN7GN68EYEr'
        };

        var userloggedin = app.usertask.usercurrent();
        if (userloggedin) {
            headers['X-Parse-Session-Token'] = userloggedin.sessionToken;
        }

        return headers;
    }

    function postlist() {

        users.listPosts(function (data) {
                $.each(data, function () {

                    $.each(this, function (k, v) {
                        users.getById(data.results[k].createdBy.objectId, function (ruser) {

                            data.results[k]["myPicture"] = ruser.picture;
                            data.results[k]["myUsername"] = ruser.username;
                            data.results[k]["myDate"] = new Date(data.results[k].createdAt).toString('d-MMM-yyyy HH:mm');

                            $.get('sites/collectionposts.html', function (pattern) {
                                var result = Mustache.render(pattern, data);
                                $(choosepost).html(result);
                            });

                        }, function (error) {
                            responsefail("Cannot load user by id", error)
                        });

                    });
                });

            },
            function (error) {
                responsefail("Cannot load home page ", error)
            }
        )
    }

    var users = {

        //Login function
        login: function (username, password, success, error) {
            var url = parseapi + 'login';
            var userinfo = {
                username: username,
                password: password
            };

            return app.requestdetails.get(url, userinfo, getHeaders(), function (data) {
                app.usertask.login(data);
                success(data);

            }, error);
        },


        //Logout function
        logout: function () {
            app.usertask.logout();
        },


        //Register function
        register: function (username, password, fullName, about, gender, picture, success, error) {
            var url = parseapi + 'users';
            var userinfo = {
                username: username,
                password: password,
                name: fullName,
                about: about,
                gender: gender,
                picture: picture

            };

            return app.requestdetails.post(url, userinfo, getHeaders(), function (data) {
                data.picture = picture;
                data.name = fullName;
                data.username = username;

                app.usertask.login(data);
                success(data);

            }, error);
        },

        //Post function
        postcreate: function (content, success, error) {
            var url = parseapi + "classes/Post";

            var userloggedin = app.usertask.usercurrent();
            var userinfo = {
                content: content,
                createdBy: {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": userloggedin.objectId
                }
            };

            return app.requestdetails.post(url, userinfo, getHeaders(), success, error);
        },
        
        obtainposts: function (success, error) {
            var url = parseapi + "classes/Post";

            return app.requestdetails.get(url, undefined, getHeaders(), success, error);
        },
        

        //Post Listings
        listPosts: function (success, error) {
            var url = parseapi + "classes/Post";

            var userinfo = {
                includeParam: {
                    "order": "createdAt",
                    "limit": 45,
                    "include": "createdBy"
                }
            }

            return app.requestdetails.get(url, userinfo, getHeaders(), success, error);

        },
		
		


        //Post by ID
        getById: function (objectId, success, error) {
            var url = parseapi + 'users/' + objectId;
            return app.requestdetails.get(url, undefined, getHeaders(), success, error);
        },


        
        getPostsById: function (objectId, success, error) {
            var url = parseapi + "classes/Post/" + objectId;
            return app.requestdetails.get(url, undefined, getHeaders(), success, error);
        },


        //Display all users
        getAllUsers: function (success, error) {
            var url = parseapi + 'users';
            return app.requestdetails.get(url, undefined, getHeaders(), success, error);
        },


        //Edit Profile function
        editProfile: function (user, success, error) {
            var url = parseapi + 'users/' + user.objectId;
            return app.requestdetails.put(url, user, getHeaders(), success, error);
        }

    };


    return {
        users: users,
        postlist: postlist
    }

};
