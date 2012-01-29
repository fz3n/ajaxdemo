var fs = require('fs'),
    crypto = require('crypto'),
    events = require('events');

var emitter = new events.EventEmitter()
emitter.setMaxListeners(0);

function submit(postData, response) {
    console.log("Request handler 'submit' was called.");
    var shaSum = crypto.createHash('sha1');
    shaSum.update(postData);
    fs.writeFile('hash', shaSum.digest('hex'));
    emitter.emit('submitted');
}

//retrieve immediately returns the text file
function retrieve(postData, response) {
    fs.readFile('hash', function(error, data) {
        if (error) {
            fs.writeFile('hash', '');
            response.writeHead(500, {'Content-Type': 'text'});
            response.end();
        }
        else {
            response.writeHead(200, {'Content-Type': 'text'});
            response.end(data);
        }
    });
}

//longPoll sends the text file when a change is detected
function longPoll(postData, response) {
    console.log("Request handler 'longPoll' was called.");
    response.writeHead(200, {'Content-Type': 'text'});
    emitter.on('submitted', function() {
        fs.readFile('hash', function(error, data) {
            if (error) {
                fs.writeFile('hash', '');
                response.end();
            } else {
                response.end(data);
            }
        });
    });
}

exports.submit= submit;
exports.retrieve = retrieve;
exports.longPoll = longPoll;
