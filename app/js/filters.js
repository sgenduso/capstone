app.filter('orderObjectBy', function(){
  return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var letters = [];
    var numbers = [];
    for(var key in input) {
      letters.push(key[0]);
      var number = key[2] ? Number(key[1]) + Number(key[2]) : Number(key[1]);
      numbers.push(number);
    }

    function compare(a,b) {
      if (a[attribute] < b[attribute])
        return -1;
      if (a[attribute] > b[attribute])
        return 1;
      return 0;
    }

    array.sort(compare);
    return array;
  };
});

var shapes = [
    [4, "Trapezium"],
    [5, "Pentagon"],
    [3, "Triangle"],
    [4, "Rectangle"],
    [4, "Square"]
    ];

shapes.sort(function(a, b)
{
    if(a[0] === b[0])
    {
        var x = a[1].toLowerCase(), y = b[1].toLowerCase();

        return x < y ? -1 : x > y ? 1 : 0;
    }
    return a[0] - b[0];
});


// ng-repeat="item in items | orderObjectBy:'title'"
