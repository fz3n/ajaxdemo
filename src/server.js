//server.js
//called from index.js
//runs the server to listen for clients
//retrieves post data, passes request on to router.js

//we need to use these libraries from node
var http = require('http'),

//static values
PORT = 8000; //the port the server hosts from
HOST = null; //null listens on all hosts

function start(handle, route) {
    function onRequest(request, response) {
        //Collect post data from the user
        var postData = "";
        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
        });

        //Once the client is finished sending, pass the postData
        //and the request to the router.
        request.addListener("end", function() {
            route(handle, request, response, postData);
        });

    }   
    http.createServer(onRequest).listen(PORT, HOST);
    console.log("Server running at " + HOST + ":" + PORT);
}

//export the server for external use (called in index.js)
exports.start = start;
