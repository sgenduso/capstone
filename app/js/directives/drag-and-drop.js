
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
              console.log('left these cells: ');
              console.log(gameService.previousCells);

              console.log('entered these cells: ');
              console.log(destCells);

              console.log('previous ship: ');
              console.log(gameService.previousShip);

              console.log('current ship: ');
              console.log(gameService.currentShip);

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
                var element = document.getElementById(id);
                angular.element(element).removeClass("wb-target");
                angular.element(element).removeClass("wb-over");
            });
      }, 0, false);
    }
  };
}]);
