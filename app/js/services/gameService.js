app.factory("gameService", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {
    // create a reference to the database location where data is stored
    var randomId = Math.round(Math.random() * 100000000);
    var ref = new Firebase("https://incandescent-fire-9342.firebaseio.com/game/" + randomId);

    // this uses AngularFire to create the synchronized array
    return {
      gameId: randomId,
      gameArray: $firebaseArray(ref)
    };
  }
]);
