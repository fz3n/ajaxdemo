var crypto = require('crypto'),
    events = require('events');

//This EventEmitter is used to pass a hash value when one is
//submitted. The longPoll function receives the event and the
//hash value through the emitter.
var emitter = new events.EventEmitter()
//Remove limit on listeners.
emitter.setMaxListeners(0);

//submit makes a sha1 hash of postData, then emits that value
//through the EventEmitter.
function submit(postData, response) {
    console.log("Request handler 'submit' was called.");
    var shaSum = crypto.createHash('sha1');
    shaSum.update(postData);
    emitter.emit('submitted', shaSum.digest('hex'));
    response.writeHead(200, {'Content-Type': 'text'});
    response.end('success');
}

//longPoll opens a connection with the client and keeps it open
//until a 'submitted' event is emitted. It then sends the hash
//value emitted with the event to the user.
function longPoll(postData, response) {
    console.log("Request handler 'longPoll' was called.");
    response.writeHead(200, {'Content-Type': 'text'});
    emitter.on('submitted', function(hash) {
        response.end(hash);
    });
}

//We export these functions to let them be used outside of this file.
exports.submit= submit;
exports.longPoll = longPoll;
