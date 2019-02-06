require("dotenv").config();

var request = require("request");

var moment = require('moment');

var fs = require("fs");

//APIs
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var omdb = (keys.omdb);
var bandsintown = (keys.bandsintown);


//USER COMMAND AND INPUT
var userInput = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");


// APP LOGIC
function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doThis(userQuery);
            break;
        default:
            console.log("I don't understand");
            break;
    }
}

userCommand(userInput, userQuery);

function concertThis() {
    console.log("SEARCHING FOR..." + userQuery + "next show...");
    // USE REQUEST AS OUR QUERY URL USING OUR USER QUERY VARIABLE AS THE PARAMETERS OF OUR SEARCH
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + bandsintown, function (error, response, body) {
        // IF THERE IS NO ERROR GIVE US A 200 STATUS CODE (EVERYTHING OK!)
        if (!error && response.statusCode === 200) {
            // CAPTURE DATA AND USE JSON TO FORMAT
            var userBand = JSON.parse(body);
            // PARSE DATA AND USE FOR LOOP TO ACCESS PATHS TO DATA
            if (userBand.length > 0) {
                for (i = 0; i < 1; i++) {
                    
                    console.log("Artist: " + userBand[i].lineup[0]);
                    
                    console.log("Venue: " + userBand[i].venue.name);

                    console.log("City: " + userBand[i].venue.city);

                    var concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log(`Date and Time: ${concertDate}\n\n- - - - -`);
                };
            } else {
                console.log('Band or concert not found!');
            };
        };
    });
};

function spotifyThisSong() {
    console.log("SEARCHING FOR..." + userQuery);

    if (!userQuery) {
        userQuery = "the sign ace of base"
    };

    // SPOTIFY SEARCH
    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        

        for (i = 0; i < data.tracks.items.length; i++) {
            var songData = data.tracks.items[i];
            console.log("Artist: " + songData.artists[0].name);
            console.log("Song: " + songData.name);
            console.log("Album: " + songData.album.name) 
        };
    });
}

function movieThis() {
    console.log("SEARCHING FOR..." + userQuery);
    if (!userQuery) {
        userQuery = "Happy Gilmore";
    };
    // REQUEST USING OMDB API
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=" + OMDB_ID, function (error, response, body) {
        var userMovie = JSON.parse(body);

        if (!error && response.statusCode === 200) {
            console.log("Title: " + userMovie.Title);
            console.log("Release Year: " + userMovie.imdbRating);
            console.log("Country: " + userMovie.Country);
            console.log("Plot: " + userMovie.Plot);
            console.log("Actors: " + userMovie.Actors);
            console.log("Rotten Tomatoes Rating: " + userMovie.tomatoeRating);

        } else {
            return console.log("Movie unable to be found. Error:" + error)
        };
    })
};

function doThis() {
   
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        let dataArr = data.split(",");

        userInput = dataArr[0];
        userQuery = dataArr[1];
    
        userCommand(userInput, userQuery);
    });
};