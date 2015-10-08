
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
          // return scope.$evalAsync(function(){
            var id = angular.element(element).attr("id");
            // console.log(scope);
            console.log(id);
            var xVal = angular.element(element).attr("data-x");
            var yVal = angular.element(element).attr("data-y");
            console.log(xVal);
            console.log(yVal);

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
                var dest = document.getElementById(id);
                var src = document.getElementById(data.imgSrc);

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
      }, 0, false);
    }
  };
}]);
