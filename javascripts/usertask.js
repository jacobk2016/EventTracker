var app = app || {};

app.usertask = {

    login: function (objUser) {
        sessionStorage['userloggedin'] = JSON.stringify(objUser);
    },


    usercurrent: function () {
        var objUser = sessionStorage['userloggedin'];
        if (objUser) {
            return JSON.parse(sessionStorage['userloggedin']);
        }
    },


    logout: function () {
        delete sessionStorage['userloggedin'];
    }
};
