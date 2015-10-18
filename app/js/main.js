var app = angular.module('warboat', ['ui.router', 'ui.grid', 'firebase']);

app.config(function ($stateProvider, $locationProvider) {
  $stateProvider
  .state('home', {
      url: '/',
      templateUrl: './partials/home.html',
      controller: 'gridController'
    });

  $locationProvider.html5Mode(true);
});

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


    // $scope.p1Board.$loaded().then(function () {
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

    $scope.ships.forEach(function (ship) {
      if ($scope.game.p2Ships === undefined) {
        $scope.game.p2Ships = {};
        // $scope.game.$save();
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
        else if (ship ==='battleship') {
          $scope.game.p2Ships[ship] = {
            placed: true,
            cells: {
              0: "p2-J6",
              1: "p2-J7",
              2: "p2-J8",
              3: "p2-J9",
              4: false,
            }
          };
          $scope.game.p2Board['p2-J6'] = 'battleship';
          $scope.game.p2Board['p2-J7'] = 'battleship';
          $scope.game.p2Board['p2-J8'] = 'battleship';
          $scope.game.p2Board['p2-J9'] = 'battleship';
        }
        else if (ship ==='destroyer') {
          $scope.game.p2Ships[ship] = {
            placed: true,
            cells: {
              0: "p2-E8",
              1: "p2-F8",
              2: "p2-G8",
              3: "p2-H8",
              4: false,
            }
          };
          $scope.game.p2Board['p2-E8'] = 'destroyer';
          $scope.game.p2Board['p2-F8'] = 'destroyer';
          $scope.game.p2Board['p2-G8'] = 'destroyer';
          $scope.game.p2Board['p2-H8'] = 'destroyer';
        }
        else if (ship ==='submarine') {
          $scope.game.p2Ships[ship] = {
            placed: true,
            cells: {
              0: "p2-A1",
              1: "p2-A2",
              2: "p2-A3",
              3: false,
              4: false,
            }
          };
          $scope.game.p2Board['p2-A1'] = 'submarine';
          $scope.game.p2Board['p2-A2'] = 'submarine';
          $scope.game.p2Board['p2-A3'] = 'submarine';
        }
        else if (ship ==='patrol') {
          $scope.game.p2Ships[ship] = {
            placed: true,
            cells: {
              0: "p2-E5",
              1: "p2-E6",
              2: false,
              3: false,
              4: false,
            }
          };
          $scope.game.p2Board['p2-E5'] = 'patrol';
          $scope.game.p2Board['p2-E6'] = 'patrol';
        }

      }
      $scope.game.$save()
      .then(function () {
        console.log($scope.game.p2Ships);
        console.log(ship + ' SAVED');
      });
    });

        });


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

