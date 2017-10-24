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
    
    //establishing train info and & time of submission on submission of new train
    var now = moment();
    var tName = snapshot.val().name;
    var tStart = snapshot.val().arrival;
    var tDestination = snapshot.val().destination;
    var tFrequency = snapshot.val().frequency;
    var trainTime = moment(snapshot.val().firstTrain, "HH:mm");

    //calculating train arrival time & minutes away from info provided upon train submission 
    var timeDiff = moment().diff(trainTime, "minutes");
    var remainder = timeDiff % tFrequency;
    var tMinutesAway = tFrequency - remainder;
    var tArrivalTime = moment(now).add(tMinutesAway, "mm").format("HH:MM");

    console.log(trainTime);
    console.log(timeDiff);
    console.log(remainder);
    console.log(tMinutesAway);
    console.log(tArrivalTime);

    //appending the train schedule display
    $("#trainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tStart + "</td><td>" + tDestination + "</td><td>" + tFrequency + " minutes" + "</td><td>" + tArrivalTime + "</td><td>" + tMinutesAway + "</td></tr>");
  });

});
