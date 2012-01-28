var server = require("./server"),
    router = require("./router"),
    requestHandlers = require("./requestHandlers");

var handle = {}
handle["/submit"] = requestHandlers.submit;
handle["/retrieve"] = requestHandlers.retrieve;
handle["/longPoll"] = requestHandlers.longPoll;

//start the server, passing to it the list of handlers
server.start(handle, router.route);
