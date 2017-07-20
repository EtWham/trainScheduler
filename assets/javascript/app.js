$(document).ready(function(){

	var config = {
		apiKey: "AIzaSyCZBK6Tn37omhOPX3FgKbdfQ9Ht1w4iqVk",
   		authDomain: "train-scheduler-1ab54.firebaseapp.com",
    	databaseURL: "https://train-scheduler-1ab54.firebaseio.com",
    	projectId: "train-scheduler-1ab54",
    	storageBucket: "train-scheduler-1ab54.appspot.com",
    	messagingSenderId: "805672600569"
	};
	firebase.initializeApp(config);
	var trainDB = firebase.database();

	$("#addTrain").on("click", function(event){
 		//user input
		var trainName = $("#trainName").val().trim();
  		var trainArrival = $("#trainArrival").val().trim();
  		var trainDestination = $("#trainDestination").val().trim();
  		var trainInitialTime = $("#trainInitialTime").val().trim();
  		var trainFrequency = $("#trainFrequency").val().trim();

  		//made newTrain variable to push into db
		var newTrain = {
			name: trainName,
			arrival: trainArrival,
    		destination: trainDestination,
    		firstTrain: trainInitialTime,
    		frequency: trainFrequency
  		};
  		//db push
		trainDB.ref().push(newTrain);
  		alert("Train successfully added");

  		//clearing user input values after push to add new trains
  		$("#trainName").val("");
  		$("#trainArrival").val("");
  		$("#trainDestination").val("");
  		$("#trainInitialTime").val("");
  		$("#trainFrequency").val("");

  	return false;
	});

	trainDB.ref().on("child_added", function(snapshot){

   		//calculating values to input into the table
    	var trainFrequency = snapshot.val().Frequency;
    	var trainInitialTime = moment(snapshot.val().trainInitialTime, 'HH:mm');
    	var now = moment();
    	var timeDiff = moment().diff(trainTime, "minutes");
    	var remainder = timeDiff % trainFrequency;
    	var minutesAway = trainFrequency - remainder;
    	var nextArrival = moment(now).add(minutesAway, "m");

    	//appending the table
  		var tr = $("<tr>");
   		tr.append("<td>" + snapshot.val().trainName + "</td>");
   		tr.append("<td>" + snapshot.val().trainArrival + "</td>");
   		tr.append("<td>" + snapshot.val().trainDestination + "</td>");
   		tr.append("<td>" + snapshot.val().trainFrequency + "</td>");
    	tr.append("<td>" + nextArrival.format("HH:mm") + "</td>");
    	tr.append("<td>" + minutesAway + "</td>");
    	$("#table-body").append(tr);
	});

})

