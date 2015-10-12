app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    // var randomId = Math.round(Math.random() * 100000000);
    // var ref = new Firebase("https://incandescent-fire-9342.firebaseio.com/game/" + randomId);
    var boardRef = new Firebase("https://incandescent-fire-9342.firebaseio.com/board");
    var shipsRef = new Firebase("https://incandescent-fire-9342.firebaseio.com/ships");
    var boardObject = $firebaseObject(boardRef);
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
        if (this.boardObject[destCells[i].id].boat) {
          console.log('not all spaces free');
          return false;
        }
      }
        console.log('all spaces free');
        return true;
    };

    var shipOnBoard = function (ship) {
      console.log(this.shipsObject[ship]);
      return this.shipsObject[ship];
    };

    var cellHasBoat = function (cellId) {
      console.log(cellId);
      // console.log(this.boardObj);
      console.log(this.boardObject[cellId]);
      return this.boardObject[cellId].boat !== false;
    };

    var roomOnBoard = function (destinationLength, shipLength) {
      return destinationLength == shipLength;
    };


    var getCellIds = function () {
      var cellIds = [];
      boardRef.once('value', function (snapshot) {
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
      boardObject: boardObject,
      boardRef: boardRef,
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
