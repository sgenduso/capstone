
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
