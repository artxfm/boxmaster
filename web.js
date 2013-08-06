var express = require("express"),
    path = require('path'),
    http = require('http'),
    boxapi = require('./src/boxapi'),
    userui = require('./src/userui'),
    mongo = require('./src/mongo');

var app = express();

app.engine('jade', require('jade').__express);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + "/views");

app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/box/hello', boxapi.hello);
app.get('/status', userui.status);


/* login, logout ... */

// app.get('/', function(request, response) {
//    response.send('Hello World!');
// });

// var port = process.env.PORT || 5000;
// app.listen(port, function() {
//    console.log("Listening on " + port);
//});



var server = http.createServer(app).listen(app.get('port'), function () {
     console.log("Express server listening on port " + app.get('port'));
});

// var io = require('socket.io').listen(app.listen(port));


mongo.init(function(err) {
    if (err) {
        throw err;
    }
    console.log("mongo connected");
});


var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
    console.log("XXX socket.io connection");
    socket.emit('hello', { message: 'hello' });

    socket.on('get_status', function(data) {
        // XXX fake data
        console.log("XXX get_status");
        // socket.emit('status', userui.fake_data());
        userui.getBoxen(mongo, function(boxlist) {
            if (!boxlist) {
                boxlist = [];
            }
            console.log("found " + boxlist.length + " boxen");
            socket.emit('status', boxlist);
        });
    });

    socket.on('led_ctrl', function(data) {
        // Requires auth!
        // TODO: for now mute is always "no"
        console.log("XXX led_ctrl: " + data.state);
        var state = (data.state == "ON") ? "on" : "off";
        userui.setMasterLed(mongo, state, function(err) {
            if (err) {
                // TODO: emit error sig to ui...
                console.log("setMaster ERROR ", err);
            }
        });
    });
});
