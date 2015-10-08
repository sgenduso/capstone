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
  $scope.boardMapping = gameService.boardMapping;

  $scope.populateBoard = function (size) {
    $scope.p1Board.$loaded().then(function () {
      for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
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

  $scope.setId = function (x,y) {
    return gameService.boardMapping[x+1] + Number(y+1);
  };

  $scope.populateBoard(10);

  //
  // $(function() {
  //     $( ".draggable" ).draggable();
  //   });

  // $(function(){
  //   var sPositions = localStorage.positions || "{}";
  //   var positions = JSON.parse(sPositions);
  //   $.each(positions, function (id, pos) {
  //     $("#" + id).css(pos);
  //   });
  //   $(".draggable").draggable({
  //     containment: "#containment-wrapper",
  //     scroll: false,
  //     stop: function (event, ui) {
  //       positions[this.id] = ui.position;
  //       localStorage.positions = JSON.stringify(positions);
  //     }
  //   });
  // });

//   var positions = JSON.parse(localStorage.positions || "{}");
// $(function () {
//     var d = $("[id=draggable]").attr("id", function (i) {
//         return "draggable_" + i;
//     });
//     $.each(positions, function (id, pos) {
//         $("#" + id).css(pos);
//     });
//
//     d.draggable({
//         containment: "#containment-wrapper",
//         scroll: false,
//         cursor: 'move',
//         snap: ".snap-to-me",
//         snapMode: "inner",
//         stop: function (event, ui) {
//             positions[this.id] = ui.position;
//             localStorage.positions = JSON.stringify(positions);
//         }
//     });
// });

$("table.board-table td").css("color", 'red');

//
// $(function () {
//             $("#ships img").draggable(
//             {
//                 appendTo: "body",
//                 cursor: "move",
//                 revert: "invalid"
//             });
//
//             initDroppable($("#player1-board table td"));
//             function initDroppable($elements) {
//                 $elements.droppable({
//                     activeClass: "ui-state-default",
//                     hoverClass: "ui-drop-hover",
//                     accept: ":not(.ui-sortable-helper)",
//
//                     over: function (event, ui) {
//                         var $this = $(this);
//                     },
//                     drop: function (event, ui) {
//                         var $this = $(this);
//                         $(this).html('<img src="'+ui.draggable.attr("src")+'"/>');
//                         // $("<span></span>").text(ui.draggable.text()).appendTo(this);
//                         $("#ships img").find(":contains('" + ui.draggable.attr("src") + "')")[0].remove();
//                     }
//                 });
//             }
//         });
$scope.dropped = function(dragEl, dropEl) {
      // this is your application logic, do whatever makes sense
      var drag = angular.element(dragEl);
      var drop = angular.element(dropEl);
      console.log(drag);
      console.log(drop);

      console.log("Ship with size " + drag.attr('data-size') + " has been dropped on cell " + drop.attr("data-x") + ", " + drop.attr("data-y") + "!");
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

            element.bind("dragstart", function (e) {
                e.originalEvent.dataTransfer.setData('text', angular.element(element).attr("data-size"));
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

app.directive('wbDropTarget', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&'
        },
        link: function (scope, element, attrs) {
            var id = angular.element(element).attr("id");
            var xVal = angular.element(element).attr("data-x");
            var yVal = angular.element(element).attr("data-y");

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
                  var data = e.originalEvent.dataTransfer.getData("text");
                var dest = document.getElementById(id);
                var src = document.getElementById(data);

                scope.onDrop({dragEl: data, dropEl: id});
            });

            $rootScope.$on("WB-DRAG-START", function () {
                var el = document.getElementById(id);
                angular.element(element).addClass("wb-target");
            });

            $rootScope.$on("WB-DRAG-END", function () {
                var el = document.getElementById(id);
                angular.element(element).removeClass("wb-target");
                angular.element(element).removeClass("wb-over");
            });
        }
    };
}]);
