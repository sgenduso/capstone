app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    // var randomId = Math.round(Math.random() * 100000000);
    // var ref = new Firebase("https://incandescent-fire-9342.firebaseio.com/game/" + randomId);
    var p1BoardRef = new Firebase("https://incandescent-fire-9342.firebaseio.com/p1board");
    var p2BoardRef = new Firebase("https://incandescent-fire-9342.firebaseio.com/p2board");
    var shipsRef = new Firebase("https://incandescent-fire-9342.firebaseio.com/ships");
    var p1BoardObject = $firebaseObject(p1BoardRef);
    var p2BoardObject = $firebaseObject(p2BoardRef);
    var shipsObject = $firebaseObject(shipsRef);


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

    var ships = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrol'];

    var allSpacesFree = function (destCells) {
      for (var i = 0; i < destCells.length; i++) {
        if (this.p1BoardObject[destCells[i].id].boat) {
          console.log('not all spaces free');
          return false;
        }
      }
        console.log('all spaces free');
        return true;
    };

    var shipOnBoard = function (ship) {
      $('#'+ship).css('opacity', '');
      return this.shipsObject[ship];
    };

    var cellHasBoat = function (cellId) {
      return this.p1BoardObject[cellId].boat !== false;
    };

    var roomOnBoard = function (destinationLength, shipLength) {
      'checking for room on board';
      return destinationLength == shipLength;
    };




    var getCellIds = function () {
      var cellIds = [];
      p1BoardRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          cellIds.push(childSnapshot.key());
        });
      })
      .then(function () {
        return cellIds;
      });
    };

    var previousCells = [];
    var currentShip;
    var previousShip;

    // this uses AngularFire to create the synchronized array
    return {
      boardMapping: boardMapping,
      // gameId: randomId,
      ships: ships,
      p1BoardObject: p1BoardObject,
      p1BoardRef: p1BoardRef,
      p2BoardObject: p2BoardObject,
      p2BoardRef: p2BoardRef,
      shipsObject: shipsObject,
      shipsRef: shipsRef,
      previousCells: previousCells,
      currentShip: currentShip,
      previousShip: previousShip,
      allSpacesFree: allSpacesFree,
      cellHasBoat: cellHasBoat,
      shipOnBoard: shipOnBoard,
      getCellIds: getCellIds,
      roomOnBoard: roomOnBoard
    };
  }
]);
