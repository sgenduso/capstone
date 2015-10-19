app.controller('gridController', ['$scope', 'gameService', '$firebaseObject', function ($scope, gameService, $firebaseObject) {

  $.event.props.push('dataTransfer');

  $scope.gridSize=function (size) {
    return new Array(size);
  };

  $scope.game = gameService.game;


  $scope.boardRows = [];
  $scope.boardCols = [];
  $scope.boardMapping = gameService.boardMapping;
  $scope.ships = gameService.ships;
  $scope.cellIds = [];
  $scope.p2CellIds = [];



  $scope.populateBoard = function (size) {
    $scope.game.$loaded().then(function () {

      $scope.p1CellHasBoat = function (cellId) {
          return gameService.p1CellHasBoat(cellId);
      };

      $scope.p2CellHasBoat = function (cellId) {
          return gameService.p2CellHasBoat(cellId);
      };

      $scope.p2CellHit = function (cellId) {
          return gameService.p2CellHit(cellId);
      };

      $scope.p2CellMiss = function (cellId) {
          return gameService.p2CellMiss(cellId);
      };

      $scope.p2ShipSunk = function (ship) {
          return gameService.p2ShipSunk(ship);
      };

      $scope.p1CellHit = function (cellId) {
          return gameService.p1CellHit(cellId);
      };

      $scope.p1CellMiss = function (cellId) {
          return gameService.p1CellMiss(cellId);
      };

      $scope.p1ShipSunk = function (ship) {
          return gameService.p1ShipSunk(ship);
      };
      $scope.shipOnBoard = function (ship) {
        return gameService.shipOnBoard(ship);
      };


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
              x: j+1,
              y: i+1,
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
              x: j+1,
              y: i+1,
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
          size: 0,
          hits: 0,
          sunk: false,
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
        });
    });

    //POPULATE PLAYER 2 SHIPS
    $scope.ships.forEach(function (ship) {
      if ($scope.game.p2Ships === undefined) {
        $scope.game.p2Ships = {};
        // $scope.game.$save();
      }
      if ($scope.game.p2Ships[ship] === undefined) {
        if (ship === 'carrier') {
          $scope.game.p2Ships[ship] = {
            placed: true,
            size: 5,
            hits: 0,
            sunk: false,
            cells: {
              0: "p2-B2",
              1: "p2-C2",
              2: "p2-D2",
              3: "p2-E2",
              4: "p2-F2",
            }
          };
          $scope.game.p2Board['p2-B2'].boat = 'carrier';
          $scope.game.p2Board['p2-C2'].boat = 'carrier';
          $scope.game.p2Board['p2-D2'].boat = 'carrier';
          $scope.game.p2Board['p2-E2'].boat = 'carrier';
          $scope.game.p2Board['p2-F2'].boat = 'carrier';
        }
        else if (ship ==='battleship') {
          $scope.game.p2Ships[ship] = {
            placed: true,
            size: 4,
            hits: 0,
            sunk: false,
            cells: {
              0: "p2-J6",
              1: "p2-J7",
              2: "p2-J8",
              3: "p2-J9",
              4: false,
            }
          };
          $scope.game.p2Board['p2-J6'].boat = 'battleship';
          $scope.game.p2Board['p2-J7'].boat = 'battleship';
          $scope.game.p2Board['p2-J8'].boat = 'battleship';
          $scope.game.p2Board['p2-J9'].boat = 'battleship';
        }
        else if (ship ==='destroyer') {
          $scope.game.p2Ships[ship] = {
            placed: true,
            size: 4,
            hits: 0,
            sunk: false,
            cells: {
              0: "p2-E8",
              1: "p2-F8",
              2: "p2-G8",
              3: "p2-H8",
              4: false,
            }
          };
          $scope.game.p2Board['p2-E8'].boat = 'destroyer';
          $scope.game.p2Board['p2-F8'].boat = 'destroyer';
          $scope.game.p2Board['p2-G8'].boat = 'destroyer';
          $scope.game.p2Board['p2-H8'].boat = 'destroyer';
        }
        else if (ship ==='submarine') {
          $scope.game.p2Ships[ship] = {
            placed: true,
            size: 3,
            hits: 0,
            sunk: false,
            cells: {
              0: "p2-A1",
              1: "p2-A2",
              2: "p2-A3",
              3: false,
              4: false,
            }
          };
          $scope.game.p2Board['p2-A1'].boat = 'submarine';
          $scope.game.p2Board['p2-A2'].boat = 'submarine';
          $scope.game.p2Board['p2-A3'].boat = 'submarine';
        }
        else if (ship ==='patrol') {
          $scope.game.p2Ships[ship] = {
            placed: true,
            size: 2,
            hits: 0,
            sunk: false,
            cells: {
              0: "p2-E5",
              1: "p2-E6",
              2: false,
              3: false,
              4: false,
            }
          };
          $scope.game.p2Board['p2-E5'].boat = 'patrol';
          $scope.game.p2Board['p2-E6'].boat = 'patrol';
        }

      }
      $scope.game.$save()
      .then(function () {
      });
    });

        });


  };


  $scope.populateBoard(10);

