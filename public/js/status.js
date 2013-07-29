function StatusCtrl($scope, socket) {

  $scope.boxen = [];
  $scope.selected = null;

  socket.on('hello', function(data) {
    socket.emit('get_status', {});
  });

  socket.on('status', function(data) {
    $scope.boxen = data;
  });

  $scope.addBoxen = function() {
    $scope.todos.push({text:$scope.todoText, done:false});
    $scope.todoText = '';
  };

  $scope.rowClass = function(box) {
    return (box.mute == "yes") ? "error" : "";
  };

  $scope.muteStateSymbol = function(box) {
    return (box.mute == "yes") ? "icon-volume-off" : "icon-volume-up";
  };

  $scope.muteStateDesiredSymbol = function(box) {
    return (box.desired.mute == "yes") ? "icon-volume-off" : "icon-volume-up";
  };

  $scope.getAudioState = function(box) {
    return (box.mute == "yes") ? "disabled" : "enabled";
  };

  $scope.ledStateClass = function(box) {
    return (box.led == "on" ) ? "" : "offstate";
  };

  $scope.ledStateDesiredClass = function(box) {
    return (box.desired.led == "on" ) ? "" : "offstate";
  };

  $scope.edit = function(box) {
    console.log("XXX", box);
    $scope.selected = box;
  };

  $scope.selectedTitle = function() {
    if ($scope.selected) {
      return $scope.selected.id;
    } else {
      return "no selection";
    }
  };

  $scope.formEditClass = function() {
    return ($scope.selected) ? "" : "hidden";
  };

  $scope.getSelection = function() {
    return $scope.selected;
  };

}
