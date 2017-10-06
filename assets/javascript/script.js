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
  //if both players are selected, any other person on the page can only spectate
  var spectator = true;
  var playerName;
  var playerConnect;
  var wins = 0;
  var losses = 0;

  database.ref("/gameData").on("value", function(snapshot) {
    console.log(snapshot.val());
    gameLocked = snapshot.val().gameLocked;
    p1Chosen = snapshot.val().p1Chosen;
    p2Chosen = snapshot.val().p2Chosen;
    console.log({gameLocked, p1Chosen, p2Chosen})
    if(player1) {$("#you-are-player").text("You are Player 1")};
    if(player2) {$("#you-are-player").text("You are Player 2")};
    if(spectator) {$("#you-are-player").text("You are spectating")};
    if (p1Chosen && p2Chosen) {
      $("#name-submit").addClass('invisible');
      $("#alert-box").empty();
      //if both players are selected, game is unlocked and can be run
      database.ref("/gameData").update({
        gameLocked: false,
      });
    }
    else {
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
        wins: 0,
        losses: 0,
        });
        database.ref("/choices").update({
          player1: "",
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
        wins: 0,
        losses: 0,
        });
        database.ref("/choices").update({
          player2: "",
        })
      }
    }
  });

  database.ref("/player1").on("value", function(snapshot) {
    console.log(snapshot.val());
    snapData = snapshot.val();
    $("#player1-name").text(snapData.name);
    $("#p1-wins").text(snapData.wins);
    $("#p1-losses").text(snapData.losses);
  });
  database.ref("/player2").on("value", function(snapshot) {
    console.log(snapshot.val());
    snapData = snapshot.val();
    $("#player2-name").text(snapData.name);
    $("#p2-wins").text(snapData.wins);
    $("#p2-losses").text(snapData.losses);
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
      spectator = false;
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
      spectator = false;
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
      database.ref("/player2").onDisconnect().update({
        name: "Player 2",
        wins: 0,
        losses: 0,
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
      spectator = true;
      database.ref("/player1").update({
        name: "Player 1",
        wins: 0,
        losses: 0,
      });
      database.ref("/gameData").update({
        p1Chosen: false,
      });
    }
    else if(whichPlayer === "player2-drop") {
      player2 = false;
      spectator = true;
      database.ref("/player2").update({
        name: "Player 2",
        wins: 0,
        losses: 0,
      });
      database.ref("/gameData").update({
        p2Chosen: false,
      });
    }
  });

  database.ref("/gameData/gameLocked").on("value", function(snapshot) {
    console.log("gameLocked is " + snapshot.val());
    //if the game becomes unlocked, make the RPS buttons visible to both players
    if (!snapshot.val()) {
      if(player1) {
        $("#p1-button-box").removeClass('invisible');
      }
      else if(player2) {
        $("#p2-button-box").removeClass('invisible');
      }
    }
    //if the game becomes locked for any reason, hide the rps buttons
    else {
      $("#p1-button-box").addClass('invisible');
      $("#p2-button-box").addClass('invisible');
    }
  });

  $(".choice").on("click", function() {
    // console.log($(this).attr("data-value"));
    var choice = $(this).attr("data-value");
    $(".choice").prop("disabled", true);
    // push player choice to firebase
    if(player1) {
      database.ref("/choices").update({
        player1: choice,
      });
    }
    else if(player2) {
      database.ref("/choices").update({
        player2: choice,
      });
    }
  });

  database.ref(/*"/choices"*/).on("value", function(snapshot){
    // console.log(snapshot.val());
    var choiceSnap = snapshot.val().choices;
    var player1ref = snapshot.val().player1;
    var player2ref = snapshot.val().player2;
    // console.log(snap.player1, snap.player2)
    if (choiceSnap.player1 && choiceSnap.player2) {
      // console.log("both players have chosen");
      var p1choice = choiceSnap.player1;
      var p2choice = choiceSnap.player2;
      database.ref("/choices").update({
        player1: "",
        player2: ""
      });
      $("#alert-box").empty();
      $("#alert-box").append(player1ref.name + " chose " + p1choice + "!<br>");
      $("#alert-box").append(player2ref.name + " chose " + p2choice + "!<br>");
      if(p1choice === p2choice) {
        console.log("tie!");
      }
      if(p1choice === "rock" && p2choice === "paper") {
        $("#alert-box").append(player2ref.name + " wins!<br>");
        if(player1){losses++};
        if(player2){wins++};
      }
      if(p1choice === "rock" && p2choice === "scissors") {
        $("#alert-box").append(player1ref.name + " wins!<br>");
        if(player2){losses++};
        if(player1){wins++};
      }
      if(p1choice === "paper" && p2choice === "scissors") {
        $("#alert-box").append(player2ref.name + " wins!<br>");
        if(player1){losses++};
        if(player2){wins++};
      }
      if(p1choice === "paper" && p2choice === "rock") {
        $("#alert-box").append(player1ref.name + " wins!<br>");
        if(player2){losses++};
        if(player1){wins++};
      }
      if(p1choice === "scissors" && p2choice === "rock") {
        $("#alert-box").append(player2ref.name + " wins!<br>");
        if(player1){losses++};
        if(player2){wins++};
      }
      if(p1choice === "scissors" && p2choice === "paper") {
        $("#alert-box").append(player1ref.name + " wins!<br>");
        if(player2){losses++};
        if(player1){wins++};
      }
      console.log({player1, player2, wins, losses});
      if(player1){
        database.ref("/player1").update({
          wins: wins,
          losses: losses,
        });
      }
      else if(player2){
        database.ref("/player2").update({
          wins: wins,
          losses: losses,
        })
      }
      // database.ref("/choices").update({
      //   player1: "",
      //   player2: ""
      // });
    }
    if (!choiceSnap.player1 && player1){
      $(".choice").prop("disabled", false);
    }
    if (!choiceSnap.player2 && player2){
      $(".choice").prop("disabled", false);
    }
  });


    

    //evaluate choices

  //if both players are selected, any other person on the page can only spectate


});