app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    var randomId = Math.round(Math.random() * 1000000000);
    randomId = 1;
    var ref = "https://incandescent-fire-9342.firebaseio.com/game/" + randomId;
    var fullGameRef = new Firebase(ref);
    var game = $firebaseObject(fullGameRef);



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

    var quad1 = ["p2-A1", "p2-A2", "p2-A3", "p2-A4", "p2-A5", "p2-B1", "p2-C1", "p2-D1", "p2-E1"];

    var quad2 = ["p2-A6", "p2-A7", "p2-A8", "p2-A9", "p2-A10", "p2-B6", "p2-B10", "p2-C6", "p2-C10", "p2-D6", "p2-D10", "p2-E6", "p2-E7", "p2-E8", "p2-E9", "p2-E10"];

    var quad3 = ["p2-F1", "p2-F2", "p2-F3", "p2-F4", "p2-F5", "p2-G1", "p2-G2", "p2-G3", "p2-G4", "p2-G5", "p2-H1", "p2-H2", "p2-H3", "p2-H4", "p2-H5", "p2-I1", "p2-I2", "p2-I3", "p2-I4", "p2-I5"];

    var quad4 = ["p2-F7", "p2-F8", "p2-F9", "p2-F10", "p2-G7", "p2-G8", "p2-G9", "p2-G10", "p2-H7", "p2-H8", "p2-H9", "p2-H10", "p2-I7", "p2-I8", "p2-I9", "p2-I10","p2-J7", "p2-J8", "p2-J9", "p2-J10"];

    var quad5 = ["p2-F6","p2-G6", "p2-H6", "p2-I6", "p2-J1", "p2-J2", "p2-J3", "p2-J4", "p2-J5", "p2-J6", "p2-J7", "p2-J8", "p2-J9", "p2-J10"];

    var ships = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrol'];

    var randBetween = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    //when trying to drop or rotate ship, check if those spaces are free
    var allSpacesFree = function (destCells) {
      console.log(destCells);
      for (var i = 0; i < destCells.length; i++) {
        if (this.game.p1Board[destCells[i].id].boat) {
          return false;
        }
      }
        return true;
    };

    //check if specified ship is already on the board
    var shipOnBoard = function (ship) {
      $('#'+ship).css('opacity', '');
      // if (p1ShipsObject[ship]) {
      //   return p1ShipsObject[ship].placed;
      // } else {
      //   return false;
      // }
      return this.game.p1Ships === undefined ? false : this.game.p1Ships[ship].placed;
    };

    //check the specified cell for a boat
    var p1CellHasBoat = function (cellId) {
        return this.game.p1Board[cellId].boat !== false;
    };
    //
    // var cellHasBoat = function (cellId, player) {
    //   console.log(this.game.p1Board[cellId]);
    //   console.log(this.game.p2Board[cellId]);
    //   // console.log(cellId);
    //   // console.log(player);
    //   if (player === 'p1') {
    //     return this.game.p1Board[cellId].boat !== false;
    //   } else {
    //     return this.game.p2Board[cellId].boat !== false;
    //   }
    // };

    //before dropping or placing a ship, check whether it would go off the board
    var roomOnBoard = function (destinationLength, shipLength) {
      return destinationLength == shipLength;
    };

    var popEnemyBoard = function () {
      var availableQuads = [quad1, quad2, quad3, quad4, quad5];
      var availableShips = ships;
      var directions = ['hor', 'vert'];
      var shipDir;
      var randomFirstShip = ships[randBetween(0,1)];
      var randomFirstCell = quad1[randBetween(0, quad1.length-1)];

      if (randomFirstCell === 'p2-A1') {
        shipDir = directions[randBetween(0,1)];
      } else if (this.game.p2Board[randomFirstCell].y === 1) {
        shipDir = 'hor';
      } else {
        shipDir = 'vert';
      }

      console.log('first ship: ', randomFirstShip);
      console.log('first cell: ', randomFirstCell);
      console.log('ship direction: ', shipDir);
      console.log('ship on cell before: ', this.game.p2Board[randomFirstCell].boat);
      this.game.p2Board[randomFirstCell].boat = randomFirstShip;
      this.game.p2Board.$save();
      console.log('ship on cell after: ', this.game.p2Board[randomFirstCell].boat);
        // this.game.p2Board[$(this).attr('id')].boat = this.game.p2Board[$(this).attr('id')].boat || drag.ship;
        // shipsOnBoard[drag.ship] = true;

    };


    var getCellIds = function () {
      var cellIds = [];
        for (var key in this.game.p1Board) {
          cellIds.push(key);
        }
        return cellIds;
    };

    var getEnemyCellIds = function () {
      var cellIds = [];
        for (var key in this.game.p2Board) {
          cellIds.push(key);
        }
        return cellIds;
    };

    var previousCells = [];
    var currentShip;
    var previousShip;

    // this uses AngularFire to create the synchronized array
    return {
      boardMapping: boardMapping,
      // gameId: randomId,
      ships: ships,
      ref: ref,
      previousCells: previousCells,
      currentShip: currentShip,
      previousShip: previousShip,
      allSpacesFree: allSpacesFree,
      p1CellHasBoat: p1CellHasBoat,
      shipOnBoard: shipOnBoard,
      getCellIds: getCellIds,
      getEnemyCellIds: getEnemyCellIds,
      roomOnBoard: roomOnBoard,
      quad1: quad1,
      quad2: quad2,
      quad3: quad3,
      quad4: quad4,
      quad5: quad5,
      popEnemyBoard: popEnemyBoard,
      game: game
    };
  }
]);