app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    var randomId = Math.round(Math.random() * 1000000000);
    randomId = 1;
    var ref = "https://incandescent-fire-9342.firebaseio.com/game/" + randomId;
    var fullGameRef = new Firebase(ref);
    var game = $firebaseObject(fullGameRef);


    var boardMapping = {
      1:'A',
      2:'B',
      3:'C',
      4:'D',
      5:'E',
      6:'F',
      7:'G',
      8:'H',
      9:'I',
      10:'J',
      11:'K',
      12:'L',
      13:'M',
      14:'N',
      15:'O',
      16:'P',
      17:'Q',
      18:'R',
      19:'S',
      20:'T',
      21:'U',
      22:'V',
      23:'W',
      24:'X',
      25:'Y',
      26:'Z'
    };

    var quad1 = ["p2-A1", "p2-A2", "p2-A3", "p2-A4", "p2-A5", "p2-B1", "p2-C1", "p2-D1", "p2-E1"];

    var quad2 = ["p2-A6", "p2-A7", "p2-A8", "p2-A9", "p2-A10", "p2-B6", "p2-B10", "p2-C6", "p2-C10", "p2-D6", "p2-D10", "p2-E6", "p2-E7", "p2-E8", "p2-E9", "p2-E10"];

    var quad3 = ["p2-F1", "p2-F2", "p2-F3", "p2-F4", "p2-F5", "p2-G1", "p2-G2", "p2-G3", "p2-G4", "p2-G5", "p2-H1", "p2-H2", "p2-H3", "p2-H4", "p2-H5", "p2-I1", "p2-I2", "p2-I3", "p2-I4", "p2-I5"];

    var quad4 = ["p2-F7", "p2-F8", "p2-F9", "p2-F10", "p2-G7", "p2-G8", "p2-G9", "p2-G10", "p2-H7", "p2-H8", "p2-H9", "p2-H10", "p2-I7", "p2-I8", "p2-I9", "p2-I10","p2-J7", "p2-J8", "p2-J9", "p2-J10"];

    var quad5 = ["p2-F6","p2-G6", "p2-H6", "p2-I6", "p2-J1", "p2-J2", "p2-J3", "p2-J4", "p2-J5", "p2-J6", "p2-J7", "p2-J8", "p2-J9", "p2-J10"];

    var ships = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrol'];

    var randBetween = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    //when trying to drop or rotate ship, check if those spaces are free
    var allSpacesFree = function (destCells) {
      console.log(destCells);
      for (var i = 0; i < destCells.length; i++) {
        if (this.game.p1Board[destCells[i].id].boat) {
          return false;
        }
      }
        return true;
    };

    //check if specified ship is already on the board
    var shipOnBoard = function (ship) {
      $('#'+ship).css('opacity', '');
      // if (p1ShipsObject[ship]) {
      //   return p1ShipsObject[ship].placed;
      // } else {
      //   return false;
      // }
      return this.game.p1Ships === undefined ? false : this.game.p1Ships[ship].placed;
    };

    //check the specified cell for a boat
    var p1CellHasBoat = function (cellId) {
        return this.game.p1Board[cellId].boat !== false;
    };
    //
    // var cellHasBoat = function (cellId, player) {
    //   console.log(this.game.p1Board[cellId]);
    //   console.log(this.game.p2Board[cellId]);
    //   // console.log(cellId);
    //   // console.log(player);
    //   if (player === 'p1') {
    //     return this.game.p1Board[cellId].boat !== false;
    //   } else {
    //     return this.game.p2Board[cellId].boat !== false;
    //   }
    // };

    //before dropping or placing a ship, check whether it would go off the board
    var roomOnBoard = function (destinationLength, shipLength) {
      return destinationLength == shipLength;
    };

    var popEnemyBoard = function () {
      var availableQuads = [quad1, quad2, quad3, quad4, quad5];
      var availableShips = ships;
      var directions = ['hor', 'vert'];
      var shipDir;
      var randomFirstShip = ships[randBetween(0,1)];
      var randomFirstCell = quad1[randBetween(0, quad1.length-1)];

      if (randomFirstCell === 'p2-A1') {
        shipDir = directions[randBetween(0,1)];
      } else if (this.game.p2Board[randomFirstCell].y === 1) {
        shipDir = 'hor';
      } else {
        shipDir = 'vert';
      }

      console.log('first ship: ', randomFirstShip);
      console.log('first cell: ', randomFirstCell);
      console.log('ship direction: ', shipDir);
      console.log('ship on cell before: ', this.game.p2Board[randomFirstCell].boat);
      this.game.p2Board[randomFirstCell].boat = randomFirstShip;
      this.game.p2Board.$save();
      console.log('ship on cell after: ', this.game.p2Board[randomFirstCell].boat);
        // this.game.p2Board[$(this).attr('id')].boat = this.game.p2Board[$(this).attr('id')].boat || drag.ship;
        // shipsOnBoard[drag.ship] = true;

    };


    var getCellIds = function () {
      var cellIds = [];
      return p1BoardRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          cellIds.push(childSnapshot.key());
        });
      })
      .then(function () {
        return cellIds;
      });
    };

    var getEnemyCellIds = function () {
      var cellIds = [];
      return p2BoardRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          cellIds.push(childSnapshot.key());
        });
      })
      .then(function () {
        return cellIds;
      });
    };

    var previousCells = [];
    var currentShip;
    var previousShip;

    // this uses AngularFire to create the synchronized array
    return {
      boardMapping: boardMapping,
      // gameId: randomId,
      ships: ships,
      ref: ref,
      previousCells: previousCells,
      currentShip: currentShip,
      previousShip: previousShip,
      allSpacesFree: allSpacesFree,
      p1CellHasBoat: p1CellHasBoat,
      shipOnBoard: shipOnBoard,
      getCellIds: getCellIds,
      getEnemyCellIds: getEnemyCellIds,
      roomOnBoard: roomOnBoard,
      quad1: quad1,
      quad2: quad2,
      quad3: quad3,
      quad4: quad4,
      quad5: quad5,
      popEnemyBoard: popEnemyBoard,
      game: game
    };
  }
]);



