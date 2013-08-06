// Exports:
//   db = the db ref
//   boxen = the boxen collection
//   control = the control collection
//

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/boxdb';
console.log("XXX MONGO = " + mongoUri);

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

var mongoClient = new MongoClient(new Server('localhost', 27017));


exports.init = function(callback) {
    console.log("connecting to mongo");
    mongoClient.connect(mongoUri, function(err, db) {
        exports.db = db;
        if (db) {
            db.collection('boxen', function(err, collection) {
                if (!err) {
                    exports.boxen = collection;
                }
            });
            db.collection('control', function(err, collection) {
                if (!err) {
                    exports.control = collection;
                    collection.findOne({param:'master'}, function(err, item) {
                        if (!item) {
                            console.log("initializing master control");
                            var doc =  { param:'master', state:{ led:'off', mute:'no' } };
                            collection.insert(doc, {w:1}, function(err, result) {} );
                        }
                    });
                }
            });
        }
        callback(err);
    });
};
