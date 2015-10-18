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

  $scope.game = gameService.fullGameObject;

  // $scope.p1Board = gameService.p1BoardObject;
  // $scope.p2Board = gameService.p2BoardObject;
  // $scope.p1ShipsOnBoard = gameService.p1ShipsObject;
  // $scope.p2ShipsOnBoard = gameService.p2ShipsObject;
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
          $scope.game.p2Ships[ship] = {
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

        });



          // $scope.game.p1Ships[ship]
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

app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    var randomId = Math.round(Math.random() * 1000000000);
    randomId = 1;
    var ref = "https://incandescent-fire-9342.firebaseio.com/game/" + randomId;
    // var p1BoardRef = new Firebase(ref + "/p1board");
    // var p2BoardRef = new Firebase(ref + "/p2board");
    // var p1ShipsRef = new Firebase(ref + "/p1ships");
    // var p2ShipsRef = new Firebase(ref + "/p2ships");
    var fullGameRef = new Firebase(ref);
    var fullGameObject = $firebaseObject(fullGameRef);
    // var p1BoardObject = $firebaseObject(p1BoardRef);
    // var p2BoardObject = $firebaseObject(p2BoardRef);
    // var p1ShipsObject = $firebaseObject(p1ShipsRef);
    // var p2ShipsObject = $firebaseObject(p2ShipsRef);


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
    //
    // var quad1 = ["p2-A1", "p2-A2", "p2-A3", "p2-A4", "p2-A5", "p2-B1", "p2-B2", "p2-B3", "p2-B4", "p2-B5", "p2-C1", "p2-C2", "p2-C3", "p2-C4", "p2-C5", "p2-D1", "p2-D2", "p2-D3", "p2-D4", "p2-D5", "p2-E1", "p2-E2", "p2-E3", "p2-E4", "p2-E5"];
    //
    // var quad2 = ["p2-A6", "p2-A7", "p2-A8", "p2-A9", "p2-A10", "p2-B6", "p2-B7", "p2-B8", "p2-B9", "p2-B10", "p2-C6", "p2-C7", "p2-C8", "p2-C9", "p2-C10", "p2-D6", "p2-D7", "p2-D8", "p2-D9", "p2-D10", "p2-E6", "p2-E7", "p2-E8", "p2-E9", "p2-E10"];
    //
    // var quad3 = ["p2-F1", "p2-F2", "p2-F3", "p2-F4", "p2-F5", "p2-G1", "p2-G2", "p2-G3", "p2-G4", "p2-G5", "p2-H1", "p2-H2", "p2-H3", "p2-H4", "p2-H5", "p2-I1", "p2-I2", "p2-I3", "p2-I4", "p2-I5"];
    //
    // var quad4 = ["p2-F7", "p2-F8", "p2-F9", "p2-F10", "p2-G7", "p2-G8", "p2-G9", "p2-G10", "p2-H7", "p2-H8", "p2-H9", "p2-H10", "p2-I7", "p2-I8", "p2-I9", "p2-I10","p2-J7", "p2-J8", "p2-J9", "p2-J10"];
    //
    // var quad5 = ["p2-F6","p2-G6", "p2-H6", "p2-I6", "p2-J1", "p2-J2", "p2-J3", "p2-J4", "p2-J5", "p2-J6", "p2-J7", "p2-J8", "p2-J9", "p2-J10"];

    var ships = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrol'];

    var randBetween = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };



    var allSpacesFree = function (destCells) {
      console.log(destCells);
      for (var i = 0; i < destCells.length; i++) {
        if (this.p1BoardObject[destCells[i].id].boat) {
          return false;
        }
      }
        return true;
    };

    var shipOnBoard = function (ship) {
      $('#'+ship).css('opacity', '');
      // if (p1ShipsObject[ship]) {
      //   return p1ShipsObject[ship].placed;
      // } else {
      //   return false;
      // }
      return p1ShipsObject[ship] === undefined ? false : p1ShipsObject[ship].placed;
    };

    var p1CellHasBoat = function (cellId) {
        return p1BoardObject[cellId].boat !== false;
    };
    //
    // var cellHasBoat = function (cellId, player) {
    //   console.log(p1BoardObject[cellId]);
    //   console.log(p2BoardObject[cellId]);
    //   // console.log(cellId);
    //   // console.log(player);
    //   if (player === 'p1') {
    //     return p1BoardObject[cellId].boat !== false;
    //   } else {
    //     return p2BoardObject[cellId].boat !== false;
    //   }
    // };

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
      } else if (p2BoardObject[randomFirstCell].y === 1) {
        shipDir = 'hor';
      } else {
        shipDir = 'vert';
      }

      console.log('first ship: ', randomFirstShip);
      console.log('first cell: ', randomFirstCell);
      console.log('ship direction: ', shipDir);
      console.log('ship on cell before: ', p2BoardObject[randomFirstCell].boat);
      p2BoardObject[randomFirstCell].boat = randomFirstShip;
      p2BoardObject.$save();
      console.log('ship on cell after: ', p2BoardObject[randomFirstCell].boat);
        // p2BoardObject[$(this).attr('id')].boat = p2BoardObject[$(this).attr('id')].boat || drag.ship;
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
      // p1BoardObject: p1BoardObject,
      // p1BoardRef: p1BoardRef,
      // p2BoardObject: p2BoardObject,
      // p2BoardRef: p2BoardRef,
      // p1ShipsObject: p1ShipsObject,
      // p2ShipsObject: p2ShipsObject,
      // p1ShipsRef: p1ShipsRef,
      // p2ShipsRef: p2ShipsRef,
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
      fullGameObject: fullGameObject
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
