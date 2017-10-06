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
var playersRef = database.ref("/players");

$(window).on("load", function() {

  //initialize game variables
  var p1Chosen;
  //check to see if this variable is set in the DB, if there is, set it equal to that variable, if there isn't there must not be a player one, so set it to false and then push this to the DB.

  var p2Chosen;
  var gameLocked;
  var player1;
  var player2;
  var playerName;
  var playerConnect;


  database.ref("/gameData").on("value", function(snapshot) {
    console.log(snapshot.val());
    gameLocked = snapshot.val().gameLocked;
    p1Chosen = snapshot.val().p1Chosen;
    p2Chosen = snapshot.val().p2Chosen;
    console.log({gameLocked, p1Chosen, p2Chosen})
    if(player1) {$("#you-are-player").text("You are Player 1")};
    if(player2) {$("#you-are-player").text("You are Player 2")};
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
      if (!player1 && !player2) {$("#name-submit").removeClass('invisible');}
      if (!p1Chosen) {
        $("#alert-box").text("Waiting for Player 1 to join.");
        // if (!player1 || !player2) {$("#name-submit").removeClass('invisible');}
        $("#player1-drop").addClass('invisible');
        database.ref("/gameData").update({
        gameLocked: true,
        });
        database.ref("/player1").update({
        name: "Player 1",
        });
      }
      //if player two is not selected, lock game, and prompt player two to join
      else if (!p2Chosen) {
        $("#alert-box").text("Waiting for Player 2 to join.");
        // $("#name-submit").removeClass('invisible');
        $("#player2-drop").addClass('invisible');
        console.log("Player2-drop invisible");
        database.ref("/gameData").update({
        gameLocked: true,
        });
        database.ref("/player2").update({
        name: "Player 2",
        });
      }
    }
  });

  database.ref("/player1/name").on("value", function(snapshot) {
    console.log(snapshot.val());
    snapData = snapshot.val();
    $("#player1-name").text(snapData);
  });
  database.ref("/player2/name").on("value", function(snapshot) {
    console.log(snapshot.val());
    snapData = snapshot.val();
    $("#player2-name").text(snapData);
  });

  connectedRef.on("value", function(connectSnap) {
    console.log(connectSnap.val());
    if (connectSnap.val()) {
      var connectionsList = connectionsRef.push({
        connected: true
      });
      playerConnect = connectionsList;
      console.log({playerConnect});
      $("#alertbox-2").append("Line 90: playerConnect: " + playerConnect);
      // console.log(connectionsList.val());
      // console.log(connectedRef.val());
      connectionsList.onDisconnect().remove();
    }
    // $("#alert-box2").text("Player 1 is " + player1);
    // if (player1) {
    //   database.ref("/player1").onDisconnect().set({
    //     choice: "",
    //     name: "Player 1",
    //   });
    //   database.ref("/gameData").onDisconnect().update({
    //     p1Chosen: false,
    //   })
    // }
    // else if (player2) {
    //   database.ref("/player2").onDisconnect().set({
    //     choice: "",
    //     name: "Player 2",
    //   });
    //   database.ref("/gameData").onDisconnect().update({
    //     p2Chosen: false,
    //   })
    // }

  });

  console.log({gameLocked, p1Chosen, p2Chosen});

  $("#name-submit").on("click", function() {
    event.preventDefault();
    if (!p1Chosen) {
      player1 = true;
      player2 = false;
      playerName = $("#player-name-in").val();
      console.log({playerName});
      database.ref("/player1").update({
        name: playerName,
      });
      database.ref("/gameData").update({
        p1Chosen: true,
      });
      database.ref("/gameData").onDisconnect().update({
        p1Chosen: false,
      });
      $("#name-submit").addClass('invisible');
      $("#player-name-in").val("");
      $("#player1-drop").removeClass("invisible");
      console.log({player1, player2});
      // $("#player1-name").text(playerName);
      
    }
    else if (!p2Chosen) {
      player1 = false;
      player2 = true;
      playerName = $("#player-name-in").val();
      console.log({playerName});
      database.ref("/player2").update({
        name: playerName,
      });
      database.ref("/gameData").update({
        p2Chosen: true,
      });
      database.ref("/gameData").onDisconnect().update({
        p2Chosen: false,
      });
      $("#name-submit").addClass('invisible');
      $("#player-name-in").val("");
      $("#player2-drop").removeClass('invisible');
      console.log({player1, player2});
      // $("#player2-name").text(playername);
      
    }
  });

  $(".drop").on("click", function() {
    event.preventDefault();
    var whichPlayer = $(this).attr('id');
    console.log({whichPlayer});
    if (whichPlayer === "player1-drop") {
      player1 = false;
      database.ref("/player1").update({
        name: "Player 1",
      });
      database.ref("/gameData").update({
        p1Chosen: false,
      });
    }
    else if(whichPlayer === "player2-drop") {
      player2 = false;
      database.ref("/player2").update({
        name: "Player 2",
      });
      database.ref("/gameData").update({
        p2Chosen: false,
      });
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