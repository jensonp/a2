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
	// function isComplete(tweet){ return tweet.source === 'completed_event'; }
	// const OnlyComplete = tweet_array.filter( (tweet) => isComplete(tweet) );

	// Time
	// const TimePattern = /in (\d+:)?(\d+):(\d+)/;
	// const OnlyCompleteTime = OnlyComplete.filter( (tweet) => tweet.text.match(TimePattern) );
	
	// CompletedACheck
	// const CompletedChecked = OnlyCompleteTime.filter( (tweet) => tweet.text.match(CompletedFirstCheck) );

	// Extract Activity from CompletedCheck
	// edgecase for distance based activities
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


	// function tempFilter(tweet){
	// 	const test = 
	// 		!tweet.text.match(ExtractMajorityDistance)
	// 		// || tweet.text.match(TimePattern)
	// 		// || tweet.text.match(DistanceActivityEdgeCase)
	// 		// || tweet.text.match(ExtractMajorityTime)
	// 		// || tweet.text.match(OneOffEdgeCaseDistance)
	// 	;
	// 	if (!test) { return test; }
	// 	const extraction = tweet.text.match(ExtractMajorityTime);
	// 	// debugger; 
	// 	return test;

	// }
	// const temp = OnlyComplete.filter( (tweet) => tempFilter(tweet) );

	const ActivityList = { }
	const ExtractMajorityDistance = /(Just)\s(\w+)\s(a)\s(?<distance>\d+\.\d+)(\s?)(?<unit>km|mi)\s(?<activity>\w+)/;
	const DistanceActivityEdgeCase = /^Completed a (?<distance>\d+\.\d+)\s(?<unit>km|mi)\s(?<activity>\w+)\b/;
	const ExtractMajorityTime = /Just\s(\w+\s)?(an|a)\s*(?<activity>.*?)\s+in/;
	// debugger; 
	function ExtractType(tweet){
		// Check If Distance 
		let DistanceActivity = tweet.text.match(ExtractMajorityDistance);
		if (DistanceActivity) { return DistanceActivity; }
	
		// Check Distance Activity Edge Case
		DistanceActivity = tweet.text.match(DistanceActivityEdgeCase);
		if (DistanceActivity) {return DistanceActivity;}

		// Parsing Majority of Time Activities 
		DistanceActivity = tweet.text.match(ExtractMajorityTime);
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
		
	}
	

	// Number of Activities
	const ActivityCount = Object.entries(ActivityList).length;
	let ElementToReplace = document.getElementById("numberActivities");
	ElementToReplace.innerText = String(ActivityCount);
	
	// Top 3 Activities
	const top3 = ['firstMost', 'secondMost', 'thirdMost'];
	const sorted = Object.entries(ActivityList).sort( ([,A],[,B]) => B.count - A.count);
	const top3Act = {}
	for (let i=0; i<3; i++){ 
		// replaceElement(top3[i], sorted[i][0]); 
		const activity = sorted[i][0];
		const id = top3[i];
		let ElementToReplace = document.getElementById(id);
		ElementToReplace.innerText = activity;

		// storing element and average distance
		top3Act[activity] = parseFloat(ActivityList[activity].totalDistance) / parseInt(ActivityList[activity].count);
	}
	
	// Sort Averages of Top 3 Activities 
	const sortedAveragesOfTop3 = Object.entries(top3Act).sort(([,a],[,b]) => b-a );
	const longestAverageDistance = sortedAveragesOfTop3[0][0];
	const shortestActivityType = sortedAveragesOfTop3[sortedAveragesOfTop3.length-1][0];
	ElementToReplace = document.getElementById('longestActivityType');
	ElementToReplace.innerText = longestAverageDistance;
	ElementToReplace = document.getElementById('shortestActivityType');
	ElementToReplace.innerText = shortestActivityType;
	
	// Weekend or Weekday
	for (const tweet of tweet_array){ 
		// COMPLETE
		if (!tweet.isCompletedEvent){ continue; }
		const DistanceActivity = ExtractType(tweet);
		
	}

	for (const tweet of tweet_array) {
		if (!tweet.isCompletedEvent){ continue; }
		if (ExtractType(tweet) === null) { continue; }
		if (ExtractType(tweet).groups.activity != longestAverageDistance) { continue; }

		const date = tweet.time.getDay();
		if (date === 0 || date === 6) { 
			const currentWeekendCount = parseInt(ActivityList[longestAverageDistance].weekend) + 1;
			ActivityList[longestAverageDistance].weekend = currentWeekendCount;

		}
		else {
			const currentWeekdayCount = parseInt(ActivityList[longestAverageDistance].weekday) + 1;
			ActivityList[longestAverageDistance].weekday = currentWeekdayCount;
		}
	}

	// weekend or weekday
	const weekendCount = parseInt(ActivityList[longestAverageDistance].weekend);
	
	const weekdayCount = parseInt(ActivityList[longestAverageDistance].weekday);
	const weekType = weekendCount > weekdayCount ? "weekends" : "weekdays"; 
	ElementToReplace = document.getElementById('weekdayOrWeekendLonger');
	ElementToReplace.innerText = weekType;

	// debugger;
	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	
	let data = Object.entries(ActivityList).map( ([actualActName , LiteralProperties]) => 
		{
			return {
				activities: actualActName,
				count: LiteralProperties.count
			}
		}
	);
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values": data},
	//   "height": {"step": 250},
	  "mark": "bar", 
	  "encoding": {
		"y": {
			"field": "activities", 
			"type": "nominal", 
			"axis": {
				"labelAngle": 0,
				// "labelAlign": "right",
				// "labelBaseline": "middle"
				"titleAngle": 0
			},
			"sort": "-x"
		},
		"x": {
			"field": "count", 
			"type": "quantitative", 
			"axis": {"labelAngle": 0},
			// "scale": {"type": "log"}
			}
		}

	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});