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

                    // Figure out LED and MUTE states
                    var muteState = "yes";
                    if (payload.mpd && payload.mpd.status) {
                        if (payload.mpd.status.state == "play") {
                            muteState = "no";
                        }
                    }
                    var ledState = (payload.led) ? "on" : "off";

                    var status = {};

                    // Get some infos from mpd:
                    if (payload.mpd) {
                        if (payload.mpd.status) {
                            // TODO: format this as Xd Xh Xm Xs
                            status.playElapsed = payload.mpd.status.elapsed; // seconds
                        }
                    }

                    // TODO: format this as Xd Xh Xm Xs
                    status.uptime = payload.uptime;

                    // Grab some infos from iwconfig
                    if (payload.net && payload.net.iwconfig) {
                        var clen = payload.net.iwconfig.length;
                        for(var i=0; i < clen; ++i) {
                            if (payload.net.iwconfig[i].match(/^Link/)) {
                                status.linkQuality = payload.net.iwconfig[i].split("=")[1];
                            }
                            if (payload.net.iwconfig[i].match(/^Signal/)) {
                                status.signalLevel = payload.net.iwconfig[i].split("=")[1];
                            }
                            if (payload.net.iwconfig[i].match(/^Noise/)) {
                                status.noiseLevel = payload.net.iwconfig[i].split("=")[1];
                            }
                        }
                    }

                    mongo.boxen.update({id:foundBox.id}, {$set:{lastcontact:new Date(),
                                                                lastmsg:payload,
                                                                status:status,
                                                                actual:{ led:ledState,
                                                                         mute:muteState }}},
                                       {w:1},
                                       function(err, result) {});

                    // Return the master state, unless state for this object
                    // was set after master.
                    mongo.control.findOne({param:'master'}, function(err, item) {
                        if (!err) {
                            if (foundBox.desired && foundBox.desired.ts) {
                                if (foundBox.desired.ts.getTime() >  item.state.led_ts.getTime()) {
                                    state = foundBox.desired;
                                } else {
                                    state = item.state;
                                }
                            } else {
                                state = item.state;
                            }

                            res.send(JSON.stringify(state));
                        }
                    });

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
