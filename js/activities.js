function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	2.1
	// Complete
	function isComplete(tweet){ return tweet.source === 'completed_event'; }
	const OnlyComplete = tweet_array.filter( (tweet) => isComplete(tweet) );

	// Time
	// const TimePattern = /in (\d+:)?(\d+):(\d+)/;
	// const OnlyCompleteTime = OnlyComplete.filter( (tweet) => tweet.text.match(TimePattern) );
	
	// CompletedACheck
	// const CompletedChecked = OnlyCompleteTime.filter( (tweet) => tweet.text.match(CompletedFirstCheck) );

	// Extract Activity from CompletedCheck
	// edgecase for distance based activities
	const ActivityList = { }
	// activity: count, total distance, 
	// activity : distance based ? time based
	// if activity is distanced based => 
	// const a = /^Completed a (?<distance>\d+\.\d+)\s(?<unit>km|mi)\s(?<activity>\w+)\b/;
	// const a = /^Completed a (\b/;
	// for (const tweet of CompletedChecked){
	// 	const extracted = tweet.text.match(a);
	// 	const activity = extracted.groups.activity;
	// 	// if (!ActivityList[activity]) {
	// 	// 	ActivityList[activity] = { 
	// 	// 		'count' : 0,
	// 	// 		'totalDistance' : 0
	// 	// 	}
	// 	// }

	// 	const unit = extracted.groups.unit; 
	// 	let distance = extracted.groups.distance;
	// 	if (unit === 'km') { distance /= 1.609; }
	// 	ActivityList[activity].totalDistance += distance;
	// 	ActivityList[activity].count++; 

	function matchesPattern(tweet, pattern){ return tweet.text.matches(pattern); }

	const ExtractMajorityDistance = /(Just)\s(\w+)\s(a)\s(?<distance>\d+\.\d+)(\s?)(?<unit>km|mi)\s(?<activity>\w+)/;
	const DistanceActivityEdgeCase = /^Completed a (?<distance>\d+\.\d+)\s(?<unit>km|mi)\s(?<activity>\w+)\b/;
	const TimePattern = /in (\d+:)?(\d+):(\d+)/;
	const ExtractMajorityTime = /Just\s(\w+)\s(an|a)\s*(?<activity>[\s\S*]*)\sin/;

	const OneOffEdgeCaseDistance = /'completed\sa\s(?<distance>\d+.\d+)(\s?)(?<unit>km|mi)\s(?<activity>\w+)/;
	function tempFilter(tweet){
		const test = 
			!tweet.text.match(ExtractMajorityDistance)
			// || tweet.text.match(TimePattern)
			// || tweet.text.match(DistanceActivityEdgeCase)
			// || tweet.text.match(ExtractMajorityTime)
			// || tweet.text.match(OneOffEdgeCaseDistance)
		;
		if (!test) { return test; }
		const extraction = tweet.text.match(ExtractMajorityTime);
		// debugger; 
		return test;

	}
	const temp = OnlyComplete.filter( (tweet) => tempFilter(tweet) );
	// debugger; 
	function ExtractType(tweet){
		// Check If Distance 
		let DistanceActivity = tweet.text.match(ExtractMajorityDistance);
		if (DistanceActivity) { return DistanceActivity; }
	
		// Parsed Majority of Distance Activities => There still exists some distance activies in the TimePattern

		// Check Distance Activity Edge Case
		DistanceActivity = tweet.text.match(DistanceActivityEdgeCase);
		if (DistanceActivity) {return DistanceActivity;}

		// Parsing Majority of Time Activities 
		DistanceActivity = tweet.text.match(ExtractMajorityDistance);
		if (DistanceActivity) { return DistanceActivity; }

		// Remaning Tweets
		console.log("Remaining Tweets");
		console.log(tweet.text);
		return null;
	}


	for (const tweet of tweet_array){ 
		// COMPLETE
		if (!tweet.isCompletedEvent){ continue; }
		const DistanceActivity = ExtractType(tweet);
		
		// Bad Completions
		if (DistanceActivity === null){ continue; }

		// Activity
		const activity = DistanceActivity.groups.activity;
		if (!ActivityList[activity]) {
			ActivityList[activity] = { 
				'count' : 0,
				'totalDistance' : 0,
				'weekday' : 0,
				'weekend' : 0
			}
		}
		ActivityList[activity].count++; 

		// Distance 
		const unit = DistanceActivity.groups.unit; 
		if (!unit) { continue; }
		let distance = parseFloat(DistanceActivity.groups.distance);
		if (unit === 'km') { distance /= 1.609; }
		const newTotalDistance = parseFloat(ActivityList[activity].totalDistance) + distance; 
		ActivityList[activity].totalDistance = newTotalDistance;
		debugger;
	}
	
	// Extract Top 3
	

	// Extract Activity inbetween 'a' and 'in DISTANCE/TIME'
	// [a] [space: 1+] [stuff] [space] [inPattern]
	// [stuff] = [\s\S*]

	// "Just posted a MySports Freestyle in 1:01:28  - TomTom MySports Watch https://t.co/tv6pKRfYRo #Runkeeper"
	// "Just completed a 10.39 km run - joggingress https://t.co/alXAbvnMun #Runkeeper"


	function extractActivityName(tweet) { 

	}
	// const OnlyCompleteEventArray = tweet_array.filter( (tweet) => tweet.isCompletedEvent );

	// time + !(number + unit)
	const DistanceUnitPattern = /\s(\d+).(\d+)(\s)?(km|mi)/;
	function isTime(tweet){ }
	function JustPatternExtract(string){ }
	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});