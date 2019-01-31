// Initialize Firebase
var config = {
    apiKey: "AIzaSyC0Fw4WhncVDxPUXzr-JM3jRKU6DAnwdgg",
    authDomain: "train-schedule-c78ea.firebaseapp.com",
    databaseURL: "https://train-schedule-c78ea.firebaseio.com",
    projectId: "train-schedule-c78ea",
    storageBucket: "train-schedule-c78ea.appspot.com",
    messagingSenderId: "401355167837"
};
firebase.initializeApp(config)

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

// button for adding new train
$("#submit").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination-name").val().trim();
    var firstTrain = $("#first-train-time").val().trim();
    var trainFrequency = $("#frequency-time").val().trim();

    //Creates local "temporary"object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: firstTrain,
        frequency: trainFrequency
    };

    // uploads train data to the database
    database.ref().push(newTrain);

    //logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    alert ("Train successfully added");

    //Clears all of the text-boxes
    $("#train-name").val("");
    $("#destination-name").val("");
    $("#first-train-time").val("");
    $("#frequency-time").val("");
});

// creat Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store evething into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().time;
    var trainFrequency = parseInt (childSnapshot.val().frequency);

    // Prettify the train time
    trainTime = moment(firstTrain, "HH:mm").subtract(1, "years");
    
    // Calculate the minutes until the next train
    var trainRemainder = parseInt(moment().diff(moment(firstTrain), "minutes")) % trainFrequency;
    var trainMinutes = trainFrequency - trainRemainder;

    // calculate the arrival time
    var trainArrival = moment().add(trainMinutes, "minutes").format("hh:mm");

    // creat the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(trainArrival),
        $("<td>").text(trainMinutes)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

})