app.controller('gridController', ['$scope', 'gameService', '$firebaseObject', function ($scope, gameService, $firebaseObject) {

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


  $scope.populateBoard(10);


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

  var positions = JSON.parse(localStorage.positions || "{}");
$(function () {
    var d = $("[id=draggable]").attr("id", function (i) {
        return "draggable_" + i;
    });
    $.each(positions, function (id, pos) {
        $("#" + id).css(pos);
    });

    d.draggable({
        containment: "#containment-wrapper",
        scroll: false,
        stop: function (event, ui) {
            positions[this.id] = ui.position;
            localStorage.positions = JSON.stringify(positions);
        }
    });
});

}]);
