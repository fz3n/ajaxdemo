//router.js
//called from server.js
//First attempts to match the request to a handler and execute that handler
//Otherwise attempts to find a file in a static folder, and send it to the user
//If it cannot find a file, it delivers a 404 error.
//If the file is not a .css or .js file, it is sent as text/html. 
//It's low tech, and not too robust, but the parts are all straightforward for you to use as an example.
var url = require('url'),
    fs = require('fs'),
    path = require('path');

function route(handle, request, response, postData) {
    var pathName = url.parse(request.url).pathname;
    if (typeof handle[pathName] == 'function') {
        //if the path is one of our handles, use that handle
        handle[pathName](postData, response);
    }
    else { 
        //othewise build a filepath for the file we're looking for
        var filePath = STATIC_FOLDER + request.url;
        if (filePath == STATIC_FOLDER + '/') {
            filePath = STATIC_FOLDER + '/' + ROOT;
        }
        
        //identify the type of content being served
        var extensionName = path.extname(filePath); //path.extname() returns '.xxx' if a file is named 'file.xxx'
        var contentType = 'text/html'; //our default content type
        switch (extensionName) {
        case '.css': contentType = 'text/css'; 
            break;
        case '.js': contentType = 'text/javascript';
            break;
        }
        
        //send the file or a 404
        path.exists (filePath, function(exists) {
            if (exists) { //if a file exists at the filepath
                fs.readFile (filePath, function(error, content) { //read the file
                    if (error) { //if there is an error reading the file, respond with error 500
                        response.writeHead(500); //it's the code for an internal error
                        response.end(); //this could happen due to a permission error
                    }
                    else { //otherwise, serve the file
                        response.writeHead(200, {'Content-Type': contentType}); //use the content type we found above
                        response.end(content, 'utf-8'); //send the content and close the connection
                    }
                });
            }
            else { //if a file does not exist at the filepath send a 404 error to the user
                response.writeHead(404); //it's the code for file not found
                response.end(); //close the connection so we don't leave them hanging
            }
        }); //end path.exists
    }   
}

exports.route = route;
