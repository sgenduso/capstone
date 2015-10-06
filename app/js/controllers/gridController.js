app.controller('gridController', ['$scope', 'gameService', function ($scope, gameService) {
  $scope.gridSize=function (size) {
    return new Array(size);
  };

  $scope.clickedCoordinates = gameService.gameArray;

  $scope.pushCoordinates = function (x, y) {
    console.log('adding coordinates');
    console.log('(' + x + ', ' + y + ')');
    console.log(gameService.gameId);
    $scope.clickedCoordinates.$add([
      x, y
    ]);
    console.log($scope.clickedCoordinates);
  };


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
