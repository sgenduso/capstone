app.controller('gridController', ['$scope', 'gameService', '$firebaseObject', function ($scope, gameService, $firebaseObject) {

  $.event.props.push('dataTransfer');

  $scope.gridSize=function (size) {
    return new Array(size);
  };

  $scope.p1Board = gameService.gameObject;
  // gameService.gameObject.$bindTo($scope, p1Board);
  $scope.boardRows = [];
  $scope.boardCols = [];
  $scope.boardMapping = gameService.boardMapping;

  $scope.populateBoard = function (size) {
    // $scope.p1Board.$loaded().then(function () {
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
    // });
  };


  $scope.populateBoard(10);

$scope.previousCells = gameService.previousCells;

$scope.dropped = function(dragEl, dropEls) {
      //set drag equal to ship info, drop equal to cells ship is being dropped into
      var drag = angular.element(dragEl)[0];
      var drop = angular.element(dropEls);
      // console.log(drag);
      console.log('DRAG INFO: ');
      console.log(drag);
      console.log('DROP INFO: ');
      console.log(drop);

      // gameService.gameRef.child($(drop[0]).attr('id'))
      //   .set({
      //   boat: drag.ship,
      //   });
      $.each(drop,function (index, cell) {
        $scope.p1Board[$(this).attr('id')].boat = $scope.p1Board[$(this).attr('id')].boat || drag.ship;
        $scope.p1Board.$save();
      });
      console.log($scope.p1Board[$(drop[0]).attr('id')]);

      // $(drop[0]).attr('colspan', drag.size);
      // $(drop[0]).css('background-image', 'url(' + drag.imgSrc + ')');
      // $(drop[0]).css('background-size', 'contain');
      // $(drop[0]).css('background-repeat', 'no-repeat');
      // $(drop[0]).append("<img src='" + drag.imgSrc + "' width='100%'>");
    };

}]);