//CREDIT: ADAPTED FROM JASON TURIM'S lvlDragDrop DIRECTIVES: https://github.com/logicbomb/lvlDragDrop
app.directive('wbDraggable', ['$rootScope', 'gameService', function ($rootScope, gameService) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            angular.element(element).attr("draggable", "true");

            var size = angular.element(element).attr("data-size");
            var imgSrc = angular.element(element).attr("src");
            var ship = angular.element(element).attr("data-ship");
            var data = {size: size, imgSrc: imgSrc, ship:ship};
            var dataToSend = JSON.stringify(data);

            element.bind("dragstart", function (e) {
              gameService.currentShip = ship;
              var dragImg = element.css('opacity', 1);
                e.originalEvent.dataTransfer.setData('text', dataToSend);
                e.originalEvent.dataTransfer.setData(size, '');

                e.originalEvent.dataTransfer.setDragImage(dragImg[0], 0, 10);
                this.style.opacity = '.2';
                $rootScope.$emit("WB-DRAG-START");
            });

            element.bind("dragend", function (e) {
                this.style.opacity = '1';
                $rootScope.$emit("WB-DRAG-END");
            });
        }
    };
}]);

app.directive('wbDropTarget', ['$rootScope', '$timeout', 'gameService', function ($rootScope, $timeout, gameService) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&',
            // previousCells: '='
        },
        link: function (scope, element, attrs) {
          $timeout(function () {
            // var previousCells = [];
            getAttr = function (attr) {
              return angular.element(element).attr(attr);
            };
            getDestCells = function (extraCells, xVal, yVal) {
              var destCells = [];
              // Populate array of destination cells (all drop cells) and send as data transfer
              var dropRowCells = $('#player1-board [data-y="' + yVal + '"]');
                $.each(dropRowCells,function (index, cell) {
                  var thisXVal = $(this).attr('data-x');
                  if (thisXVal >= xVal && thisXVal <= (Number(xVal) + Number(extraCells))) {
                    destCells.push(cell);
                  }
                });
                return destCells;
            };
            destCellsEnter = function (destCells) {
              // console.log('left these cells: ');
              // console.log(gameService.previousCells);
              //
              // console.log('entered these cells: ');
              // console.log(destCells);
              //
              // console.log('previous ship: ');
              // console.log(gameService.previousShip);
              //
              // console.log('current ship: ');
              // console.log(gameService.currentShip);

              // if (gameService.previousShip === gameService.currentShip) {
                $.each(gameService.previousCells,function (index, cell) {
                    $(this).children().removeClass('wb-over');
                });
              // }
                $.each(destCells,function (index, cell) {
                    $(this).children().addClass('wb-over');
                });
            };
            destCellsLeave = function (destCells) {
              $.each(destCells,function (index, cell) {
                  $(this).children().removeClass('wb-over');
              });
            };
            var id = getAttr("id");
            var xVal = Number(getAttr("data-x"));
            var yVal = Number(getAttr("data-y"));
            // var extraCells;

            element.bind("dragover", function (e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            });

            element.bind("dragenter", function (e) {
              //next dragenter fires before prev dragleave, so need to force dragleave first
                // this / e.target is the current hover target.

                var extraCells = Number(e.originalEvent.dataTransfer.types[3]) - 1;
                var hoverCells = getDestCells(extraCells, xVal, yVal);

                destCellsEnter(hoverCells);
                scope.$apply(function () {
                  gameService.previousCells = hoverCells;
                });
                // console.log(previousCells);
            });

            element.bind("dragleave", function (e) {
                // this / e.target is previous target element.
                var extraCells = Number(e.originalEvent.dataTransfer.types[3]) - 1;
                var hoverCells = getDestCells(extraCells, xVal, yVal);
            });

            element.bind("drop", function (e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                if (e.stopPropagation) {
                    e.stopPropagation(); // Necessary. Allows us to drop.
                }
                var data = JSON.parse(e.originalEvent.dataTransfer.getData("text"));
                var extraCells = data.size - 1;

                gameService.previousShip = gameService.currentShip;
                gameService.currentShip = '';
                gameService.previousCells = [];

                scope.onDrop({dragEl: data, dropEls: getDestCells(extraCells, xVal, yVal)});
                // scope.onDrop({dragEl: data, dropEl: id});
            });

            $rootScope.$on("WB-DRAG-START", function () {
                var element = document.getElementById(id);
                angular.element(element).addClass("wb-target");
            });

            $rootScope.$on("WB-DRAG-END", function () {
              destCellsLeave(gameService.previousCells);
                var element = document.getElementById(id);
                angular.element(element).removeClass("wb-target");
                angular.element(element).removeClass("wb-over");
            });
      }, 0, false);
    }
  };
}]);
