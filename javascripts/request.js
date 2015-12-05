var app = app || {};

app.requestdetails = (function () {

    function requestcreator(url, method, data, headers, success, error) {
        $.ajax(
            {
                url: url,
                method: method,
                contentType: 'application/json',
                data: data,
                headers: headers,
                success: success,
                error: error
            }
        );
    }

    function requestGet(url, data, headers, success, error) {
        return requestcreator(url, 'GET', data, headers, success, error);
    }

    function requestPost(url, data, headers, success, error) {
        return requestcreator(url, 'POST', JSON.stringify(data), headers, success, error);
    }

    function requestPut(url, data, headers, success, error) {
        return requestcreator(url, 'PUT', JSON.stringify(data), headers, success, error);
    }

    return {
        get: requestGet,
        post: requestPost,
        put: requestPut,
    }

}());