app.factory("gameService", ["$firebaseArray", "$firebaseObject", '$localStorage',
  function($firebaseArray, $firebaseObject, $localStorage) {

    var storage = $localStorage;
    storage.gameId = storage.gameId ? storage.gameId : Math.round(Math.random() * 1000000000);

    var ref = "https://incandescent-fire-9342.firebaseio.com/game/" + storage.gameId;
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


    var ships = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrol'];

    var randBetween = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    //when trying to drop or rotate ship, check if those spaces are free
    var allSpacesFree = function (destCells) {
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
      return this.game.p1Ships === undefined ? false : this.game.p1Ships[ship].placed;
    };

    var allShipsPlaced = function () {
      for (var ship in this.game.p1Ships){
        if (this.game.p1Ships[ship].placed === false) {
          return false;
        }
      }
      return true;
    };

    //check the specified cell on p1 board for a boat
    var p1CellHasBoat = function (cellId) {
        return this.game.p1Board[cellId].boat !== false;
    };

    //check the specified cell on p2 board for a boat
    var p2CellHasBoat = function (cellId) {
        return this.game.p2Board[cellId].boat !== false;
    };

    //check the specified cell on p2 board for a hit
    var p2CellHit = function (cellId) {
        return this.game.p2Board[cellId].hit;
    };

    //check the specified cell on p2 board for a miss
    var p2CellMiss = function (cellId) {
        return this.game.p2Board[cellId].miss;
    };

    //check the specified cell on p2 board for a miss
    var p2ShipSunk = function (ship) {
      if (ship) {
        return this.game.p2Ships[ship].sunk;
      }
    };

    //check the specified cell on p1 board for a hit
    var p1CellHit = function (cellId) {
        return this.game.p1Board[cellId].hit;
    };

    //check the specified cell on p1 board for a miss
    var p1CellMiss = function (cellId) {
        return this.game.p1Board[cellId].miss;
    };

    //check the specified cell on p1 board for a miss
    var p1ShipSunk = function (ship) {
      if (ship) {
        return this.game.p1Ships[ship].sunk;
      }
    };

    //check if player 1 won
    var p1Won = function () {
      for(var ship in this.game.p2Ships){
        if (this.game.p2Ships[ship].sunk === false) {
          return false;
        }
      }
      return true;
    };

    //check if player 2 won
    var p2Won = function () {
      for(var ship in this.game.p1Ships){
        if (this.game.p1Ships[ship].sunk === false) {
          return false;
        }
      }
      return true;
    };

    //before dropping or placing a ship, check whether it would go off the board
    var roomOnBoard = function (destinationLength, shipLength) {
      return destinationLength == shipLength;
    };

    var emptyEnemyCells = function () {
      var emptyCells = [];
      for (var key in this.game.p2Board) {
        if (this.game.p1Board[key].boat === false) {
          emptyCells.push(key);
        }
      }
      return emptyCells;
    };

    var popEnemyBoard = function () {
      var randCell = randBetween(0, emptyEnemyCells().length);
      var randShip = this.ships[randBetween(0, this.ships.length-1)];

    };



    var getTargetCells = function () {
      var targetCells = [];
        for (var key in this.game.p1Board){
          if (this.game.p1Board[key].hit === false && this.game.p1Board[key].miss === false) {
            targetCells.push(key);
          }
        }
        return targetCells;
    };

    var getEnemyCellIds = function () {
      var cellIds = [];
      return p2BoardRef.once('value', function (snapshot) {
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

    return {
      boardMapping: boardMapping,
      ships: ships,
      ref: ref,
      previousCells: previousCells,
      currentShip: currentShip,
      previousShip: previousShip,
      allSpacesFree: allSpacesFree,
      allShipsPlaced: allShipsPlaced,
      p1CellHasBoat: p1CellHasBoat,
      p2CellHasBoat: p2CellHasBoat,
      p2CellHit: p2CellHit,
      p2CellMiss: p2CellMiss,
      p2ShipSunk: p2ShipSunk,
      p1CellHit: p1CellHit,
      p1CellMiss: p1CellMiss,
      p1ShipSunk: p1ShipSunk,
      p1Won: p1Won,
      p2Won: p2Won,
      shipOnBoard: shipOnBoard,
      getTargetCells: getTargetCells,
      getEnemyCellIds: getEnemyCellIds,
      roomOnBoard: roomOnBoard,
      randBetween: randBetween,
      quad1: quad1,
      quad2: quad2,
      quad3: quad3,
      quad4: quad4,
      quad5: quad5,
      popEnemyBoard: popEnemyBoard,
      game: game,
      storage: storage
    };
  }
]);
