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