//CLEAR ALL SHIPS, HITS, AND MISSES FROM BOARD
$scope.reset = function () {
  for (var p1Cell in $scope.game.p1Board) {
    $scope.game.p1Board[p1Cell].boat = false;
    $scope.game.p1Board[p1Cell].hit = false;
    $scope.game.p1Board[p1Cell].miss = false;
    $scope.game.p1Board[p1Cell].sunk = false;
  }
  for (var p2Cell in $scope.game.p2Board) {
    $scope.game.p2Board[p2Cell].hit = false;
    $scope.game.p2Board[p2Cell].miss = false;
    $scope.game.p2Board[p2Cell].sunk = false;
  }
  $scope.ships.forEach(function (ship) {
    $scope.game.p1Ships[ship].placed = false;
    $scope.game.p1Ships[ship].hits = 0;
    $scope.game.p1Ships[ship].sunk = false;
    $scope.game.p2Ships[ship].hits = 0;
    $scope.game.p2Ships[ship].sunk = false;
    for (var key in $scope.game.p1Ships[ship].cells) {
      $scope.game.p1Ships[ship].cells[key] = false;
    }
  });
  $scope.game.$save();
};


$scope.previousCells = gameService.previousCells;

//ROTATE HORIZONTAL TO VERTICAL
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

//ROTATE VERTICAL TO HORIZONTAL
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

//DO ALL THE THINGS!
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
        $(drop[0]).css('cursor', 'pointer');
          $scope.game.p1Ships[drag.ship].placed = true;
          $scope.game.p1Ships[drag.ship].size = drag.size;
        $.each(drop,function (index, cell) {
          $scope.game.p1Board[$(this).attr('id')].boat = $scope.game.p1Board[$(this).attr('id')].boat || drag.ship;
          $scope.game.p1Ships[drag.ship].cells[index] = $(this).attr('id');
          $scope.game.$save();
        });
        $('#'+drag.ship).css('opacity', '.2');
      }
    };

