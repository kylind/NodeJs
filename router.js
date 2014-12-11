function route(pathName, handle, response, request) {
    if (handle && handle[pathName]) {
        handle[pathName](response, request);

    } else {
        handle['/error'](response, request);

    }

}

exports.route = route;