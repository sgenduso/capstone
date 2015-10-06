app.controller('gridController', ['$scope', 'gameService', '$firebaseObject', function ($scope, gameService, $firebaseObject) {

  $scope.gridSize=function (size) {
    return new Array(size);
  };

  $scope.p1Board = gameService.gameObject;
  $scope.boardMapping = gameService.boardMapping;

  $scope.populateBoard = function (size) {
    $scope.p1Board.$loaded().then(function () {
      for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
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


//   $scope.gridOptions = {
//     enableSorting: false,
//     showHeader: false,
//     data: [
//     {
//         pos: "Cox",
//         "lastName": "Carney",
//         "company": "Enormo",
//         "employed": true
//     },
//
// ]
// };
}]);
