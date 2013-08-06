var mongo = require('./mongo');

exports.hello = function(req, res) {
    // This is the box hello message. We only process hello messages
    // from boxes we know about.
    if (req.body) {
        if (req.body.id) {
            console.log("hello from box " + req.body.id);
            mongo.boxen.findOne({id:req.body.id}, function(err, item) {
                var foundBox = item;
                if (foundBox) {
                    var payload = req.body;
                    mongo.boxen.update({id:foundBox.id}, {$set:{lastcontact:new Date(),
                                                                lastmsg:payload,
                                                                actual:{ led:payload.led, mute:payload.mute }}},
                                       {w:1},
                                       function(err, result) {});
                    // return desired state back to box.  Generally we return master
                    // unless this box is marked as off master
                    var state = null;
                    if (foundBox.offMaster) {
                        state = foundBox.desired;
                    }
                    if (!state) {
                        // grab master...
                        mongo.control.findOne({param:'master'}, function(err, item) {
                            if (!err) {
                                state = item.state;
                                res.send(JSON.stringify(state));
                            }
                        });
                    } else {
                        res.send(JSON.stringify(state));
                    }
                } else {
                    res.status(404).send('box not found');
                }
            });
        } else {
            res.status(400).send('syntax error');
        }
    } else {
        res.status(400).send('bad request');
    }
};