//THINGS THAT HAPPEN WHEN USER CLICKS ENEMY BOARD
var nextTarget;
$scope.attack = function ($event) {

  $scope.messages = $scope.messages || [];
  var messages = $('#messages')[0];

  //scroll to bottom of messages
  var scrollDown = function () {
    messages.scrollTop = messages.scrollHeight;
  };

  //get cell id by x and y coords
  var getCellIdByCoords = function (x, y) {
    return $('td[data-x=' + x + '][data-y=' + y + ']').attr('id');
  };

  var directions = ['up', 'down', 'left', 'right'];

  //ATTACK ENEMY BOARD
  var cellId = $event.currentTarget.id;
  //only do stuff if the cell hasn't already been targeted
  if ($scope.game.p2Board[cellId].hit === false && $scope.game.p2Board[cellId].miss === false && gameService.allShipsPlaced()) {
    if ($scope.game.p2Board[cellId].boat) {
      // $('#bomb').play();
      var boat = $scope.game.p2Board[cellId].boat;
      $scope.game.p2Board[cellId].hit = true;
      $scope.game.p2Ships[boat].hits++;
      $scope.messages.push('You hit an enemy ship!');
      scrollDown();

      if ($scope.game.p2Ships[boat].hits == $scope.game.p2Ships[boat].size) {
        $scope.game.p2Ships[boat].sunk = true;
        $scope.game.p2Board[cellId].sunk = true;
        $scope.game.$save();
        $scope.messages.push('You sunk the enemy\'s ' + boat + '!');
        scrollDown();
        if (gameService.p1Won()) {
          alert('YOU WON!');

        }
      }
      $scope.game.$save();
    } else {
      // $('#splash').play();
      $scope.game.p2Board[cellId].miss = true;
      $scope.game.$save();
      $scope.messages.push('You missed.');
      scrollDown();
    }

    //CPU ATTACKS USER BACK
    if (gameService.p1Won()) {
      $scope.reset();
    } else {
      console.log('next target from prev move: ', nextTarget);
      var targetCells = gameService.getTargetCells();
      var target;
      if (nextTarget === null || nextTarget === undefined){
        target = targetCells[gameService.randBetween(0, targetCells.length-1)];
      } else {
        target = nextTarget.cell;
      }
      console.log('target for this attack: ', target);
      if ($scope.game.p1Board[target].boat) {
        // $('#bomb').play();
        var attackBoat = $scope.game.p1Board[target].boat;
        $scope.game.p1Board[target].hit = true;
        $scope.game.p1Ships[attackBoat].hits++;

        // CHOOSE NEXT TARGET
        var thisX = $scope.game.p1Board[target].x;
        var thisY = $scope.game.p1Board[target].y;
        console.log('this attack\'s x val: ', thisX);
        console.log('this attack\'s y val: ', thisY);

        var nextCellUp = {cell: getCellIdByCoords(thisX, (Number(thisY)-1)), direction: 'up'};
        var nextCellDown = {cell: getCellIdByCoords(thisX, (Number(thisY)+1)), direction: 'down'};
        var nextCellLeft = {cell: getCellIdByCoords((Number(thisX)-1), thisY), direction: 'left'};
        var nextCellRight = {cell: getCellIdByCoords((Number(thisX)+1), thisY), direction: 'right'};

        var possibleTargets = [nextCellUp, nextCellDown, nextCellLeft, nextCellRight];
        console.log(possibleTargets);
        var chooseTarget = function () {
          for (var i = 0; i < possibleTargets.length; i++) {
            console.log(possibleTargets[i].cell);
            console.log($scope.game.p1Board[possibleTargets[i].cell]);
            if (possibleTargets[i].cell && $scope.game.p1Board[possibleTargets[i].cell].hit === false && $scope.game.p1Board[possibleTargets[i].cell].miss === false) {
              return possibleTargets[i];
            }
          }
        };

        nextTarget = chooseTarget();
        console.log(nextTarget);

        // LOG MOVE IN MESSAGES
        $scope.messages.push('Your ' + attackBoat + ' was hit!');
        scrollDown();
        if ($scope.game.p1Ships[attackBoat].hits == $scope.game.p1Ships[attackBoat].size) {
          $scope.game.p1Ships[attackBoat].sunk = true;
          $scope.game.p1Board[target].sunk = true;
          $scope.game.$save();
          nextTarget = null;
          $scope.messages.push('Your ' + attackBoat + ' was sunk!');
          scrollDown();
          if (gameService.p2Won()) {
            alert('DOH! YOU LOST \:\(');
            $scope.reset();
          }
        } else {

        }
        $scope.game.$save();
      } else {
        // $('#splash').play();
        $scope.game.p1Board[target].miss = true;
        $scope.game.$save();
        $scope.messages.push('Enemy missed.');
        scrollDown();
        nextTarget = null;
      }
    }
  }

};

}]);
