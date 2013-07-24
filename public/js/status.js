function StatusCtrl($scope, socket) {

  $scope.boxen = [];

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

}
