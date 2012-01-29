var server = require("./server"),
    router = require("./router"),
    request = require("./request");

var handle = {}
handle["/submit"] = request.submit;
handle["/retrieve"] = request.retrieve;
handle["/longPoll"] = request.longPoll;

//start the server, passing to it the list of handlers
server.start(handle, router.route);
