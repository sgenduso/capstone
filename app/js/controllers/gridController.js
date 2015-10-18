app.controller('gridController', ['$scope', 'gameService', '$firebaseObject', function ($scope, gameService, $firebaseObject) {

  $.event.props.push('dataTransfer');

  $scope.gridSize=function (size) {
    return new Array(size);
  };

  $scope.game = gameService.game;

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

      //POPULATE BOTH BOARDS
      if ($scope.game.p1Board === undefined) {
        $scope.game.p1Board = {};
      }
      if ($scope.game.p2Board === undefined) {
        $scope.game.p2Board = {};
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
          if ($scope.game.p1Board[p1Cell] === undefined) {
            $scope.game.p1Board[p1Cell] = {
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
          if ($scope.game.p2Board[p2Cell] === undefined) {
            $scope.game.p2Board[p2Cell] = {
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




      //POPULATE PLAYER 1 SHIPS
      $scope.ships.forEach(function (ship) {
        if ($scope.game.p1Ships === undefined) {
          $scope.game.p1Ships = {};
          $scope.game.$save();
        }
        if ($scope.game.p1Ships[ship] === undefined) {
          $scope.game.p1Ships[ship] = {
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

      //POPULATE PLAYER 2 SHIPS
      $scope.ships.forEach(function (ship) {
        if ($scope.game.p2Ships === undefined) {
          $scope.game.p2Ships = {};
          $scope.game.$save();
        }
        if ($scope.game.p2Ships[ship] === undefined) {
          if (ship === 'carrier') {
            $scope.game.p2Ships[ship] = {
              placed: true,
              cells: {
                0: "p2-B2",
                1: "p2-C2",
                2: "p2-D2",
                3: "p2-E2",
                4: "p2-F2",
              }
            };
            $scope.game.p2Board['p2-B2'] = 'carrier';
            $scope.game.p2Board['p2-C2'] = 'carrier';
            $scope.game.p2Board['p2-D2'] = 'carrier';
            $scope.game.p2Board['p2-E2'] = 'carrier';
            $scope.game.p2Board['p2-F2'] = 'carrier';
          }

        }
        $scope.game.$save()
        .then(function () {
          console.log($scope.game.p2Ships.carrier);
          console.log('OBJECT SAVED');
        });
      });

    });
  };




  $scope.populateBoard(10);

  //CLEAR ALL SHIPS FROM BOARD
  $scope.clearBoard = function () {
    $scope.cellIds.forEach(function (cell) {
      $scope.game.p1Board[cell].boat = false;
    });
    $scope.ships.forEach(function (ship) {
      $scope.game.p1Ships[ship].placed = false;
      for (var key in $scope.game.p1Ships[ship].cells) {
        $scope.game.p1Ships[ship].cells[key] = false;
      }
    });
    $scope.game.$save();
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
        $scope.game.p1Board[(rotatedCells[index-1]).id].boat = ship;
        $scope.game.p1Board[$(this).attr('id')].boat = false;
        $scope.game.$save();
      }
    });
  }
  $(dropCells[0]).unbind('click');
  rotatedCells.unshift(dropCells[0]);
  $.each(rotatedCells, function (index, cell) {
    $scope.game.p1Ships[ship].cells[index] = $(this).attr('id');
    $scope.game.$save();
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
        $scope.game.p1Board[(rotatedCells[index-1]).id].boat = ship;
        $scope.game.p1Board[$(this).attr('id')].boat = false;
        $scope.game.$save();
      }
    });
  }
  $(dropCells[0]).unbind('click');
  rotatedCells.unshift(dropCells[0]);
  $.each(rotatedCells, function (index, cell) {
    $scope.game.p1Ships[ship].cells[index] = $(this).attr('id');
    $scope.game.$save();
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

      //only drop if there is room on the board and the ship is not already on the board
      if(gameService.allSpacesFree(drop) && !gameService.shipOnBoard(drag.ship) && gameService.roomOnBoard(drop.length, drag.size)){
        $(drop[0]).click({dropCells: drop, ship: drag.ship, size: drag.size}, $scope.rotateToVert);
          $scope.game.p1Ships[drag.ship].placed = true;
        $.each(drop,function (index, cell) {
          $scope.game.p1Board[$(this).attr('id')].boat = $scope.game.p1Board[$(this).attr('id')].boat || drag.ship;
          $scope.game.p1Ships[drag.ship].cells[index] = $(this).attr('id');
          $scope.game.$save();
        });
        $('#'+drag.ship).css('opacity', '.2');
      }
    };

  $scope.attack = function ($event) {
    console.log($event.currentTarget.id);
  };

}]);
