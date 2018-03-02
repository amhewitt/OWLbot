var Discordie = require("discordie");
var config = require("./config.json")
var Events = Discordie.Events;
var S = require("string");
const chalk = require("chalk");
var request = require("request");
const table = require("table").table;
var schedule = require("node-schedule");

var scheduleURL = "https://api.overwatchleague.com/schedule?en-us";
var standingsURL = "https://api.overwatchleague.com/standings?en-us";

var matches = [];
var standings = [];
var stageStandings = [];
var notification = null;

var clientID = config.client_id;

getMatchList();
getSeasonStandings();

var client = new Discordie( {
	autoReconnect: true
});

client.connect({ token: config.discord_token });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log(chalk.bold.green("Connected as: " +client.User.username));
	client.User.setGame("Overwatch League");

});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	var guild = e.message.guild;
	var channel = e.message.channel;
	var author = e.message.author;

	message = e.message.resolveContent().toLowerCase();
	origMessage = e.message.content;
	
	// only respond to mentions or DMs. no trigger character 
	var mentionsMe = false;
	if (e.message.isPrivate) mentionsMe = true;
	
	// look for mention of this bot in particular - no role mentions or @here
	for (var i = 0; i < e.message.mentions.length; i++) {
		//console.log(e.message);
		if (e.message.mentions[i].id == clientID) {
			mentionsMe = true;
			break;
		}
	}

	if (mentionsMe) {
		if (message.startsWith("@owlbot schedule") || message.startsWith("schedule")) {
			var nextMatches = nextThreeMatches();
			var response = "No upcoming matches found.";
			if (nextMatches.length > 0) {
				response = "Upcoming matches:";
				for (var i = 0; i < nextMatches.length; i++) {
					response += "\r\n";
					response += matchToString(nextMatches[i]);
				}
			}
			
			channel.sendMessage(response);
		}
		else if (message.startsWith("@owlbot standings") || message.startsWith("standings")) {			
			// look for more parameters
			// for channel messages
			var params = message.replace("@owlbot standings", "");
			// for DMs
			params = params.replace("standings", "");
			
			// stage parameter should be an int from 1 to 4 if it exists
			var stage = 0;
			var valid = true;
			if (params != "" && !isNaN(params)) {
				if (params < 1 || params > 4) {
					channel.sendMessage("Can't retrieve standings - invalid stage number.");
					valid = false;
				} else {
					stage = params;
				}
			}
			
			if (valid) {
				var response = "Standings not found.";
				if (standings !== null && standings.length > 0) {
					if (stage == 0) {
						response = "Season standings:\r\n```";
					} else {
						response = "Stage " + stage + " standings:\r\n```";
					}
					
					response += standingsToTable(stage);
					response += "```";
				}
				
				channel.sendMessage(response);
			}
		}
	}
});

// create a one-time notification when the next match is scheduled to start
function scheduleNotification() {
	if (notification !== null) {
		notification.cancel();
	}
	
	// get #overwatch-league channel
	var channel = client.Channels.get("260473644793331713");    //377204868529782784);
	var match = nextMatch();
	
	//console.log(channel);
	if (channel !== null && match !== null && new Date(match.startDate) > new Date()) {
		var start = new Date(match.startDate);
		//console.log(start);
		
		notification = schedule.scheduleJob(start, function() {
			var team1 = "TBA";
			var team2 = "TBA";
			if (match.competitors[0] !== null) {
				team1 = match.competitors[0].name;
			}
			if (match.competitors[1] !== null) {
				team2 = match.competitors[1].name;
			}
			
			channel.sendMessage("Starting Now: " + team1 + " vs. " + team2);
		});
		
		//console.log("Next notification: " + notification.nextInvocation());
	}
}

// gets the list of all scheduled matches (past and future) in json format
function getMatchList() {
	request({ url: scheduleURL, json: true }, function(error, response, body) { 
		if (!error && response.statusCode === 200) {
			var nextSchedule = body;
			matches = [];
			
			for (var i = 1; i <= 7; i++) {
				for (var j = 0; j < nextSchedule.data.stages[i].matches.length; j++) {
					matches.push(nextSchedule.data.stages[i].matches[j]);
				}
			}
			
			matches.sort(function(a,b) { return a.startDateTS - b.startDateTS; });
			//console.log("Schedule loaded. " + matches.length + " matches found.");
			scheduleNotification();
		}
	});
	
	setTimeout(getMatchList, 60000);
};

