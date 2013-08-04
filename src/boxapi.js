var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/boxdb';
console.log("XXX MONGO = " + mongoUri);

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

var mongoClient = new MongoClient(new Server('localhost', 27017));


function withDb(func) {
    mongoClient.connect(mongoUri, function(err, db) {
        if (err) {
            console.log("MONGO OPEN ERROR ", err);
        } else {
            func(db);
        }
    });
}



// Locate item in DB, pass it off to func when found.
function boxHello(db, id, func) {
    db.collection('boxen', function(err, collection) {
        if (err) {
            func(null, collection);
        } else {
            collection.findOne({id:id}, function(err, item) {
                func(item, collection);
            });
        }
    });
}


exports.hello = function(req, res) {
    // This is the box hello message. We only process hello messages
    // from boxes we know about.
    if (req.body) {
        if (req.body.id) {
            console.log("hello from box " + req.body.id);
            withDb(function(db) {
                boxHello(db, req.body.id, function(foundBox, collection) {
                    if (foundBox) {
                        // Ok.
                        var payload = req.body;
                        collection.update({id:foundBox.id}, {$set:{lastcontact:new Date(),
                                                                   lastmsg:payload,
                                                                   actual:{ led:payload.led, mute:payload.mute }}},
                                          {w:1},
                                          function(err, result) {});
                        // return desired state back to box.
                        var state = foundBox.desired;
                        res.send(JSON.stringify(state));
                    } else {
                        res.status(404).send('box not found');
                    }
                    db.close();
                });
            });
        } else {
            res.status(400).send('syntax error');
        }
    } else {
        res.status(400).send('bad request');
    }
};
