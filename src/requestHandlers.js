var fs = require('fs'),
    crypto = require('crypto');


function submit(postData, response) {
    console.log("Request handler 'submit' was called.");
    var shaSum = crypto.createHash('sha1');
    shaSum.update(postData);
    fs.writeFile('hash', shaSum.digest('hex'));
}

//retrieve immediately returns the text file
function retrieve(postData, response) {
    fs.readFile('hash', function(error, data) {
        if (error) throw error;
        response.writeHead(200, {'Content-Type': 'text'});
        response.end(data);
    });
}

//longPoll sends the text file when a change is detected
function longPoll(postData, response) {
    console.log("Request handler 'longPoll' was called.");
    response.writeHead(200, {'Content-Type': 'text'});
    fs.watchFile('hash', function(event, filename) {
        fs.readFile('hash', function(error, data) {
            if (error) throw error;
            response.end(data);
        });
    });
}

exports.submit= submit;
exports.retrieve = retrieve;
exports.longPoll = longPoll;
