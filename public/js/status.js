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
    return (box && (box.mute == "yes")) ? "error" : "";
  };

  $scope.muteStateSymbol = function(box) {
    return (box && (box.mute == "yes")) ? "icon-volume-off" : "icon-volume-up";
  };

  $scope.muteStateDesiredSymbol = function(box) {
    return (box && (box.desired.mute == "yes")) ? "icon-volume-off" : "icon-volume-up";
  };

  $scope.getAudioState = function(box) {
    return (box && (box.mute == "yes")) ? "disabled" : "enabled";
  };

  $scope.ledStateClass = function(box) {
    return (box && (box.led == "on" )) ? "" : "offstate";
  };

  $scope.ledStateDesiredClass = function(box) {
    return (box && (box.desired.led == "on")) ? "" : "offstate";
  };

  $scope.edit = function(box) {
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


function MasterLedCtrl($scope, socket) {

  $scope.desiredState = null;

  // This is required for bm-modal
  $scope.dialogIsActive = false;

  $scope.setAllOn = function() {
    $scope.desiredState = "ON";
    $scope.dialogIsActive = true;
  };

  $scope.setAllOff = function() {
    $scope.desiredState = "OFF";
    $scope.dialogIsActive = true;
  };

  $scope.commit = function() {
    console.log("server turn all LEDs " + $scope.desiredState);
    socket.emit('led_ctrl', { state: $scope.desiredState });
    $scope.desiredState = null;
    $scope.dialogIsActive = false;
  };

}
