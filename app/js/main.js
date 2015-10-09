var app = angular.module('warboat', ['ui.router', 'ui.grid', 'firebase']);

app.config(function ($stateProvider, $locationProvider) {
  $stateProvider
  .state('home', {
      url: '/',
      templateUrl: './partials/home.html'
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

    // this uses AngularFire to create the synchronized array
    return {
      boardMapping: boardMapping,
      // gameId: randomId,
      gameObject: $firebaseObject(ref),
      gameRef: ref,
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
                this.style.opacity = '.2';
                e.originalEvent.dataTransfer.setData('text', dataToSend);
                e.originalEvent.dataTransfer.setData(size, '');
                $rootScope.$emit("WB-DRAG-START");
            });

            element.bind("dragend", function (e) {
                this.style.opacity = '1';
                $rootScope.$emit("WB-DRAG-END");
            });
        }
    };
}]);

app.directive('wbDropTarget', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&'
        },
        link: function (scope, element, attrs) {
          $timeout(function () {
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
            destCellsHover = function (destCells) {
                $.each(destCells,function (index, cell) {
                  // var thisXVal = $(this).attr('data-x');
                  // if (thisXVal >= xVal && thisXVal <= (Number(xVal) + Number(extraCells))) {
                    // $(this).css('background-color', 'yellow');
                    // $(this).css('border', '2px dashed black');
                    console.log(cell);
                    $(this).addClass('wb-over');
                    // console.log($(this).attr('class').split(/\s+/));
                  // }
                });
                // return destCells;
            };
            destCellsLeave = function (destCells) {
              $.each(destCells,function (index, cell) {
                // var thisXVal = $(this).attr('data-x');
                // if (thisXVal >= xVal && thisXVal <= (Number(xVal) + Number(extraCells))) {
                  // $(this).css('background-color', 'white');
                  //   $(this).css('border', '2px solid black');
                  $(this).removeClass('wb-over');
                  // console.log($(this).attr('class').split(/\s+/));
                // }
              });
              // return destCells;
            };
            var id = getAttr("id");
            var xVal = getAttr("data-x");
            var yVal = getAttr("data-y");
            var extraCells;

            element.bind("dragover", function (e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            });

            element.bind("dragenter", function (e) {
              console.log(e.originalEvent.dataTransfer.types[3]);
              var extraCells = Number(e.originalEvent.dataTransfer.types[3]) - 1;
                // this / e.target is the current hover target.
                // var el = angular.element(e.target);
                // var data = JSON.parse(e.originalEvent.dataTransfer.getData("text"));
                var hoverCells = getDestCells(extraCells, xVal, yVal);
                // var hoverCells = getDestCells(el.attr("data-x"));
                destCellsHover(hoverCells);
                // el.addClass('wb-over');
            });

            element.bind("dragleave", function (e) {
                // angular.element(e.target).removeClass('wb-over');  // this / e.target is previous target element.
                var extraCells = Number(e.originalEvent.dataTransfer.types[3]) - 1;
                var hoverCells = getDestCells(extraCells, xVal, yVal);
                destCellsLeave(hoverCells);
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
                // var extraCells = data.size - 1;
                // var destCells = [];
                // // Populate array of destination cells (all drop cells) and send as data transfer
                // var dropRowCells = $('#player1-board [data-y="' + yVal + '"]');
                // console.log(dropRowCells.length);
                //   $.each(dropRowCells,function (index, cell) {
                //     var thisXVal = $(this).attr('data-x');
                //     if (thisXVal >= xVal && thisXVal <= (Number(xVal) + Number(extraCells))) {
                //       destCells.push(cell);
                //     }
                //   });

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
