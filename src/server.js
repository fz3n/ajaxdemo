//server.js
//called from index.js
//runs the server to listen for clients
//retrieves post data, passes request on to router.js

//we need to use these libraries from node
var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path');

//some magic values
PORT = 8000; //the port the server hosts from
HOST = null; //null listens on all hosts
STATIC_FOLDER = './website'; //the folder static files are located in
ROOT = 'index.html'; //the name of the file to be hosted at root

function start(handle, route) {
    function onRequest(request, response) {
        //collect any post data
        var postData = "";
        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
        });

        //wait for the client to finish sending before continuing
        request.addListener("end", function() {
            route(handle, request, response, postData);
        });

    }   
    http.createServer(onRequest).listen(PORT, HOST);
    console.log("Server has started.");
}

exports.start = start;
