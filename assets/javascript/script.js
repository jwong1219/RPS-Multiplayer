// Initialize Firebase
var config = {
  apiKey: "AIzaSyBZoE2m3GyhtH1wEy9tRpyI8bNwBN3eKF8",
  authDomain: "rps-multiplayer-be032.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-be032.firebaseio.com",
  projectId: "rps-multiplayer-be032",
  storageBucket: "",
  messagingSenderId: "513960376267"
};
firebase.initializeApp(config);
var database = firebase.database();

// Link to Firebase DB for tracking players/viewers
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

$(window).on("load", function() {

  //initialize game variables
  var p1Chosen;
  //check to see if this variable is set in the DB, if there is, set it equal to that variable, if there isn't there must not be a player one, so set it to false and then push this to the DB.

  var p2Chosen;
  var gameLocked;
  var player;


  database.ref("/gameData").on("value", function(snapshot) {
    console.log(snapshot.val());
    gameLocked = snapshot.val().gameLocked;
    p1Chosen = snapshot.val().p1Chosen;
    p2Chosen = snapshot.val().p2Chosen;
    console.log({gameLocked, p1Chosen, p2Chosen})
    if (p1Chosen && p2Chosen) {
      $("#name-submit").addClass('invisible');
      $("#alert-box").empty();
      database.ref("/gameData").update({
        gameLocked: false,
      });
    }
    else {
      // database.ref("/gameData").update({
      //   gameLocked: true,
      // });
      //if player one is not selected, lock game, and prompt player one to join
      if (!p1Chosen) {
        $("#alert-box").text("Waiting for Player 1 to join.");
        database.ref("/gameData").update({
        gameLocked: true,
        });
      }
      //if player two is not selected, lock game, and prompt player two to join
      else if (!p2Chosen) {
        $("#alert-box").text("Waiting for Player 2 to join.");
        database.ref("/gameData").update({
        gameLocked: true,
        });
      }
    }
  });


  //if player one is not selected, lock game, and prompt player one to join


  //if player two is not selected, lock game, and prompt player two to join


  //if both players are selected, game is unlocked and can be run

    //make the RPS buttons visible to player one and tell player one to make a selection. Display message to player 2 "waiting for Player 1"  


    //Player one makes a choice, the choice is stored. Hide the RPS buttons from player 1


    //make the RPS buttons visible to player 2 and tell player one to make a selection. Display message to player 1 "waiting for Player 2"  


    //player 2 makes a choice, the choice is stored. Hide the RPS buttons from player 1

    //evaluate choices

  //if both players are selected, any other person on the page can only spectate

});