// gets the full-season standings in json format
function getSeasonStandings() {
	var dings = "";
	standings = [];
	
	request({ url: standingsURL, json: true }, function(error, response, body) { 
		if (!error && response.statusCode === 200) {
			dings = body;
			
			for (var i = 0; i < dings.ranks.length; i++) {
				if (dings.ranks[i].competitor.id === dings.season.division["79"][0].id || dings.ranks[i].competitor.id === dings.season.division["80"][0].id) {
						dings.ranks[i].competitor.name += "*";
				}
				
				standings.push(dings.ranks[i]);
			}
			
			for (var j = 1; j <= 4; j++) {
				stageStandings[j] = [];
				for (var k = 0; k < dings.stages[j].teams.length; k++) {				
					stageStandings[j].push(dings.stages[j].teams[k]);
				}
			}
			
			//console.log("Standings loaded.");
		}
		else { console.log(error) }
	});
	
	setTimeout(getSeasonStandings, 600000);
}

// converts a json scheduled match into a printable string for schedule command
function matchToString(match) {
	var options = {  
		weekday: "long", month: "short", timeZoneName: "short",
		day: "numeric", hour: "2-digit", minute: "2-digit"  
	};

	var date = new Date(match.startDate);
	var team1 = "TBA";
	var team2 = "TBA";
	if (match.competitors[0] !== null) {
		team1 = match.competitors[0].name;
	}
	if (match.competitors[1] !== null) {
		team2 = match.competitors[1].name;
	}
	return date.toLocaleTimeString("en-us", options) + ": " + team1 + " vs. " + team2;
};

// converts a json scheduled match into a printable string for auto notification
function matchToNotification(match) {
	var team1 = "TBA";
	var team2 = "TBA";
	if (match.competitors[0] !== null) {
		team1 = match.competitors[0].name;
	}
	if (match.competitors[1] !== null) {
		team2 = match.competitors[1].name;
	}
	return "Starting Now: " + team1 + " vs. " + team2;
};

// converts json standings data into a printable table
function standingsToTable(stage) {
	if (stage > 0) {
		return stageStandingsToTable(stage);
	}
	
	var theStandings = standings;
	
	var tableData = [ ["Team", "W", "L", "MW", "ML", "MT", "Diff"] ];
	var config = { columns: { 0: { alignment: "left" },
							  1: { alignment: "right" },
							  2: { alignment: "right" },
							  3: { alignment: "right" },
							  4: { alignment: "right" },
							  5: { alignment: "right" },
							  6: { alignment: "right" } } };
	
	for (var i = 0; i < theStandings.length; i++) {
		var teamName = "";
		
		if (theStandings[i].placement < 10) {
			teamName += " ";
		}
		teamName += theStandings[i].placement;
		teamName += ". "
		teamName += theStandings[i].competitor.name;

		var diff = theStandings[i].records[0].gameWin - theStandings[i].records[0].gameLoss;
		if (diff >= 0) {
			diff = "+" + diff;
		}
		
		tableData.push([teamName, theStandings[i].records[0].matchWin, 
								  theStandings[i].records[0].matchLoss,
								  theStandings[i].records[0].gameWin,
								  theStandings[i].records[0].gameLoss,
								  theStandings[i].records[0].gameTie,
								  diff]);
	}
	
	var theTable = table(tableData, config);
	
	return theTable;
}

// converts json stage standings data into a printable table
function stageStandingsToTable(stage) {
	var theStandings = stageStandings[stage];
	
	var tableData = [ ["Team", "W", "L"] ];
	var config = { columns: { 0: { alignment: "left" },
							  1: { alignment: "right" },
							  2: { alignment: "right" } } };
	
	for (var i = 0; i < theStandings.length; i++) {
		var teamName = "";
		
		if (theStandings[i].placement < 10) {
			teamName += " ";
		}
		teamName += i + 1;
		teamName += ". "
		teamName += theStandings[i].name;

		
		tableData.push([teamName, theStandings[i].standings.wins, 
								  theStandings[i].standings.losses]);
	}
	
	var theTable = table(tableData, config);
	
	return theTable;
}

// finds the next match that has not happened yet
function nextMatch() {
	for (var i = 0; i < matches.length; i++) {
		if (matches[i].state == "PENDING") {
			return matches[i];
		}
	}
	
	return null;
};

// finds the next 3 matches that have not happened yet
function nextThreeMatches() {
	var nextThree = [];
	
	for (var i = 0; i < matches.length && nextThree.length < 3; i++) {
		if (matches[i].state == "PENDING") {
			nextThree.push(matches[i]);
		}
	}
	
	return nextThree;
};

function startsWith(str, prefix) {
	return str.indexOf(prefix) === 0;
};
