app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    // var randomId = Math.round(Math.random() * 100000000);
    // var ref = new Firebase("https://incandescent-fire-9342.firebaseio.com/game/" + randomId);
    var gameRef = new Firebase("https://incandescent-fire-9342.firebaseio.com/game");
    var shipsRef = new Firebase("https://incandescent-fire-9342.firebaseio.com/board");

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

    var allSpacesFree = function (destCells) {
      for (var i = 0; i < destCells.length; i++) {
        console.log(this.gameObject[destCells[i].id]);
        if (this.gameObject[destCells[i].id].boat) {
          console.log('not all spaces free');
          return false;
        }
        console.log('all spaces free');
        return true;
      }
    };

    var shipOnBoard = function (ship) {
      return this.shipsObject[ship];
    };

    var cellHasBoat = function (cellId) {
      console.log(cellId);
      // console.log(this.gameObject);
      console.log(this.gameObject[cellId]);
      return this.gameObject[cellId].boat !== false;
    };

    var previousCells = [];
    var currentShip;
    var previousShip;

    // this uses AngularFire to create the synchronized array
    return {
      boardMapping: boardMapping,
      // gameId: randomId,
      gameObject: $firebaseObject(gameRef),
      gameRef: gameRef,
      shipsObject: $firebaseObject(shipsRef),
      shipsRef: shipsRef,
      previousCells: previousCells,
      currentShip: currentShip,
      previousShip: previousShip,
      allSpacesFree: allSpacesFree,
      cellHasBoat: cellHasBoat,
      shipOnBoard: shipOnBoard
    };
  }
]);
