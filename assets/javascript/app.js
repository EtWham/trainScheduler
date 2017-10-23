$(document).ready(function(){


	// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCZBK6Tn37omhOPX3FgKbdfQ9Ht1w4iqVk",
    authDomain: "train-scheduler-1ab54.firebaseapp.com",
    databaseURL: "https://train-scheduler-1ab54.firebaseio.com",
    projectId: "train-scheduler-1ab54",
    storageBucket: "train-scheduler-1ab54.appspot.com",
    messagingSenderId: "805672600569"
  };

  firebase.initializeApp(config);
	var database = firebase.database();

	$("#addTrain").on("click", function(){

 		//take user input
		var trainName = $("#trainName").val().trim();
  	var trainArrival = $("#trainArrival").val().trim();
  	var trainDestination = $("#trainDestination").val().trim();
  	var firstTrainTime = $("#trainInitialTime").val().trim();
  	var trainFrequency = $("#trainFrequency").val().trim();

  	//made newTrain variable from user input to push into db
		var newTrain = {
			name: trainName,
			arrival: trainArrival,
    	destination: trainDestination,
    	firstTrain: firstTrainTime,
    	frequency: trainFrequency
  	};

  	//db push
		database.ref().push(newTrain);
  	alert("Train successfully added");
    console.log(newTrain.name);
    console.log(newTrain.arrival);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

  	//clearing user input values after push to add new trains
  	$("#trainName").val("");
  	$("#trainArrival").val("");
  	$("#trainDestination").val("");
  	$("#trainInitialTime").val("");
  	$("#trainFrequency").val("");

    return false;
	});

  database.ref().on("child_added", function(snapshot){

    //calculating values to input into the train schedule display
    var trainFrequency = snapshot.val().Frequency;
    var firstTrainTime = moment(snapshot.val().trainInitialTime, 'HH:mm');
    var now = moment();
    var timeDiff = moment().diff(firstTrainTime, "minutes");
    var remainder = timeDiff % trainFrequency;
    var minutesAway = trainFrequency - remainder;
    var nextArrival = moment(now).add(minutesAway, "m");

    //appending the train schedule display
    var tr = $("<tr>");
    tr.append("<td>" + snapshot.val().trainName + "</td>");
    tr.append("<td>" + snapshot.val().trainArrival + "</td>");
    tr.append("<td>" + snapshot.val().trainDestination + "</td>");
    tr.append("<td>" + snapshot.val().trainFrequency + "</td>");
    tr.append("<td>" + nextArrival.format("HH:mm") + "</td>");
    tr.append("<td>" + minutesAway + "</td>");
    $("#table-body").append(tr);
  });

});
