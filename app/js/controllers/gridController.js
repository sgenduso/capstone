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

      // console.log("Ship with size " + drag.attr('data-size') + " has been dropped on cell " + drop.attr("data-x") + ", " + drop.attr("data-y") + "!");
    };

}]);
