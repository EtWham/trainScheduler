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
    var firstTrainTime = moment($("#trainInitialTime").val().trim(), "HH:mm").subtract(10, "years").format("X");
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

  	//clearing user input values after push to add new trains
  	$("#trainName").val("");
  	$("#trainArrival").val("");
  	$("#trainDestination").val("");
  	$("#trainInitialTime").val("");
  	$("#trainFrequency").val("");

    // return false;
	});

  database.ref().on("child_added", function(snapshot){
    
    //establishing train info and & time of submission on submission of new train
    var now = moment();
    var tName = snapshot.val().name;
    var tStart = snapshot.val().arrival;
    var tDestination = snapshot.val().destination;
    var trainTime = moment(snapshot.val().firstTrain, "HH:mm");
    var tFrequency = snapshot.val().frequency;

    //calculating train arrival time & minutes away from info provided upon train submission 
    var timeDiff = moment(trainTime).diff(now, "minutes");
    timeDiff = Math.abs(timeDiff);
    var remainder = timeDiff % tFrequency;
    var tMinutesAway = tFrequency - remainder;
    //arrival time not working properly for some reason, need to figure this out
    var tArrivalTime = moment().add(tMinutesAway, "m").format("hh:mm A");
    var tArrivalTime2 = moment(tMinutesAway + now).format("hh:mm A");


    //checking all info
    console.log("This is the train's name: " + tName);
    console.log("This is WHERE the train starts off: " + tStart);
    console.log("This is the train's destination: " + tDestination);
    console.log("This is the time WHEN the train first starts off: " + trainTime);
    console.log("This is how often the train stops at this station: " + tFrequency + " minutes");
    console.log("This is the total time since the train first left the station (its first trainTime) and now: " + timeDiff + " minutes");
    console.log("This is the remainder of the timeDiff or how mant minutes that train is into its specific frequency of visiting our station: " + remainder + " minutes");
    console.log("This is how many minutes away the train is from arriving at this station: " + tMinutesAway + " minutes");
    console.log("This is the time the train will arrive at this station: " + tArrivalTime);

    //appending the train schedule display
    $("#trainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tStart + "</td><td>" + tDestination + "</td><td>" + tFrequency + " minutes" + "</td><td>" + tArrivalTime + "</td><td>" + tMinutesAway + "</td></tr>");
  });

});
