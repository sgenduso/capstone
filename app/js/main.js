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

$scope.rotate = function (e) {
  var dropCells = e.data.dropCells;
  var count = 1;
  $.each(dropCells, function (index, cell) {
    if (index > 0) {
      console.log('this cell: ');
      console.log($(this));
      console.log('swapped cell: ');
    var swappedCell = $('td[data-x=' + (Number($(this).attr('data-x'))-count) + '][data-y=' + (Number($(this).attr('data-y'))+count) + ']');
    console.log(swappedCell);
    $scope.p1Board[swappedCell.attr('id')].boat = e.data.ship;
    $scope.p1Board[$(this).attr('id')].boat = false;
    console.log($scope.p1Board[swappedCell.attr('id')]);
    console.log($scope.p1Board[$(this).attr('id')]);
    $scope.p1Board.$save();
    // $(this).attr('data-boat', false);
    count++;


    // console.log('index ' + index);
    // console.log($(this).attr('data-x'));
    // console.log($(this).attr('data-y'));
    }
  });
  // console.log(e.data.startDirection);
  // console.log(e.data.dropCells);
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
        $(drop[0]).click({dropCells: drop, ship: drag.ship, startDirection: 'horizontal'}, $scope.rotate);
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

app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    // var randomId = Math.round(Math.random() * 100000000);
    // var ref = new Firebase("https://incandescent-fire-9342.firebaseio.com/game/" + randomId);
    var boardRef = new Firebase("https://incandescent-fire-9342.firebaseio.com/board");
    var shipsRef = new Firebase("https://incandescent-fire-9342.firebaseio.com/ships");
    var boardObject = $firebaseObject(boardRef);
    var shipsObject = $firebaseObject(shipsRef);


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

    var ships = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrol'];

    var allSpacesFree = function (destCells) {
      for (var i = 0; i < destCells.length; i++) {
        if (this.boardObject[destCells[i].id].boat) {
          console.log('not all spaces free');
          return false;
        }
      }
        console.log('all spaces free');
        return true;
    };

    var shipOnBoard = function (ship) {
      $('#'+ship).css('opacity', '');
      return this.shipsObject[ship];
    };

    var cellHasBoat = function (cellId) {
      return this.boardObject[cellId].boat !== false;
    };

    var roomOnBoard = function (destinationLength, shipLength) {
      return destinationLength == shipLength;
    };




    var getCellIds = function () {
      var cellIds = [];
      boardRef.once('value', function (snapshot) {
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
      boardObject: boardObject,
      boardRef: boardRef,
      shipsObject: shipsObject,
      shipsRef: shipsRef,
      previousCells: previousCells,
      currentShip: currentShip,
      previousShip: previousShip,
      allSpacesFree: allSpacesFree,
      cellHasBoat: cellHasBoat,
      shipOnBoard: shipOnBoard,
      getCellIds: getCellIds,
      roomOnBoard: roomOnBoard
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
