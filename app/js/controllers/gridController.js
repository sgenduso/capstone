app.controller('gridController', ['$scope', 'gameService', '$firebaseObject', function ($scope, gameService, $firebaseObject) {

  $.event.props.push('dataTransfer');

  $scope.gridSize=function (size) {
    return new Array(size);
  };

  $scope.p1Board = gameService.gameObject;
  $scope.boardRows = [];
  $scope.boardCols = [];
  $scope.boardMapping = gameService.boardMapping;

  $scope.populateBoard = function (size) {
    $scope.p1Board.$loaded().then(function () {
      for (var i = 0; i < size; i++) {
        $scope.boardRows.push(gameService.boardMapping[i+1]);
        for (var j = 0; j < size; j++) {
          if (i === 0) {
            $scope.boardCols.push(Number(j+1));
          }
          var cell = gameService.boardMapping[i+1] + Number(j+1);
          var cellObj = gameService.gameRef.child(cell);
          cellObj.set({
            x: i+1,
            y: j+1,
            boat: cellObj.boat || false,
            hit: cellObj.hit || false,
            miss: cellObj.miss || false,
            sunk: cellObj.sunk || false
          });
         }
      }
    });
  };


  $scope.populateBoard(10);


$scope.dropped = function(dragEl, dropEls) {

      // this is your application logic, do whatever makes sense
      var drag = angular.element(dragEl);
      var drop = angular.element(dropEls);
      console.log(drop);
      // console.log(drag[0]);
      // console.log(drag[0].size);
      // console.log(drag[0].imgSrc);

      // console.log("Ship with size " + drag.attr('data-size') + " has been dropped on cell " + drop.attr("data-x") + ", " + drop.attr("data-y") + "!");
    };

}]);
