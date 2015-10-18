app.controller('gridController', ['$scope', 'gameService', '$firebaseObject', function ($scope, gameService, $firebaseObject) {

  $.event.props.push('dataTransfer');

  $scope.gridSize=function (size) {
    return new Array(size);
  };

  $scope.game = gameService.fullGameObject;
  $scope.p1Board = gameService.p1BoardObject;
  $scope.p2Board = gameService.p2BoardObject;
  $scope.p1ShipsOnBoard = gameService.p1ShipsObject;
  $scope.p2ShipsOnBoard = gameService.p2ShipsObject;
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
    $scope.game.$loaded().then(function () {



      //POPULATE PLAYER 1 SHIPS
      $scope.ships.forEach(function (ship) {
        if ($scope.game.p1ships === undefined) {
          $scope.game.p1ships = {};
          $scope.game.$save();
        }
        if ($scope.game.p1ships[ship] === undefined) {
          $scope.game.p1ships[ship] = {
            placed: false,
            cells: {
              0: false,
              1: false,
              2: false,
              3: false,
              4: false,
            }
          };
        }
          $scope.game.$save()
          .then(function () {
            console.log('OBJECT SAVED');
          });
      });

    // });

    // $scope.p1Board.$loaded().then(function () {
    //POPULATE BOTH BOARDS
    if ($scope.game.p1board === undefined) {
      $scope.game.p1board = {};
    }
    if ($scope.game.p2board === undefined) {
      $scope.game.p2board = {};
    }
      //POPULATE ROWS AND COLUMNS
      for (var i = 0; i < size; i++) {
        $scope.boardRows.push(gameService.boardMapping[i+1]);
        for (var j = 0; j < size; j++) {
          if (i === 0) {
            $scope.boardCols.push(Number(j+1));
          }

          //POPULATE PLAYER 1 BOARD
          var p1Cell = gameService.boardMapping[i+1] + Number(j+1);
          if ($scope.game.p1board[p1Cell] === undefined) {
            $scope.game.p1board[p1Cell] = {
              x: i+1,
              y: j+1,
              boat: false,
              hit:  false,
              miss: false,
              sunk: false
            };
            $scope.game.$save();
          $scope.cellIds.push(p1Cell);
          }

          //POPULATE PLAYER 2 BOARD
          var p2Cell = 'p2-' + gameService.boardMapping[i+1] + Number(j+1);
          if ($scope.game.p1board[p2Cell] === undefined) {
            $scope.game.p1board[p2Cell] = {
              x: i+1,
              y: j+1,
              boat: false,
              hit:  false,
              miss: false,
              sunk: false
            };
            $scope.game.$save();
          $scope.cellIds.push(p2Cell);
          }
      }
    }

        });



          // $scope.game.p1ships[ship]
          // var p1ShipObj = gameService.p1ShipsRef.child(ship);
          // p1ShipObj.set({
          //   placed: $scope.p1ShipsOnBoard[ship] === undefined ? false : $scope.p1ShipsOnBoard[ship].placed,
          //   cells: $scope.p1ShipsOnBoard[ship] === undefined ? false : $scope.p1ShipsOnBoard[ship].cells
          // });
          // var cellsObj = p1ShipObj.child('cells');
          // // console.log(gameService);
          //   cellsObj.set({
          //     0: $scope.p1ShipsOnBoard[ship].cells[0] || false,
          //     1: $scope.p1ShipsOnBoard[ship].cells[1] || false,
          //     2: $scope.p1ShipsOnBoard[ship].cells[2] || false,
          //     3: $scope.p1ShipsOnBoard[ship].cells[3] || false,
          //     4: $scope.p1ShipsOnBoard[ship].cells[4] || false,
          //   });


        // $scope.ships.forEach(function (ship) {
        //   var p1ShipObj = gameService.p1ShipsRef.child(ship);
        //   p1ShipObj.set({
        //     placed: $scope.p1ShipsOnBoard[ship] === undefined ? false : $scope.p1ShipsOnBoard[ship].placed,
        //     cells: $scope.p1ShipsOnBoard[ship] === undefined ? false : $scope.p1ShipsOnBoard[ship].cells
        //   });
        //   var cellsObj = p1ShipObj.child('cells');
        //   // console.log(gameService);
        //     cellsObj.set({
        //       0: $scope.p1ShipsOnBoard[ship].cells[0] || false,
        //       1: $scope.p1ShipsOnBoard[ship].cells[1] || false,
        //       2: $scope.p1ShipsOnBoard[ship].cells[2] || false,
        //       3: $scope.p1ShipsOnBoard[ship].cells[3] || false,
        //       4: $scope.p1ShipsOnBoard[ship].cells[4] || false,
        //     });
        // });

        //POPULATE PLAYER 2 SHIPS
        // var carrier = gameService.p2ShipsRef.child('carrier');
        // carrier.set({
        //   placed: $scope.p2ShipsOnBoard.carrier  === undefined ? true : $scope.p2ShipsOnBoard.carrier.placed,
        //   cells: $scope.p2ShipsOnBoard.carrier === undefined ? false : $scope.p2ShipsOnBoard.carrier.cells,
        // });
        // var cellsObj = gameService.p2ShipsRef.child('carrier').child('cells');
        //   cellsObj.set({
        //     0: $scope.p2ShipsOnBoard.carrier.cells[0] || "p2-B2",
        //     1: $scope.p2ShipsOnBoard.carrier.cells[1] || "p2-C2",
        //     2: $scope.p2ShipsOnBoard.carrier.cells[2] || "p2-D2",
        //     3: $scope.p2ShipsOnBoard.carrier.cells[3] || "p2-E2",
        //     4: $scope.p2ShipsOnBoard.carrier.cells[4] || "p2-F2",
        //   });
        //   $scope.p2Board['p2-B2'] = 'carrier';
    // });
  };


  $scope.populateBoard(10);

  $scope.clearBoard = function () {
    $scope.cellIds.forEach(function (cell) {
      $scope.p1Board[cell].boat = false;
    });
    $scope.ships.forEach(function (ship) {
      $scope.p1ShipsOnBoard[ship].placed = false;
      for (var key in $scope.p1ShipsOnBoard[ship].cells) {
        $scope.p1ShipsOnBoard[ship].cells[key] = false;
      }
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
    $.each(rotatedCells, function (index, cell) {
      $scope.p1ShipsOnBoard[ship].cells[index] = $(this).attr('id');
      $scope.p1ShipsOnBoard.$save();
    });
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
$.each(rotatedCells, function (index, cell) {
  $scope.p1ShipsOnBoard[ship].cells[index] = $(this).attr('id');
  $scope.p1ShipsOnBoard.$save();
});
$(dropCells[0]).click({dropCells: rotatedCells, ship: ship, size: size}, $scope.rotateToVert);
};

$scope.dropped = function(dragEl, dropEls) {
      //set drag equal to ship info, drop equal to cells ship is being dropped into
      var drag = angular.element(dragEl)[0];
      var drop = angular.element(dropEls);

      $.each(drop, function (index, cell) {
        $(this).children().removeClass('wb-over');
      });

      if(gameService.allSpacesFree(drop) && !gameService.shipOnBoard(drag.ship) && gameService.roomOnBoard(drop.length, drag.size)){
        $(drop[0]).click({dropCells: drop, ship: drag.ship, size: drag.size}, $scope.rotateToVert);
          $scope.p1ShipsOnBoard[drag.ship].placed = true;
        $.each(drop,function (index, cell) {
          $scope.p1Board[$(this).attr('id')].boat = $scope.p1Board[$(this).attr('id')].boat || drag.ship;
          $scope.p1ShipsOnBoard[drag.ship].cells[index] = $(this).attr('id');
          $scope.p1Board.$save();
          $scope.p1ShipsOnBoard.$save();
        });
        $('#'+drag.ship).css('opacity', '.2');
      }
    };

  $scope.attack = function ($event) {
    console.log($event.currentTarget.id);
  };

}]);
