var app = app || {};


(function () {
    var parseapi = 'https://api.parse.com/1/';
    var parseAppId = 'hSdKMU5hs7Ixycu8DjpMVnKv1CeVdGz68LMe0deI';
    var parseRestApiKey = '2VbpvGCDQYcWQWt9A9P79yqEBUkMDdN7GN68EYEr';

    var parsesupport = new app.Services(parseapi, parseAppId, parseRestApiKey);

    var choose = '#wrapper';
    var choosepost = '#viewPost';


    app.location = Sammy(function () {
        //Homepage
        this.get('#/', function () {
            if (app.usertask.usercurrent()) {
                app.location.setLocation("#/user/homepage");
            } else {
                $(choose).load('../index.html');
            }
        });//Homepage end


        //Login page refer
        this.get('#/login', function () {
            $(choose).load('sites/login.html');
        });//refer end
		
		this.get('#/guestpage', function () {
            $(choose).load('sites/guestpage.html');
        });//guestpage refer


        //Login Action start
        this.get('#/proceedlogin', function () {
            var username = $("#userlogin.form-control").val();
            var password = $("#userpass.form-control").val();

            parsesupport.users.login(username, password, function (data) {
                    response("Login successful");
                    app.location.setLocation("#/user/homepage");
                },
                function (error) {
                    responsefail("Login failed", error);
                    app.location.setLocation("#/login");
                });
        });//Login Action end


        //Logout start
        this.get('#/logoutuser', function () {
            parsesupport.users.logout();
            response("Successfully logged out");
            app.location.setLocation("#/login");
        });//Logout end


        //Register start
        this.get('#/userregister', function () {
            $(choose).load('sites/register.html');
        });//Register end


        //Register Action start
        this.get('#/proceedregister', function () {
            var username = $('#registeruser.form-control').val();
            var password = $('#registerpass.form-control').val();
            var fullName = $("#registerfullname.form-control").val();
            var about = $("#aboutregister.form-control").val();
            var gender = $('input[name="gender-radio"]:checked').val();
            var picture = $('#picture').attr('datapicture');

            parsesupport.users.register(username, password, fullName, about, gender, picture, function (data) {
                    response("Registration successful");
                    app.location.setLocation("#/user/homepage");
                },
                function (error) {
                    responsefail("Registration failed", error);
                    app.location.setLocation("#/userregister");
                });
        });//Register Action End


        //User Main Page Start
        this.get('#/user/homepage', function () {
            var userloggedin = app.usertask.usercurrent();
            var mainuser =
            {
                username: userloggedin.username,
                name: userloggedin.name,
                objectId: userloggedin.objectId,
                picture: userloggedin.picture
            };


            $.get('sites/head.html', function (pattern) {
                var result = Mustache.render(pattern, mainuser);
                $(choose).html(result);
            });


            parsesupport.users.obtainposts(function (data) {

                $.get('sites/collectionposts.html', function (pattern) {

                    var outcome = data.results.length;
                    var opposite = 0;

                    $.each(data.results, function (k, v) {

                        parsesupport.users.getById(data.results[k].createdBy.objectId, function (ruser) {

                            data.results[k]["myPicture"] = ruser.picture;
                            data.results[k]["myUsername"] = ruser.username;
                            data.results[k]["myDate"] = new Date(data.results[k].createdAt).toString('d-MMM-yyyy HH:mm');

                            opposite++;

                            if (opposite == outcome) {
                                var result = Mustache.render(pattern, data);
                                $(choosepost).html(result);
                            }
                        });

                    });

                });
            }, function (error) {
                alert("ERROR!");
            });

        });//User End


        //Post Creation
        this.get('#/user/postpage', function () {
            $(choosepost).load('sites/postmain.html');
        });//Post End


        //Post Action
        this.get('#/user/postcreate', function () {
            var userloggedin = app.usertask.usercurrent();

            var postsummary = $('#postsummary.form-control').val();
            var mainuser = {
                content: postsummary
            }

            parsesupport.users.postcreate(mainuser.content, function (data) {

                response("Post done!");
                app.location.setLocation("#/user/homepage");
            }, function (error) {
                displaymessage("Post failed to process!");
            });



        });//Post Action Create End


        //Edit Profile start
        this.get('#/users/profileedit', function () {

            var userloggedin = app.usertask.usercurrent();

            $.get('sites/edit_profile.html', function (pattern) {
                var result = Mustache.render(pattern, userloggedin);
                $(choosepost).html(result);
            });

        });//Edit Profile End



        //Edit Action Profile
        this.get('#/user/do-profileedit', function () {

            var userinfo = {

                objectId: $("#profileEdit-form").data('object-id'),
                password: $("#password.form-control").val(),
                name: $("#name.form-control").val(),
                about: $("#about.form-control").val(),
                gender: $('input[name="gender-radio"]:checked').val(),
                picture: $('#picture').attr('datapicture')
            };

            parsesupport.users.editProfile(userinfo,

                function (data) {
                    response("Profile edited");

                    var userloggedin = app.usertask.usercurrent();

                    userloggedin.name = userinfo.name;
                    userloggedin.about = userinfo.about;
                    userloggedin.picture = userinfo.picture;

                    app.usertask.login(userloggedin);

                    app.location.setLocation("#/user/homepage");
                },
                function (error) {

                    responsefail("Profile edit failed", error);
                    app.location.setLocation("#/user/profileedit");
                });
        });//Edit Profile End



        
        this.get('#/user/obtainuser/:objectId', function () {
            var objectId = this.params['objectId'];

            parsesupport.users.getPostsById(objectId, function (pRow) {
                parsesupport.users.getById(pRow.createdBy.objectId, function (data) {

                    $.get('sites/userbox.html', function (pattern) {

                        var result = Mustache.render(pattern, data);
                        $("#tooltip").html(result);
                        $(document).click(function () {
                            $("#tooltip").hide();
                        });

                    });

                }, function (error) {
                    responsefail("Cannot load user via id ", error)
                });


            }, function (error) {
                responsefail("Cannot load the post class ", error);

            });

        });


    });



    app.location.run('#/');



    function responsefail(output, error) {

        var messageerror = error.responseJSON;
        if (messageerror && messageerror.error) {

            displaymessage(output + ": " + messageerror.error);
        } else {

            displaymessage(output + ".");
        }
    }

    function response(output) {
        noty({
                text: output,
                type: 'info',
                layout: 'topCenter',
                timeout: 900
            }
        );
    }

    function displaymessage(output) {
        noty({
                text: output,
                type: 'error',
                layout: 'topCenter',
                timeout: 4000
            }
        );
    }

}());