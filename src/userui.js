exports.status = function(req, res) {
    // TODO: how to get server url out of node?
    res.render('status.jade',
               {'title':'your momma',
                'server_url':'http://localhost:5000'});
};

exports.fake_data = function() {
  var data = [
    { id:'123ABC',
      led:'off',
      uptime:'0d 0h 10m 13s',
      mute:'no' },
    { id:'456ABC',
      led:'on',
      uptime:'0d 0h 10m 13s',
      mute:'no' },
    { id:'789ABC',
      led:'on',
      uptime:'0d 0h 10m 13s',
      mute:'no' }];
    return data;
}
