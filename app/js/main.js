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
    $scope.p1Board.$loaded().then(function () {
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
    });
  };


  $scope.populateBoard(10);


$scope.dropped = function(dragEl, dropEls) {

      // this is your application logic, do whatever makes sense
      var drag = angular.element(dragEl);
      var drop = angular.element(dropEls);
      // console.log(drag[0]);
      // console.log(drag[0].size);
      // console.log(drag[0].imgSrc);
      console.log(drop);

      // console.log("Ship with size " + drag.attr('data-size') + " has been dropped on cell " + drop.attr("data-x") + ", " + drop.attr("data-y") + "!");
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
            var data = {size: size, imgSrc: imgSrc};
            var dataToSend = JSON.stringify(data);

            element.bind("dragstart", function (e) {
                e.originalEvent.dataTransfer.setData('text', dataToSend);
                console.log('dragging');
                $rootScope.$emit("WB-DRAG-START");
            });

            element.bind("dragend", function (e) {
              console.log('drag ended');
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
          // return scope.$evalAsync(function(){
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
                // this / e.target is the current hover target.
                angular.element(e.target).addClass('wb-over');
            });

            element.bind("dragleave", function (e) {
                angular.element(e.target).removeClass('wb-over');  // this / e.target is previous target element.
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
                var destCells = [];
                destCells.push($('#' + id));

                var dropRowCells = $('#player1-board[data-y="' + yVal + '"]');
                console.log(dropRowCells);
                  // dropRowCells.forEach(function (cell) {
                  //   if (cell.dataset.x > xVal && cell.dataset.x <= xVal + extraCells) {
                  //     destCells.push(cell);
                  //   }
                  // });
                // extraCells = data.size;

                scope.onDrop({dragEl: data, dropEls: [destCells]});
                // scope.onDrop({dragEl: data, dropEl: id});
            });

            $rootScope.$on("WB-DRAG-START", function () {
                var element = document.getElementById(id);
                angular.element(element).addClass("wb-target");
            });

            $rootScope.$on("WB-DRAG-END", function () {
              // console.log(extraCells);
                var element = document.getElementById(id);
                angular.element(element).removeClass("wb-target");
                angular.element(element).removeClass("wb-over");
            });
      }, 0, false);
    }
  };
}]);
