app.controller('gridController', ['$scope', 'gameService', '$firebaseObject', function ($scope, gameService, $firebaseObject) {

  $.event.props.push('dataTransfer');

  $scope.gridSize=function (size) {
    return new Array(size);
  };

  $scope.p1Board = gameService.p1BoardObject;
  $scope.p2Board = gameService.p2BoardObject;
  $scope.p1ShipsOnBoard = gameService.p1ShipsObject;
  // gameService.p1BoardObject.$bindTo($scope, p1Board);
  $scope.p1CellHasBoat = function (cellId) {
      return gameService.p1CellHasBoat(cellId);
  };
  $scope.shipOnBoard = function (ship) {
    return gameService.shipOnBoard(ship);
  };

  $scope.boardRows = [];
  $scope.boardCols = [];
  $scope.boardMapping = gameService.boardMapping;
  $scope.ships = gameService.ships;
  $scope.cellIds = [];
  $scope.p2CellIds = [];



  $scope.populateBoard = function (size) {
    $scope.p1Board.$loaded().then(function () {
      for (var i = 0; i < size; i++) {
        $scope.boardRows.push(gameService.boardMapping[i+1]);
        for (var j = 0; j < size; j++) {
          if (i === 0) {
            $scope.boardCols.push(Number(j+1));
          }
          //POPULATE PLAYER 1 BOARD
          var p1Cell = gameService.boardMapping[i+1] + Number(j+1);
          var p1CellObj = gameService.p1BoardRef.child(p1Cell);
          p1CellObj.set({
            x: i+1,
            y: j+1,
            boat: $scope.p1Board[p1Cell] === undefined ? false : $scope.p1Board[p1Cell].boat,
            hit:  p1CellObj.hit || false,
            miss: p1CellObj.miss || false,
            sunk: p1CellObj.sunk || false
          });
          $scope.cellIds.push(p1Cell);

          //POPULATE ENEMY BOARD
          var p2Cell = 'p2-' + gameService.boardMapping[i+1] + Number(j+1);
          var p2CellObj = gameService.p2BoardRef.child(p2Cell);
          p2CellObj.set({
            x: i+1,
            y: j+1,
            boat: $scope.p2Board[p2Cell] === undefined ? false : $scope.p2Board[p2Cell].boat,
            hit:  p2CellObj.hit || false,
            miss: p2CellObj.miss || false,
            sunk: p2CellObj.sunk || false
          });
          $scope.p2CellIds.push(p2Cell);
         }
      }

        //POPULATE PLAYER 1 SHIPS
        $scope.ships.forEach(function (ship) {
          var p1ShipObj = gameService.p1ShipsRef.child(ship);
          p1ShipObj.set({
            placed: $scope.p1ShipsOnBoard[ship] === undefined ? false : $scope.p1ShipsOnBoard[ship].placed
          });
        });
    });
  };


  $scope.populateBoard(10);

  $scope.clearBoard = function () {
    $scope.cellIds.forEach(function (cell) {
      $scope.p1Board[cell].boat = false;
    });
    $scope.ships.forEach(function (ship) {
      $scope.p1ShipsOnBoard[ship] = false;
    });
    $scope.p1Board.$save();
    $scope.p1ShipsOnBoard.$save();
  };

  $scope.popEnemyBoard = function () {
    return gameService.popEnemyBoard();
    // var cellIds = $scope.p2CellIds;
    // var availableCells = $scope.p2CellIds;
    // console.log(gameService.quad1);
  };

$scope.previousCells = gameService.previousCells;

$scope.rotateToVert = function (e) {
  var dropCells = e.data.dropCells;
  var ship = e.data.ship;
  var size = e.data.size;
  var count = 0;
  var rotatedCells = [];

  $.each(dropCells, function (index, cell) {
    count ++;
    if (index > 0) {
      rotatedCells.push($('td[data-x=' + (Number(cell.dataset.x)- count + 1) + '][data-y=' + (Number(cell.dataset.y) + count - 1) + ']')[0]);
    }
  });
  if(gameService.allSpacesFree(rotatedCells) && gameService.roomOnBoard(rotatedCells.length+1, size)){
    $.each(dropCells, function (index, cell) {
      if (index > 0) {
        $scope.p1Board[(rotatedCells[index-1]).id].boat = ship;
        $scope.p1Board[$(this).attr('id')].boat = false;
        $scope.p1Board.$save();
      }
    });
}
$(dropCells[0]).unbind('click');
rotatedCells.unshift(dropCells[0]);
$(dropCells[0]).click({dropCells: rotatedCells, ship: ship, size: size}, $scope.rotateToHor);

};

$scope.rotateToHor = function (e) {
  var dropCells = e.data.dropCells;
  var ship = e.data.ship;
  var size = e.data.size;
  var count = 0;
  var rotatedCells = [];

  $.each(dropCells, function (index, cell) {
    count ++;
    if (index > 0) {
      rotatedCells.push($('td[data-x=' + (Number(cell.dataset.x)+ count - 1) + '][data-y=' + (Number(cell.dataset.y) - count + 1) + ']')[0]);
    }
  });
  if(gameService.allSpacesFree(rotatedCells) && gameService.roomOnBoard(rotatedCells.length+1, size)){
    $.each(dropCells, function (index, cell) {
      if (index > 0) {
        $scope.p1Board[(rotatedCells[index-1]).id].boat = ship;
        $scope.p1Board[$(this).attr('id')].boat = false;
        $scope.p1Board.$save();
      }
    });
}
$(dropCells[0]).unbind('click');
rotatedCells.unshift(dropCells[0]);
$(dropCells[0]).click({dropCells: rotatedCells, ship: ship, size: size}, $scope.rotateToVert);
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

      console.log(gameService.shipOnBoard(drag.ship));

      if(gameService.allSpacesFree(drop) && !gameService.shipOnBoard(drag.ship) && gameService.roomOnBoard(drop.length, drag.size)){
        $(drop[0]).click({dropCells: drop, ship: drag.ship, size: drag.size}, $scope.rotateToVert);
        $.each(drop,function (index, cell) {
          $scope.p1Board[$(this).attr('id')].boat = $scope.p1Board[$(this).attr('id')].boat || drag.ship;
          $scope.p1ShipsOnBoard[drag.ship].placed = true;
          $scope.p1ShipsOnBoard[drag.ship].cells = drop;
          $scope.p1Board.$save();
          $scope.p1ShipsOnBoard.$save();
        });
        $('#'+drag.ship).css('opacity', '.2');
      }
    };

}]);
