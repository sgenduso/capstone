app.controller('gridController', ['$scope', 'gameService', '$firebaseObject', function ($scope, gameService, $firebaseObject) {

  $.event.props.push('dataTransfer');

  $scope.gridSize=function (size) {
    return new Array(size);
  };

  $scope.p1Board = gameService.boardObject;
  $scope.shipsOnBoard = gameService.shipsObject;
  // gameService.boardObject.$bindTo($scope, p1Board);
  $scope.cellHasBoat = function (cellId) {
      return gameService.cellHasBoat(cellId);
  };
  $scope.shipOnBoard = function (ship) {
    return gameService.shipOnBoard(ship);
  };

  $scope.boardRows = [];
  $scope.boardCols = [];
  $scope.boardMapping = gameService.boardMapping;
  $scope.ships = gameService.ships;
  $scope.cellIds = [];



  $scope.populateBoard = function (size) {
    $scope.p1Board.$loaded().then(function () {
      for (var i = 0; i < size; i++) {
        $scope.boardRows.push(gameService.boardMapping[i+1]);
        for (var j = 0; j < size; j++) {
          if (i === 0) {
            $scope.boardCols.push(Number(j+1));
          }
          var cell = gameService.boardMapping[i+1] + Number(j+1);
          var cellObj = gameService.boardRef.child(cell);
          cellObj.set({
            x: i+1,
            y: j+1,
            boat: $scope.p1Board[cell].boat || false,
            hit:  cellObj.hit || false,
            miss: cellObj.miss || false,
            sunk: cellObj.sunk || false
          });
          $scope.cellIds.push(cell);
         }
      }
    });

  };


  $scope.populateBoard(10);

  $scope.clearBoard = function () {
    $scope.cellIds.forEach(function (cell) {
      $scope.p1Board[cell].boat = false;
    });
    $scope.ships.forEach(function (ship) {
      $scope.shipsOnBoard[ship] = false;
    });
    $scope.p1Board.$save();
    $scope.shipsOnBoard.$save();
    // $('.ship').css('opacity', '1');
  };


$scope.previousCells = gameService.previousCells;

$scope.rotateToVert = function (e) {
  var startDirection = e.data.startDirection;
  var dropCells = e.data.dropCells;
  var count = 0;
  var rotatedCells = [];
  // $.each(dropCells, function (index, cell) {
  //   // console.log(count);
  //   if (index > 0) {
  //     if (startDirection === 'horizontal') {
  //       rotatedCells.push($('td[data-x=' + (Number($(this).attr('data-x'))-count) + '][data-y=' + (Number($(this).attr('data-y'))+count) + ']')[0]);
  //     } else{
  //       rotatedCells.push($('td[data-x=' + (Number($(this).attr('data-x'))+count) + '][data-y=' + (Number(e.attr('data-y'))-count) + ']')[0]);
  //     }
  //   }
  //   count++;
  // });
  // console.log(rotatedCells);
  console.log(dropCells);
  $.each(dropCells, function (index, cell) {
    // console.log(cell);
    // console.log(cell.dataset.x);
    // console.log(cell.dataset.y);
    // console.log(Number(cell.dataset.x)-count);
    // console.log(Number(cell.dataset.y)+count);
    // if (startDirection === 'horizontal') {
    count ++;
    // console.log($('td[data-x=' + (Number(cell.dataset.x)-count) + ']')[0]);
    console.log('rotated cell : ');
    console.log($('td[data-x=' + (Number(cell.dataset.x)-count) + '][data-y=' + (Number(cell.dataset.y)+count) + ']')[0]);
    if (index > 0) {
      rotatedCells.push($('td[data-x=' + (Number(cell.dataset.x)- count + 1) + '][data-y=' + (Number(cell.dataset.y) + count - 1) + ']')[0]);
    }
    // } else {
    //   return $('td[data-x=' + (Number(val.dataset.x)+count) + '][data-y=' + (Number(val.dataset.y)-count) + ']')[0];
    // }
  });
  console.log('rotated cells: ');
    console.log(rotatedCells);
  if(gameService.allSpacesFree(rotatedCells) && gameService.roomOnBoard(rotatedCells.length+1, e.data.size)){
    console.log('in rotate function');
    console.log(rotatedCells);
  // if (startDirection === 'horizontal') {
    // var count = 1;
    $.each(dropCells, function (index, cell) {
      if (index > 0) {
      // var swappedCell = $('td[data-x=' + (Number($(this).attr('data-x'))-count) + '][data-y=' + (Number($(this).attr('data-y'))+count) + ']');
      // console.log(rotatedCells[index-1]);
      // console.log(rotatedCells[index-1].attributes);
      // console.log(rotatedCells[index-1].id);

      $scope.p1Board[(rotatedCells[index-1]).id].boat = e.data.ship;
      $scope.p1Board[$(this).attr('id')].boat = false;
      $scope.p1Board.$save();
      // count++;
      }
    });
    // e.data.startDirection = 'vertical';
    // count = 1;
  // } else {
  //   // var count = 1;
  //   $.each(dropCells, function (index, cell) {
  //     if (index > 0) {
  //     // var swappedCell = $('td[data-x=' + (Number($(this).attr('data-x'))+count) + '][data-y=' + (Number($(this).attr('data-y'))-count) + ']');
  //     $scope.p1Board[(rotatedCells[index-1]).id].boat = e.data.ship;
  //     $scope.p1Board[$(this).attr('id')].boat = false;
  //     $scope.p1Board.$save();
  //     // count++;
  //     }
  //   });
  //   e.data.startDirection = 'horizontal';
  //   count = 1;
  // }
  // console.log(e.data.startDirection);
  // console.log(e.data.dropCells);
}
};

$scope.dropped = function(dragEl, dropEls) {
      //set drag equal to ship info, drop equal to cells ship is being dropped into
      var drag = angular.element(dragEl)[0];
      var drop = angular.element(dropEls);
      // console.log(drag);
      // console.log('DRAG INFO: ');
      // console.log(drag);
      // console.log('DROP INFO: ');
      // console.log(drop);

      $.each(drop, function (index, cell) {
        $(this).children().removeClass('wb-over');
      });


      if(gameService.allSpacesFree(drop) && !gameService.shipOnBoard(drag.ship) && gameService.roomOnBoard(drop.length, drag.size)){
        $(drop[0]).click({dropCells: drop, ship: drag.ship, size: drag.size, startDirection: 'horizontal'}, $scope.rotateToVert);
        $.each(drop,function (index, cell) {
          $scope.p1Board[$(this).attr('id')].boat = $scope.p1Board[$(this).attr('id')].boat || drag.ship;
          $scope.shipsOnBoard[drag.ship] = true;
          $scope.p1Board.$save();
          $scope.shipsOnBoard.$save();
        });
        $('#'+drag.ship).css('opacity', '.2');
      }
    };

}]);
