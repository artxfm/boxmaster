exports.status = function(req, res) {
    // TODO: how to get server url out of node?
    res.render('status.jade',
               {'title':'your momma',
                'server_url':'http://localhost:5000'});
};


// callback is called with array of box data.
//
exports.getBoxen = function(mongo, callback) {
    mongo.boxen.find().toArray(function(err, docs) {
        if (err) {
            console.log("mongo find error: ", err);
        } else {
            // Grab master control

            mongo.control.findOne({param:'master'}, function(err, master) {
                if (!err) {

                    var masterUpdateTime = 0;
                    if (master.state.led_ts) {
                        masterUpdateTime = master.state.led_ts.getTime();
                    }

                    // Note that the database ID values are sensitve since they
                    // are used by the boxes to send in updates, so we never
                    // send those to the UI we send uid value instead.
                    //
                    var data = [];
                    var dlen = docs.length;
                    for(var i=0; i < dlen; i++) {
                        var doc = docs[i];
                        var rec = {
                            id: doc.uid,
                            desired: doc.desired,
                        };

                        // Use master state unless box desired is more recent.

                        if (doc.desired && doc.desired.ts) {
                            if (doc.desired.ts.getTime() > masterUpdateTime) {
                                rec.desired = doc.desired;
                            } else {
                                rec.desired = { led: master.state.led };
                            }
                        } else {
                            // TODO: grab from master
                            rec.desired = { led: master.state.led };
                        }
                        if (doc.lastcontact) {
                            rec.lastcontact = doc.lastcontact;
                            rec.led = doc.actual.led;
                            rec.mute = doc.actual.mute;
                            rec.status = doc.status;
                        } else {
                            rec.lastcontact = "NEVER";
                            rec.status = {};
                        }
                        data.push(rec);
                    }
                    callback(data);
                }
            });
        }
    });
};


// Callback is called with any error, or null.
exports.setMasterLed = function(mongo, newstate, callback) {
    mongo.control.update( { param:'master' },
                          { $set:{ 'state.led':newstate,  'state.led_ts':new Date() } },
                          {w:1},
                          function(err, result) {
                              callback(err);
                          });
}





exports.fake_data = function() {
  var data = [
    { id:'123ABC',
      led:'off',
      uptime:'0d 0h 10m 13s',
      mute:'no',
      desired : {
        led:'off',
        mute:'no'
      }},
    { id:'456ABC',
      led:'on',
      uptime:'0d 0h 10m 13s',
      mute:'yes',
      desired : {
        led:'off',
        mute:'no'
      }},
    { id:'789ABC',
      led:'on',
      uptime:'0d 0h 10m 13s',
      mute:'no',
      desired : {
        led:'off',
        mute:'no'
      }}];
    return data;
}
