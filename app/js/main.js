var app = angular.module('warboat', ['ui.router', 'ui.grid', 'firebase']);

app.config(function ($stateProvider, $locationProvider) {
  $stateProvider
  .state('home', {
      url: '/',
      templateUrl: './partials/home.html'
    });

  $locationProvider.html5Mode(true);
});

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

app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    var randomId = Math.round(Math.random() * 100000000);
    var ref = new Firebase("https://incandescent-fire-9342.firebaseio.com/game/" + randomId);

    // this uses AngularFire to create the synchronized array
    return {
      gameId: randomId,
      gameArray: $firebaseArray(ref)
    };
  }
]);

