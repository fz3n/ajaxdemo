//router.js
//called from server.js
//Forwards a url to a handler function in handler,js.
//If there isn't a handler, acts as a static file server.
var url = require('url'),
    path = require('path'),
    fs = require('fs');

//static values
STATIC_FOLDER = './website'; //the folder static files are located in
ROOT = 'index.html'; //the name of the file to be hosted at root

function route(handle, request, response, postData) {
    var pathName = url.parse(request.url).pathname;
    if (typeof handle[pathName] == 'function') {
        //if the path is one of our handles, use that handle
        handle[pathName](postData, response);
    }
    else { 
        //Since there isn't a handler, we try to serve a static file.

        //Start by building a filepath to our static folder.
        var filePath = STATIC_FOLDER + request.url;
        if (filePath == STATIC_FOLDER + '/') {
            filePath = STATIC_FOLDER + '/' + ROOT;
        }
        
        //Identify the filetype of content is being served:
        var extensionName = path.extname(filePath); 
        var contentType = 'text/html'; //default
        //This incredibly simplified switch assumes the content is 
        //HTML data if it isn't a .js or a .css file.
        //Consider use a project like node-mime if you have larger ambitions
        switch (extensionName) {
        case '.css': contentType = 'text/css'; 
            break;
        case '.js': contentType = 'text/javascript';
            break;
        }

        //With the filepath and mimetype determined, it's time to send the
        //file or a 404 error.
        path.exists (filePath, function(exists) {
            if (exists) { //if the file exists at the given filePath
                fs.readFile (filePath, function(error, content) { //read the file
                    if (error) { //if there is an error reading the file
                        response.writeHead(500); //respond with a 500/internal error header
                        response.end(); //this could happen due to a file permission problem
                    }
                    else { //otherwise, serve the file
                        response.writeHead(200, {'Content-Type': contentType}); //use the content type we found above
                        response.end(content, 'utf-8'); //send the file contents
                    }
                });
            }
            else { //if the file does not exist at the given filePath
                response.writeHead(404); //send a 404/not found header
                response.end(); //close the connection
            }
        }); //end path.exists
    }   
}

//export the router for external use (called in index.js)
exports.route = route;
