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

    function makeGetRequest(url, data, headers, success, error) {
        return requestcreator(url, 'GET', data, headers, success, error);
    }

    function makePostRequest(url, data, headers, success, error) {
        return requestcreator(url, 'POST', JSON.stringify(data), headers, success, error);
    }

    function makePutRequest(url, data, headers, success, error) {
        return requestcreator(url, 'PUT', JSON.stringify(data), headers, success, error);
    }

    function makeDeleteRequest(url, headers, success, error) {
        return requestcreator(url, 'DELETE', null, headers, success, error);
    }

    return {
        get: makeGetRequest,
        post: makePostRequest,
        put: makePutRequest,
        delete: makeDeleteRequest
    }

}());