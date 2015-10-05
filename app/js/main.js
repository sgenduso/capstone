var app = angular.module('warboat', ['ui.router', 'ui.grid', 'firebase']);

app.config(function ($stateProvider, $locationProvider) {
  $stateProvider
  .state('home', {
      url: '/',
      templateUrl: './partials/home.html'
    });

  $locationProvider.html5Mode(true);
});

app.controller('gridController', ['$scope', function ($scope) {
  $scope.gridSize=function (size) {
    return new Array(size);
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

