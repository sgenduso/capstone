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

  $scope.p1Board = gameService.gameObject;
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
      console.log(drop);
    };

}]);

app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    // var randomId = Math.round(Math.random() * 100000000);
    // var ref = new Firebase("https://incandescent-fire-9342.firebaseio.com/game/" + randomId);
    var ref = new Firebase("https://incandescent-fire-9342.firebaseio.com/game");

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

    var previousCells = [];

    // this uses AngularFire to create the synchronized array
    return {
      boardMapping: boardMapping,
      // gameId: randomId,
      gameObject: $firebaseObject(ref),
      gameRef: ref,
      previousCells: previousCells
    };
  }
]);



//CREDIT: ADAPTED FROM JASON TURIM'S lvlDragDrop DIRECTIVES: https://github.com/logicbomb/lvlDragDrop
app.directive('wbDraggable', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            angular.element(element).attr("draggable", "true");

            var size = angular.element(element).attr("data-size");
            var imgSrc = angular.element(element).attr("src");
            var ship = angular.element(element).attr("ship");
            var data = {size: size, imgSrc: imgSrc, ship:ship};
            var dataToSend = JSON.stringify(data);

            element.bind("dragstart", function (e) {
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
          console.log(scope);
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
              console.log('left these cells: ');
              console.log(gameService.previousCells);

              console.log('entered these cells: ');
              console.log(destCells);

                $.each(gameService.previousCells,function (index, cell) {
                    $(this).children().removeClass('wb-over');
                });
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
              // console.log('leaving these cells: ');
              // console.log(hoverCells);
                // destCellsLeave(hoverCells);
                // previousCells = hoverCells;
                // console.log(previousCells);
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

                scope.onDrop({dragEl: data, dropEls: getDestCells(extraCells, xVal, yVal)});
                // scope.onDrop({dragEl: data, dropEl: id});
            });

            $rootScope.$on("WB-DRAG-START", function () {
                var element = document.getElementById(id);
                angular.element(element).addClass("wb-target");
            });

            $rootScope.$on("WB-DRAG-END", function () {
                var element = document.getElementById(id);
                angular.element(element).removeClass("wb-target");
                angular.element(element).removeClass("wb-over");
            });
      }, 0, false);
    }
  };
}]);
