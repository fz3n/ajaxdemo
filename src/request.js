var crypto = require('crypto'),
    events = require('events');

var emitter = new events.EventEmitter()
emitter.setMaxListeners(0);

var hash = '';

function submit(postData, response) {
    console.log("Request handler 'submit' was called.");
    var shaSum = crypto.createHash('sha1');
    shaSum.update(postData);
    hash = shaSum.digest('hex');
    response.writeHead(200, {'Content-Type': 'text'});
    response.end('success');
    emitter.emit('submitted');
}

//retrieve immediately returns the text file
function retrieve(postData, response) {
    response.writeHead(200, {'Content-Type': 'text'});
    response.end(hash);
}

//longPoll sends the text file when a change is detected
function longPoll(postData, response) {
    console.log("Request handler 'longPoll' was called.");
    response.writeHead(200, {'Content-Type': 'text'});
    emitter.on('submitted', function() {
        response.end(hash);
    });
}

exports.submit= submit;
exports.retrieve = retrieve;
exports.longPoll = longPoll;
